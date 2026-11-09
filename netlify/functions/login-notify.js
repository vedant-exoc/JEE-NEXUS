const crypto = require('crypto');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed.' }) };
  }

  try {
    const { action, email, token } = JSON.parse(event.body || '{}');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Supabase configuration missing. Add project URL and service-role key to Netlify environment variables.' })
      };
    }

    if (action === 'create') {
      if (!email) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Email is required.' }) };
      }

      const invitationToken = crypto.randomBytes(24).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

      const response = await fetch(`${supabaseUrl}/rest/v1/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
          email,
          token: invitationToken,
          expires_at: expiresAt,
          status: 'pending'
        })
      });

      const result = await response.json();
      if (!response.ok) {
        return { statusCode: 400, body: JSON.stringify({ error: result?.message || 'Could not create invitation.' }) };
      }

      const inviteLink = `${process.env.APP_URL || 'https://moonlit-conkies-a1ae32.netlify.app'}/?invite=${invitationToken}`;
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Invitation generated successfully.',
          inviteLink,
          token: invitationToken
        })
      };
    }

    if (action === 'validate') {
      if (!email || !token) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Email and token are required.' }) };
      }

      const query = `email=eq.${encodeURIComponent(email)}&token=eq.${encodeURIComponent(token)}&status=eq.pending`;
      const response = await fetch(`${supabaseUrl}/rest/v1/invitations?${query}`, {
        method: 'GET',
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`
        }
      });

      const records = await response.json();
      if (!response.ok || !records.length) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or expired invitation.' }) };
      }

      const invite = records[0];
      const expiresAt = new Date(invite.expires_at);
      if (expiresAt < new Date()) {
        return { statusCode: 400, body: JSON.stringify({ error: 'This invitation has expired.' }) };
      }

      const markUsed = await fetch(`${supabaseUrl}/rest/v1/invitations?id=eq.${invite.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ status: 'used', used_at: new Date().toISOString() })
      });

      if (!markUsed.ok) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Could not finalize invitation.' }) };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Invitation validated. Proceed with account creation.',
          password: 'JeeNexus@2026'
        })
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Unknown action.' }) };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Unexpected server error.' })
    };
  }
};

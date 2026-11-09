const sendMail = async ({ to, subject, html }) => {
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'JEE NEXUS <no-reply@example.com>',
        to,
        subject,
        html
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.message || 'Email sending failed.');
    }
    return payload;
  }

  if (process.env.SENDGRID_API_KEY) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: process.env.ADMIN_EMAIL || 'admin@example.com', name: 'JEE NEXUS' },
        subject,
        content: [{ type: 'text/html', value: html }]
      })
    });

    if (!response.ok) {
      throw new Error('SendGrid request failed.');
    }
    return { ok: true };
  }

  return { ok: true, skipped: true };
};

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed.' }) };
  }

  try {
    const { email, userId, appName } = JSON.parse(event.body || '{}');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

    if (!email || !userId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email and user id are required.' }) };
    }

    const subject = 'New Login Detected — JEE NEXUS';
    const html = `
      <div style="font-family: Arial, sans-serif; color: #0F172A;">
        <h2>New Login Detected — JEE NEXUS</h2>
        <p><strong>User email:</strong> ${email}</p>
        <p><strong>User id:</strong> ${userId}</p>
        <p><strong>Date:</strong> ${new Date().toISOString()}</p>
        <p><strong>Application:</strong> ${appName || 'JEE NEXUS'}</p>
      </div>
    `;

    const result = await sendMail({ to: adminEmail, subject, html });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, result })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Unexpected login notification error.' })
    };
  }
};

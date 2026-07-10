const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendViaBrevo({ to, subject, html }) {
  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: 'Two Blondes - Web', email: process.env.EMAIL_USER },
      to: [{ email: to }],
      subject,
      htmlContent: html
    })
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Brevo respondio con error ${res.status}: ${errorBody}`);
  }
}

async function sendVerificationEmail(request) {
  const base = process.env.PUBLIC_URL || 'http://localhost:3000';
  const verifyUrl = `${base}/api/admin/verify/${request.token}`;

  await sendViaBrevo({
    to: request.email,
    subject: 'Confirma tu solicitud de acceso - Two Blondes',
    html: `
      <p>Hola${request.name ? ' ' + request.name : ''},</p>
      <p>Has pedido acceso de administrador a la web de Two Blondes. Confirma tu email para que se envie la solicitud:</p>
      <p>
        <a href="${verifyUrl}" style="background:#16223F;color:#F5EFE1;padding:10px 18px;border-radius:4px;text-decoration:none;">Confirmar mi email</a>
      </p>
      <p style="color:#888;font-size:0.85em;">Si no has sido tu quien lo ha pedido, ignora este correo.</p>
    `
  });
}

async function sendAccessRequestEmail(request) {
  const base = process.env.PUBLIC_URL || 'http://localhost:3000';
  const approveUrl = `${base}/api/admin/approve/${request.token}`;
  const rejectUrl = `${base}/api/admin/reject/${request.token}`;

  await sendViaBrevo({
    to: process.env.OWNER_EMAIL,
    subject: 'Nueva solicitud de acceso admin (verificada) - Two Blondes',
    html: `
      <p>Alguien ha confirmado su email y pide acceso de administrador a la web de Two Blondes.</p>
      <p><strong>Nombre:</strong> ${request.name || '(no indicado)'}</p>
      <p><strong>Email:</strong> ${request.email}</p>
      <p><strong>Motivo:</strong> ${request.motivo || '(no indicado)'}</p>
      <p>
        <a href="${approveUrl}" style="background:#16223F;color:#F5EFE1;padding:10px 18px;border-radius:4px;text-decoration:none;">Aprobar acceso</a>
        &nbsp;&nbsp;
        <a href="${rejectUrl}" style="color:#a13a3a;">Rechazar</a>
      </p>
      <p style="color:#888;font-size:0.85em;">Si apruebas, se generara una contraseña y se enviara automaticamente a ${request.email}.</p>
    `
  });
}

async function sendApprovedEmail(email, plainPassword) {
  await sendViaBrevo({
    to: email,
    subject: 'Acceso admin aprobado - Two Blondes',
    html: `
      <p>Tu solicitud de acceso admin a la web de Two Blondes ha sido aprobada.</p>
      <p>Tu contraseña de acceso es:</p>
      <p style="font-size:1.3em;font-weight:bold;letter-spacing:1px;">${plainPassword}</p>
      <p>Entra en la web, pulsa el icono de edicion, elige "Ya tengo contraseña" e introducela ahi.</p>
    `
  });
}

async function sendRejectedEmail(email) {
  await sendViaBrevo({
    to: email,
    subject: 'Solicitud de acceso - Two Blondes',
    html: `<p>Tu solicitud de acceso admin a la web de Two Blondes no ha sido aprobada.</p>`
  });
}

module.exports = {
  sendVerificationEmail,
  sendAccessRequestEmail,
  sendApprovedEmail,
  sendRejectedEmail
};
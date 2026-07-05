const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendAccessRequestEmail(request) {
  const base = process.env.PUBLIC_URL || 'http://localhost:3000';
  const approveUrl = `${base}/api/admin/approve/${request.token}`;
  const rejectUrl = `${base}/api/admin/reject/${request.token}`;

  await transporter.sendMail({
    from: `"Two Blondes - Web" <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: 'Nueva solicitud de acceso admin - Two Blondes',
    html: `
      <p>Alguien ha pedido acceso de administrador a la web de Two Blondes.</p>
      <p><strong>Email:</strong> ${request.email}</p>
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
  await transporter.sendMail({
    from: `"Two Blondes - Web" <${process.env.EMAIL_USER}>`,
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
  await transporter.sendMail({
    from: `"Two Blondes - Web" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Solicitud de acceso - Two Blondes',
    html: `<p>Tu solicitud de acceso admin a la web de Two Blondes no ha sido aprobada.</p>`
  });
}

module.exports = { sendAccessRequestEmail, sendApprovedEmail, sendRejectedEmail };

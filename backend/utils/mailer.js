const env = require('../config/env');

let transporter = null;
function getTransporter() {
  if (!env.SMTP_HOST) return null;
  if (!transporter) {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

/** Envia o e-mail. Sem SMTP: em desenvolvimento escreve o conteúdo no console; em produção só registra o aviso. */
async function sendMail({ to, subject, text }) {
  const t = getTransporter();
  if (!t) {
    if (!env.isProd) console.log(`\n[EcoClick][e-mail não enviado: SMTP não configurado]\nPara: ${to}\nAssunto: ${subject}\n${text}\n`);
    else console.warn('[EcoClick] SMTP não configurado: e-mail não enviado.');
    return false;
  }
  await t.sendMail({ from: env.MAIL_FROM, to, subject, text });
  return true;
}

module.exports = { sendMail };

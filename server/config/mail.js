import nodemailer from 'nodemailer';

const isConfigured = () => Boolean(
  process.env.SMTP_HOST?.trim()
  && process.env.SMTP_USER?.trim()
  && process.env.SMTP_PASSWORD?.trim(),
);

let transporter;

const getTransporter = () => {
  if (!isConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    });
  }
  return transporter;
};

const send = async (message) => {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return false;

  try {
    await mailTransporter.sendMail(message);
    return true;
  } catch (error) {
    console.error('SMTP email delivery failed:', error.code || 'UNKNOWN', error.message);
    throw error;
  }
};

export const sendPasswordResetEmail = async ({ email, name, token }) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?mode=reset&token=${encodeURIComponent(token)}`;
  const transporter = getTransporter();

  if (!transporter) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`Password reset link for ${email}: ${resetUrl}`);
    }
    return { sent: false, configured: false };
  }

  await send({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Reset your VisualDSA password',
    text: `Hi ${name || 'there'},\n\nReset your VisualDSA password here: ${resetUrl}\n\nThis link expires in one hour.`,
    html: `<p>Hi ${name || 'there'},</p><p>Reset your VisualDSA password by clicking <a href="${resetUrl}">this link</a>.</p><p>This link expires in one hour.</p>`,
  });

  return { sent: true, configured: true };
};

export const sendSignupVerificationEmail = async ({ email, name, code }) => {
  const transporter = getTransporter();
  if (!transporter) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`Signup verification code for ${email}: ${code}`);
    }
    return { sent: false, configured: false };
  }

  await send({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Verify your VisualDSA account',
    text: `Hi ${name || 'there'},\n\nYour VisualDSA verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Hi ${name || 'there'},</p><p>Your VisualDSA verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });

  return { sent: true, configured: true };
};

export const isMailConfigured = () => isConfigured();
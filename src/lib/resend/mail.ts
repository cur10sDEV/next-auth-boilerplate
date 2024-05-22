import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const confirmLink = `${process.env.basePath}/auth/verify?token=${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm your email",
      html: `
      <p>Click the below button to confirm your email. The link will expire after one hour.</p>
      <a href=${confirmLink}>Verify</a>
    `,
    });
  } catch (error) {
    console.error("Error sending verification email!");
    return null;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const passwordResetLink = `${process.env.basePath}/auth/new-password?token=${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: `
      <p>Click the below button to reset your password. The link will expire after one hour.</p>
      <a href=${passwordResetLink}>Verify</a>
    `,
    });
  } catch (error) {
    console.error("Error sending password reset email!");
    return null;
  }
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Two Factor (2FA) Code. Your code is only valid for 10 minutes.",
      html: `
      <p>Your 2FA code is: ${token}</p>
      `,
    });
  } catch (error) {
    console.error("Error sending two factor email!");
    return null;
  }
};

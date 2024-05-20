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
      <p>Click the below button to confirm your email.</p>
      <a href=${confirmLink}>Verify</a>
    `,
    });
  } catch (error) {
    return null;
  }
};

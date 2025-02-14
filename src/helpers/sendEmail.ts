import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verify";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "aFeedback - Verify your email address",
      react: VerificationEmail({ username, otp: verificationCode }),
    });
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email", error);
    return { success: false, message: "Failed to send email" };
  }
}

import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

// Define a type for the email object parameter
interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET"; // Only allow "VERIFY" or "RESET"
  userId: string;
}

// Function to send email for verification or password reset
export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailParams) => {
  try {
    // Generate a hashed token using the user ID
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // If emailType is "VERIFY", update the user's verify token and its expiry in the database
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        // using $set to ensure that the verifyToken and verifyTokenExpiry fields are updated without affecting the rest of the user document.
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000, // Token valid for 1 hour
        },
      });
    } else if (emailType === "RESET") {
      // If emailType is "RESET", update the user's forgot password token and its expiry in the database
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000, // Token valid for 1 hour
        },
      });
    }

    // Set up the email transporter (using Ethereal for testing)
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0675d7b7f08efb",
        pass: "c5a5791611c8a1",
      },
    });

    // Email options, setting subject based on emailType
    const mailOptions = {
      from: "sabeh@sabeh.ai",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to
      ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
      or copy and paste the link below in your browser. <br> ${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}</p>`,
    };

    // Send email and return the response
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: unknown) {
    // Throw error if email sending fails
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};

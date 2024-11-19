import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

// Function to send email for verification or password reset
export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // Generate a hashed token using the user ID
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // If emailType is "VERIFY", update the user's verify token and its expiry in the database
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // Token valid for 1 hour
      });
    } else if (emailType === "RESET") {
      // If emailType is "RESET", update the user's forgot password token and its expiry in the database
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // Token valid for 1 hour
      });
    }

    // Set up the email transporter (using Ethereal for testing)
    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "0675d7b7f08efb",
        pass: "c5a5791611c8a1",
      },
    }); // Email options, setting subject based on emailType
    const mailOptions = {
      from: "sabeh@sabeh.ai",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to
      ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
      or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`, // HTML body content for email
    };

    // Send email and return the response
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message); // Throw error if email sending fails
  }
};

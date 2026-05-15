import { catchAsyncError } from "../middlewares/catchAsyncError.js";

import { ErrorHandler } from "../middlewares/errorMiddleware.js";

import {sendEmail} from "../utils/sendEmail.js";


// SEND CONTACT MESSAGE
export const sendContactMessage =
  catchAsyncError(
    async (req, res, next) => {

      const {
        name,
        email,
        subject,
        message,
      } = req.body;

      // VALIDATION
      if (
        !name ||
        !email ||
        !subject ||
        !message
      ) {
        return next(
          new ErrorHandler(
            "Please fill all fields.",
            400
          )
        );
      }

      // EMAIL CONTENT
      const emailMessage = `
New PharmaAssist Contact Message

Name: ${name}

Email: ${email}

Subject: ${subject}

Message:
${message}
`;

      // SEND EMAIL
      await sendEmail({
        email:
          process.env.SMTP_MAIL,

        subject:
          `PharmaAssist Contact: ${subject}`,

        message:
          emailMessage,
      });

      res.status(200).json({
        success: true,

        message:
          "Message sent successfully.",
      });
    }
  );
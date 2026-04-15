export const generateEmailTemplate = (resetPasswordUrl) => {
  return `
    <div style="font-family: Arial; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd;">
      
      <h2>Password Reset Request</h2>

      <p>You requested to reset your password.</p>

      <p>Click the button below to reset your password:</p>

      <div style="margin:20px 0;">
        <a href="${resetPasswordUrl}" 
           style="padding:10px 20px; background:black; color:white; text-decoration:none;">
           Reset Password
        </a>
      </div>

      <p>If you didn't request this, please ignore this email.</p>

      <p>This link will expire in 15 minutes.</p>

    </div>
  `;
};
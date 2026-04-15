import crypto from "crypto";

export const generatePasswordResetToken = () => {

    const resetToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    const tokenExpiry = Date.now() + 15 * 60 * 1000;

    return { resetToken, hashedToken, tokenExpiry };
};
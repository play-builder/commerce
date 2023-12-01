import { NextResponse } from "next/server";
import crypto from "crypto";

import startDb from "#/src/lib/db";
import PasswordResetTokenModel from "#/src/models/passwordResetTokenModel";
import UserModel from "#/src/models/userModel";
import { ForgetPasswordRequest } from "#/src/types";
import { sendEmail } from "#/src/lib/email";

export const POST = async (req: Request) => {
  try {
    const { email } = (await req.json()) as ForgetPasswordRequest;
    if (!email)
      return NextResponse.json({ error: "Invalid Email" }, { status: 401 });

    startDb();
    const user = await UserModel.findOne({ email });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Generate the token

    await PasswordResetTokenModel.findOneAndDelete({ user: user._id });
    const token = crypto.randomBytes(36).toString("hex");

    await PasswordResetTokenModel.create({ user: user._id, token });

    // send the URL link to the given mail
    const resetPasswordLink = `${process.env.PASSWORD_RESET_URL}?token=${token}?userId=${user._id}`;

    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "forget-password",
      linkUrl: resetPasswordLink,
    });

    return NextResponse.json({ message: "Please Check your email" });
  } catch (err) {
    return NextResponse.json({ error: (err as any).message }, { status: 500 });
  }
};

import crypto from "crypto";
import nodemailer from "nodemailer";

import startDb from "#src/lib/db";
import { NewUserRequest } from "#src/types";
import { NextResponse } from "next/server";
import UserModel from "#src/models/userModel";
import { sendEmail } from "#lib/email";
import EmailVerificationToken from "#src/models/emailVerificationToken";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();

  const newUser = await UserModel.create({
    ...body,
  });

  const token = crypto.randomBytes(36).toString("hex");
  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d6b62650fbe259",
      pass: "821db9f903a3fd",
    },
  });

  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  transport.sendMail({
    from: "verification@test.com",
    to: newUser.email,
    html: `<h1>Please verify your email by clicking on <a href="${verificationUrl}">this link</a></h1>`,
  });

  // const verificationUrl = `${process.env.VERIFICATION_URL}?token=${token}&userId=${newUser._id}`;

  // await sendEmail({
  //   profile: { name: newUser.name, email: newUser.email },
  //   subject: "verification",
  //   linkUrl: verificationUrl,
  // });

  return NextResponse.json({ message: "Please check your email" });
};

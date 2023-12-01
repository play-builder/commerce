import startDb from "#/src/lib/db";
import PasswordResetTokenModel from "#/src/models/passwordResetTokenModel";
import UpdatePassword from "#/src/ui/UpdatePassword";
import { notFound } from "next/navigation";
import React from "react";

const fetchTokenValidation = async (token: string, userId: string) => {
  await startDb();

  const resetToken = await PasswordResetTokenModel.findOne({ user: userId });

  if (!resetToken) return null;

  const matched = await resetToken.compareToken(token);
  if (!matched) return null;
  return true;
};

interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}

export default async function ResetPassword({ searchParams }: Props) {
  const { token, userId } = searchParams;
  if (!token || !userId) return notFound();

  const isValid = await fetchTokenValidation(token, userId);

  if (!isValid) return notFound();

  return <UpdatePassword token={token} userId={userId} />;
}

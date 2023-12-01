"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

export default function AuthSession({ children }: any) {
  return <SessionProvider>{children}</SessionProvider>;
}

import React, { ReactNode } from "react";
import Navbar from "#components/Navbar";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

interface Props {
  children: ReactNode;
}

export default async function GuestLayout({ children }: Props) {
  const session = await getServerSession();
  console.log("session", session);

  if (session) return redirect("/");

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

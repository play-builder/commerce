import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";

import Notification from "#/src/components/Notification";
import AuthSession from "#/src/utils/AuthSession";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSession>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className}>
          {children}
          <Notification />
        </body>
      </html>
    </AuthSession>
  );
}

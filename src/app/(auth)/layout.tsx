import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autentikasi - E-Commerce Elektronik",
  description: "Login dan register untuk E-Commerce Elektronik",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen flex items-center justify-center bg-muted">{children}</div>;
}
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Tableegh Track",
  description: "Sign in to access your Islamic dawat tracking dashboard",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
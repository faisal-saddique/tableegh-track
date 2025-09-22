import Link from "next/link";
import { redirect } from "next/navigation";
import { type Metadata } from "next";

import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Dashboard - Tableegh Track",
  description: "Islamic dawat tracking dashboard with statistics and quick actions",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-emerald-800">
                Tableegh Track
              </h1>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/contacts"
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contacts
              </Link>
              <Link
                href="/dashboard/blocks"
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Blocks
              </Link>
              <Link
                href="/dashboard/visits"
                className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Visits
              </Link>
            </nav>

            {/* User Info and Sign Out */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:block text-sm text-gray-700 truncate max-w-24">
                {session.user.name}
              </span>
              <Link
                href="/api/auth/signout"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="grid grid-cols-4 h-16">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <span className="text-lg">📊</span>
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
          <Link
            href="/dashboard/contacts"
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <span className="text-lg">👥</span>
            <span className="text-xs font-medium">Contacts</span>
          </Link>
          <Link
            href="/dashboard/blocks"
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <span className="text-lg">🏘️</span>
            <span className="text-xs font-medium">Blocks</span>
          </Link>
          <Link
            href="/dashboard/visits"
            className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <span className="text-lg">📝</span>
            <span className="text-xs font-medium">Visits</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20 lg:pb-6">
        <div className="px-4 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <HydrateClient>
        <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
          {/* Navigation */}
          <nav className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <div className="flex items-center space-x-2">
                <img src="/favicon.svg" alt="Tableegh Track" className="w-8 h-8" />
                <span className="text-xl font-bold text-emerald-800">Tableegh Track</span>
              </div>
              <Link
                href="/api/auth/signin"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-4xl mx-auto">
                <div className="mb-8">
                  <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
                    بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Organize Your
                  <span className="text-emerald-600 block">Dawat Efforts</span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  A comprehensive Islamic dawat tracking system designed for housing societies and communities.
                  Track contacts, visits, and follow-ups with ease.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/api/auth/signin"
                    className="bg-emerald-600 text-white px-8 py-4 rounded-xl hover:bg-emerald-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                  <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors text-lg font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Everything You Need
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Comprehensive tools to manage your dawat activities with Islamic values at the core
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Management</h3>
                  <p className="text-gray-600">
                    Keep detailed records of people you meet during dawat with their preferences and notes
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Tracking</h3>
                  <p className="text-gray-600">
                    Record your dawat visits with responses, duration, and follow-up requirements
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏘️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Block Organization</h3>
                  <p className="text-gray-600">
                    Organize contacts by housing blocks and track progress across different areas
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
                  <p className="text-gray-600">
                    View statistics and track your dawat progress with meaningful insights
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Follow-up Reminders</h3>
                  <p className="text-gray-600">
                    Never miss important follow-ups with automated reminders and scheduling
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
                  <p className="text-gray-600">
                    Access your dawat records anywhere with our responsive mobile design
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Islamic Values Section */}
          <section className="px-4 sm:px-6 lg:px-8 py-20 bg-emerald-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Built with Islamic Values
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Our platform is designed with respect for Islamic principles and the noble work of dawat
              </p>

              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="text-2xl text-emerald-600 mb-4 font-arabic">
                  "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ وَرَسُولُهُ وَالْمُؤْمِنُونَ"
                </div>
                <p className="text-gray-600 italic">
                  "And say: Work, so Allah will see your work and His messenger and the believers."
                </p>
                <p className="text-sm text-gray-500 mt-2">At-Tawbah 9:105</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-900">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Start Your Dawat Journey Today
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join the platform designed to make dawat tracking simple, organized, and effective
              </p>
              <Link
                href="/api/auth/signin"
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl hover:bg-emerald-700 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl inline-block"
              >
                Begin Tracking Your Dawat
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <img src="/favicon.svg" alt="Tableegh Track" className="w-8 h-8" />
                <span className="text-xl font-bold">Tableegh Track</span>
              </div>
              <p className="text-gray-400 text-sm">
                May Allah (SWT) accept this effort and make it beneficial for the Ummah.
              </p>
            </div>
          </footer>
        </main>
      </HydrateClient>
    );
  }

  redirect("/dashboard");
}

"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

function StatCard({
  title,
  value,
  subtitle,
  color = "emerald",
  href
}: {
  title: string;
  value: number;
  subtitle?: string;
  color?: "emerald" | "blue" | "purple" | "orange";
  href?: string;
}) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };

  const content = (
    <div className={`p-4 sm:p-6 rounded-xl border ${colorClasses[color]} hover:shadow-md transition-all duration-200`}>
      <div className="text-xl sm:text-2xl font-bold">{value.toLocaleString()}</div>
      <div className="text-sm font-medium mt-1">{title}</div>
      {subtitle && <div className="text-xs opacity-75 mt-1">{subtitle}</div>}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Link
          href="/dashboard/contacts/new"
          className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">👤</div>
            <div className="text-sm font-medium text-gray-700">Add Contact</div>
          </div>
        </Link>
        <Link
          href="/dashboard/visits/new"
          className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-medium text-gray-700">Record Visit</div>
          </div>
        </Link>
        <Link
          href="/dashboard/blocks"
          className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 sm:col-span-2 lg:col-span-1"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🏘️</div>
            <div className="text-sm font-medium text-gray-700">View Blocks</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function RecentActivity() {
  const { data: recentVisits, isLoading } = api.visit.getRecentActivity.useQuery({ days: 7 });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-3">
              <div className="bg-gray-200 rounded-full h-8 w-8 flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-gray-200 rounded h-4 w-3/4"></div>
                <div className="bg-gray-200 rounded h-3 w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {recentVisits?.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">No recent visits recorded</p>
        ) : (
          recentVisits?.map((visit) => (
            <div key={visit.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="bg-emerald-100 rounded-full p-2 flex-shrink-0">
                <span className="text-emerald-600 text-sm">📋</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  Visit to {visit.contact.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {visit.block.name} • {visit.purpose}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(visit.visitDate).toLocaleDateString()}
                </div>
                {visit.response && (
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">{visit.response}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {recentVisits && recentVisits.length > 0 && (
        <div className="mt-4 text-center">
          <Link
            href="/dashboard/visits"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center"
          >
            View all visits →
          </Link>
        </div>
      )}
    </div>
  );
}

function FollowUpReminders() {
  const { data: followUps, isLoading } = api.visit.getUpcomingFollowUps.useQuery();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Reminders</h3>
        <div className="animate-pulse space-y-3">
          <div className="bg-gray-200 rounded h-4 w-full"></div>
          <div className="bg-gray-200 rounded h-4 w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Reminders</h3>
      <div className="space-y-3">
        {followUps?.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">No upcoming follow-ups</p>
        ) : (
          followUps?.map((visit) => (
            <div key={visit.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {visit.contact.name}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {visit.block.name}
                </div>
                <div className="text-xs text-orange-600">
                  Due: {visit.followUpDate ? new Date(visit.followUpDate).toLocaleDateString() : 'Soon'}
                </div>
              </div>
              <Link
                href={`/dashboard/contacts/${visit.contact.id}`}
                className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors flex-shrink-0 ml-3"
              >
                View
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats } = api.contact.getStats.useQuery();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-xs sm:text-sm text-gray-500">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Contacts"
          value={stats?.totalContacts ?? 0}
          color="emerald"
          href="/dashboard/contacts"
        />
        <StatCard
          title="Muslim Contacts"
          value={stats?.muslimContacts ?? 0}
          color="blue"
        />
        <StatCard
          title="Interested"
          value={stats?.interestedContacts ?? 0}
          color="purple"
        />
        <StatCard
          title="Recent Visits"
          value={stats?.recentVisits ?? 0}
          
          color="orange"
          href="/dashboard/visits"
        />
      </div>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <RecentActivity />
        <FollowUpReminders />
      </div>
    </div>
  );
}
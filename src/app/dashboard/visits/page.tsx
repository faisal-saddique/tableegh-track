"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

function VisitCard({ visit }: { visit: any }) {
  const visitDate = new Date(visit.visitDate);
  const isToday = visitDate.toDateString() === new Date().toDateString();
  const isThisWeek = (Date.now() - visitDate.getTime()) < (7 * 24 * 60 * 60 * 1000);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{visit.contact.name}</h3>
          <p className="text-sm text-gray-600 truncate">{visit.block.name} • {visit.purpose}</p>
        </div>
        <div className="text-right ml-3 flex-shrink-0">
          <div className="text-sm font-medium text-gray-900">
            {visitDate.toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">
            {isToday ? "Today" : isThisWeek ? "This week" : "Earlier"}
          </div>
        </div>
      </div>

      {visit.response && (
        <div className="mb-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Response:</span> {visit.response}
          </p>
        </div>
      )}

      {visit.notes && (
        <div className="mb-3">
          <p className="text-sm text-gray-600 line-clamp-2">
            <span className="font-medium">Notes:</span> {visit.notes}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span className="truncate">{visit.createdBy.name || visit.createdBy.email}</span>
          {visit.duration && <span className="whitespace-nowrap">{visit.duration} mins</span>}
          {visit.followUpNeeded && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full whitespace-nowrap">
              Follow-up needed
            </span>
          )}
        </div>
        <Link
          href={`/dashboard/contacts/${visit.contact.id}`}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium inline-block"
        >
          View Contact
        </Link>
      </div>
    </div>
  );
}

export default function VisitsPage() {
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");

  const { data: blocks } = api.block.getAll.useQuery();
  const { data: visitsData, isLoading } = api.visit.getAll.useQuery({
    blockId: selectedBlock || undefined,
    purpose: selectedPurpose || undefined,
  });

  const purposes = [
    "Dawat",
    "Follow-up",
    "Invitation",
    "Islamic Discussion",
    "Friendly Visit",
    "Emergency",
    "Other"
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Visits</h1>
        <Link
          href="/dashboard/visits/new"
          className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors text-center text-sm font-medium"
        >
          Record New Visit
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Block
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
            >
              <option value="">All Blocks</option>
              {blocks?.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Purpose
            </label>
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
            >
              <option value="">All Purposes</option>
              {purposes.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedBlock("");
                setSelectedPurpose("");
              }}
              className="w-full sm:w-auto px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-4 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visitsData?.visits.map((visit) => (
            <VisitCard key={visit.id} visit={visit} />
          ))}
        </div>
      )}

      {visitsData?.visits.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No visits found</div>
          <p className="text-gray-400 mb-4 text-sm">
            {selectedBlock || selectedPurpose
              ? "Try adjusting your filters"
              : "Start by recording your first visit"}
          </p>
          <Link
            href="/dashboard/visits/new"
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors inline-block"
          >
            Record New Visit
          </Link>
        </div>
      )}
    </div>
  );
}
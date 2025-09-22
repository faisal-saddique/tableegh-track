"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";

type Block = RouterOutputs["block"]["getAll"][0];

function BlockCard({ block }: { block: Block }) {
  return (
    <Link
      href={`/dashboard/blocks/${block.id}`}
      className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-200 block"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{block.name}</h3>
          {block.description && (
            <p className="text-sm text-gray-600 mt-1 truncate">{block.description}</p>
          )}
        </div>
        <div className="text-right ml-3 flex-shrink-0">
          <div className="text-xl sm:text-2xl font-bold text-emerald-600">
            {block._count.people}
          </div>
          <div className="text-xs text-gray-500">contacts</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center mb-4">
        <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
          <div className="text-sm sm:text-lg font-semibold text-blue-600">
            {block._count.visits}
          </div>
          <div className="text-xs text-blue-600">Total Visits</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2 sm:p-3">
          <div className="text-sm sm:text-lg font-semibold text-green-600">0</div>
          <div className="text-xs text-green-600">This Week</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-2 sm:p-3">
          <div className="text-sm sm:text-lg font-semibold text-purple-600">0</div>
          <div className="text-xs text-purple-600">Follow-ups</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <span className="text-xs text-gray-500">
          Updated {new Date(block.updatedAt).toLocaleDateString()}
        </span>
        <span className="text-emerald-600 text-sm font-medium">
          View Details →
        </span>
      </div>
    </Link>
  );
}

export default function BlocksPage() {
  const { data: blocks, isLoading } = api.block.getAll.useQuery();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Blocks</h1>
        <div className="text-sm text-gray-500">
          View dawat progress by housing blocks
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="bg-gray-100 rounded-lg p-2 sm:p-3">
                    <div className="h-6 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {blocks?.map((block) => (
            <BlockCard key={block.id} block={block} />
          ))}
        </div>
      )}

      {blocks?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No blocks found</div>
          <p className="text-gray-400 mb-4 text-sm">
            Contact your administrator to set up housing blocks
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Block Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-4 bg-emerald-50 rounded-lg">
            <div className="text-lg sm:text-2xl font-bold text-emerald-600">
              {blocks?.reduce((sum, block) => sum + block._count.people, 0) ?? 0}
            </div>
            <div className="text-xs sm:text-sm text-emerald-600">Total Contacts</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
            <div className="text-lg sm:text-2xl font-bold text-blue-600">
              {blocks?.reduce((sum, block) => sum + block._count.visits, 0) ?? 0}
            </div>
            <div className="text-xs sm:text-sm text-blue-600">Total Visits</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
            <div className="text-lg sm:text-2xl font-bold text-purple-600">
              {blocks?.length ?? 0}
            </div>
            <div className="text-xs sm:text-sm text-purple-600">Active Blocks</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
            <div className="text-lg sm:text-2xl font-bold text-orange-600">
              {blocks?.reduce((sum, block) => sum + block._count.people, 0) ?
                Math.round((blocks.reduce((sum, block) => sum + block._count.visits, 0) / blocks.reduce((sum, block) => sum + block._count.people, 0)) * 100) / 100 : 0}
            </div>
            <div className="text-xs sm:text-sm text-orange-600">Avg Visits/Contact</div>
          </div>
        </div>
      </div>
    </div>
  );
}
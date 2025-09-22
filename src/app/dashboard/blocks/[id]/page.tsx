"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";

function BlockHeader({ block }: { block: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{block.name}</h1>
          {block.description && (
            <p className="text-gray-600 mt-1">{block.description}</p>
          )}
        </div>
        <Link
          href={`/dashboard/contacts/new?blockId=${block.id}`}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Add Contact
        </Link>
      </div>
    </div>
  );
}

function BlockStats({ blockId }: { blockId: string }) {
  const { data: stats, isLoading } = api.block.getStats.useQuery({ id: blockId });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Block Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg p-4">
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Block Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-emerald-50 rounded-lg">
          <div className="text-2xl font-bold text-emerald-600">
            {stats?.totalPeople || 0}
          </div>
          <div className="text-sm text-emerald-600">Total People</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {stats?.muslimPeople || 0}
          </div>
          <div className="text-sm text-blue-600">Muslims</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {stats?.interestedPeople || 0}
          </div>
          <div className="text-sm text-purple-600">Interested</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {stats?.recentVisits || 0}
          </div>
          <div className="text-sm text-orange-600">Recent Visits</div>
        </div>
      </div>
    </div>
  );
}

function ContactsList({ block }: { block: any }) {
  if (!block.people || block.people.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Contacts in {block.name}</h2>
          <Link
            href={`/dashboard/contacts/new?blockId=${block.id}`}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Add First Contact
          </Link>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">👥</div>
          <p className="text-gray-500">No contacts in this block yet</p>
          <p className="text-gray-400 text-sm">Start by adding your first contact</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Contacts in {block.name} ({block.people.length})
        </h2>
        <Link
          href={`/dashboard/contacts/new?blockId=${block.id}`}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
        >
          Add New Contact
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {block.people.map((contact: any) => (
          <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{contact.name}</h3>
                {contact.houseNumber && (
                  <p className="text-sm text-gray-500">House {contact.houseNumber}</p>
                )}
              </div>
              <div className="flex space-x-1">
                {contact.isMuslim && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Muslim
                  </span>
                )}
                {contact.isInterested && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Interested
                  </span>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              {contact.phoneNumber && (
                <p>📞 {contact.phoneNumber}</p>
              )}
              {contact.occupation && (
                <p>💼 {contact.occupation}</p>
              )}
            </div>

            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {contact._count.visits} visits
              </span>
              <div className="flex space-x-2">
                <Link
                  href={`/dashboard/visits/new?contactId=${contact.id}`}
                  className="bg-emerald-600 text-white px-2 py-1 rounded text-xs hover:bg-emerald-700 transition-colors"
                >
                  Visit
                </Link>
                <Link
                  href={`/dashboard/contacts/${contact.id}`}
                  className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BlockDetailPage() {
  const params = useParams();
  const blockId = params.id as string;

  const { data: block, isLoading, error } = api.block.getById.useQuery({
    id: blockId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !block) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">Block not found</div>
        <Link
          href="/dashboard/blocks"
          className="text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Blocks
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Link href="/dashboard/blocks" className="hover:text-gray-700">
          Blocks
        </Link>
        <span>→</span>
        <span>{block.name}</span>
      </div>

      <BlockHeader block={block} />
      <BlockStats blockId={blockId} />
      <ContactsList block={block} />
    </div>
  );
}
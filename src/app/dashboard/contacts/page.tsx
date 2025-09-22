"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

function ContactCard({ contact }: { contact: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{contact.name}</h3>
          {contact.fatherName && (
            <p className="text-sm text-gray-600 truncate">S/O {contact.fatherName}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-1 ml-2">
          {contact.isMuslim && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
              Muslim
            </span>
          )}
          {contact.isInterested && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
              Interested
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <span className="w-16 sm:w-20 font-medium flex-shrink-0">Block:</span>
          <span className="truncate">{contact.block.name}</span>
        </div>
        {contact.houseNumber && (
          <div className="flex items-center">
            <span className="w-16 sm:w-20 font-medium flex-shrink-0">House:</span>
            <span className="truncate">{contact.houseNumber}</span>
          </div>
        )}
        {contact.phoneNumber && (
          <div className="flex items-center">
            <span className="w-16 sm:w-20 font-medium flex-shrink-0">Phone:</span>
            <span className="truncate">{contact.phoneNumber}</span>
          </div>
        )}
        {contact.occupation && (
          <div className="flex items-center">
            <span className="w-16 sm:w-20 font-medium flex-shrink-0">Work:</span>
            <span className="truncate">{contact.occupation}</span>
          </div>
        )}
        {contact.timings && (
          <div className="flex items-center">
            <span className="w-16 sm:w-20 font-medium flex-shrink-0">Timing:</span>
            <span className="truncate">{contact.timings}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div className="text-xs text-gray-500">
          {contact._count.visits} visits • {new Date(contact.updatedAt).toLocaleDateString()}
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/visits/new?contactId=${contact.id}`}
            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-emerald-700 transition-colors"
          >
            Record Visit
          </Link>
          <Link
            href={`/dashboard/contacts/${contact.id}`}
            className="bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-gray-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");

  const { data: blocks } = api.block.getAll.useQuery();
  const { data: contactsData, isLoading } = api.contact.getAll.useQuery({
    search: search || undefined,
    blockId: selectedBlock || undefined,
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Contacts</h1>
        <Link
          href="/dashboard/contacts/new"
          className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors text-center text-sm font-medium"
        >
          Add New Contact
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Contacts
            </label>
            <input
              type="text"
              placeholder="Search by name, phone, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
            />
          </div>
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
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearch("");
                setSelectedBlock("");
              }}
              className="w-full sm:w-auto px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {contactsData?.contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}

      {contactsData?.contacts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No contacts found</div>
          <p className="text-gray-400 mb-4 text-sm">
            {search || selectedBlock
              ? "Try adjusting your search filters"
              : "Start by adding your first contact"}
          </p>
          <Link
            href="/dashboard/contacts/new"
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors inline-block"
          >
            Add New Contact
          </Link>
        </div>
      )}
    </div>
  );
}
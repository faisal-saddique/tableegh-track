"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";

type ContactDetail = RouterOutputs["contact"]["getById"];

function ContactHeader({ contact }: { contact: NonNullable<ContactDetail> }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
          {contact.fatherName && (
            <p className="text-gray-600">S/O {contact.fatherName}</p>
          )}
          <div className="mt-2 flex space-x-2">
            {contact.isMuslim && (
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                Muslim
              </span>
            )}
            {contact.isInterested && (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                Interested
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/dashboard/visits/new?contactId=${contact.id}`}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Record Visit
          </Link>
          <Link
            href={`/dashboard/contacts/${contact.id}/edit`}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

function ContactDetails({ contact }: { contact: NonNullable<ContactDetail> }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Block</label>
            <p className="text-gray-900">{contact.block.name}</p>
          </div>
          {contact.houseNumber && (
            <div>
              <label className="block text-sm font-medium text-gray-500">House Number</label>
              <p className="text-gray-900">{contact.houseNumber}</p>
            </div>
          )}
          {contact.phoneNumber && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Phone Number</label>
              <p className="text-gray-900">{contact.phoneNumber}</p>
            </div>
          )}
          {contact.occupation && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Occupation</label>
              <p className="text-gray-900">{contact.occupation}</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {contact.address && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Address</label>
              <p className="text-gray-900">{contact.address}</p>
            </div>
          )}
          {contact.timings && (
            <div>
              <label className="block text-sm font-medium text-gray-500">Preferred Timings</label>
              <p className="text-gray-900">{contact.timings}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-500">Added By</label>
            <p className="text-gray-900">{contact.createdBy.name ?? contact.createdBy.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Added On</label>
            <p className="text-gray-900">{new Date(contact.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
      {contact.notes && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-500 mb-2">Notes</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{contact.notes}</p>
        </div>
      )}
    </div>
  );
}

function VisitHistory({ contact }: { contact: NonNullable<ContactDetail> }) {
  if (!contact.visits || contact.visits.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Visit History</h2>
          <Link
            href={`/dashboard/visits/new?contactId=${contact.id}`}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            Record First Visit
          </Link>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📝</div>
          <p className="text-gray-500">No visits recorded yet</p>
          <p className="text-gray-400 text-sm">Start by recording your first visit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Visit History ({contact.visits.length})
        </h2>
        <Link
          href={`/dashboard/visits/new?contactId=${contact.id}`}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
        >
          Add New Visit
        </Link>
      </div>
      <div className="space-y-4">
        {contact.visits.map((visit) => (
          <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{visit.purpose}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(visit.visitDate).toLocaleDateString()} •{" "}
                  {visit.createdBy.name ?? visit.createdBy.email}
                </p>
              </div>
              {visit.duration && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {visit.duration} mins
                </span>
              )}
            </div>
            {visit.response && (
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Response:</span> {visit.response}
              </p>
            )}
            {visit.notes && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Notes:</span> {visit.notes}
              </p>
            )}
            {visit.followUpNeeded && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded">
                <p className="text-sm text-orange-800">
                  <span className="font-medium">Follow-up needed</span>
                  {visit.followUpDate && (
                    <span> by {new Date(visit.followUpDate).toLocaleDateString()}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContactDetailPage() {
  const params = useParams();
  const contactId = params.id as string;

  const { data: contact, isLoading, error } = api.contact.getById.useQuery({
    id: contactId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">Contact not found</div>
        <Link
          href="/dashboard/contacts"
          className="text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Contacts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Link href="/dashboard/contacts" className="hover:text-gray-700">
          Contacts
        </Link>
        <span>→</span>
        <span>{contact.name}</span>
      </div>

      <ContactHeader contact={contact} />
      <ContactDetails contact={contact} />
      <VisitHistory contact={contact} />
    </div>
  );
}
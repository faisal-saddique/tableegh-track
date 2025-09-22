"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

export default function NewVisitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedContactId = searchParams.get("contactId");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(preselectedContactId || "");
  const [selectedBlockId, setSelectedBlockId] = useState("");

  const { data: blocks, isLoading: blocksLoading } = api.block.getAll.useQuery();
  const { data: contacts, isLoading: contactsLoading } = api.contact.getAll.useQuery({
    blockId: selectedBlockId || undefined,
  });

  const createVisit = api.visit.create.useMutation({
    onSuccess: () => {
      router.push("/dashboard/visits");
    },
  });

  const selectedContact = contacts?.contacts.find(c => c.id === selectedContactId);

  useEffect(() => {
    if (selectedContact && !selectedBlockId) {
      setSelectedBlockId(selectedContact.blockId);
    }
  }, [selectedContact, selectedBlockId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const visitDateStr = formData.get("visitDate") as string;
    const visitTimeStr = formData.get("visitTime") as string;

    let visitDate = new Date();
    if (visitDateStr) {
      if (visitTimeStr) {
        visitDate = new Date(`${visitDateStr}T${visitTimeStr}`);
      } else {
        visitDate = new Date(visitDateStr);
      }
    }

    const data = {
      contactId: selectedContactId,
      blockId: selectedContact?.blockId || selectedBlockId,
      visitDate,
      purpose: formData.get("purpose") as string,
      response: formData.get("response") as string || undefined,
      duration: formData.get("duration") ? parseInt(formData.get("duration") as string) : undefined,
      followUpNeeded: formData.get("followUpNeeded") === "on",
      followUpDate: formData.get("followUpDate") ? new Date(formData.get("followUpDate") as string) : undefined,
      notes: formData.get("notes") as string || undefined,
    };

    try {
      await createVisit.mutateAsync(data);
    } catch (error) {
      console.error("Error creating visit:", error);
      setIsSubmitting(false);
    }
  };

  if (blocksLoading || contactsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Record New Visit</h1>
        <p className="text-gray-600">Document your dawat visit and follow-up actions</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Block
            </label>
            <select
              value={selectedBlockId}
              onChange={(e) => {
                setSelectedBlockId(e.target.value);
                if (!preselectedContactId) {
                  setSelectedContactId("");
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              disabled={!!preselectedContactId}
            >
              <option value="">Select Block</option>
              {blocks?.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              disabled={!!preselectedContactId}
            >
              <option value="">Select Contact</option>
              {contacts?.contacts
                .filter(contact => !selectedBlockId || contact.blockId === selectedBlockId)
                .map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} {contact.houseNumber ? `(House ${contact.houseNumber})` : ''}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visit Date
            </label>
            <input
              type="date"
              name="visitDate"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visit Time
            </label>
            <input
              type="time"
              name="visitTime"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose <span className="text-red-500">*</span>
            </label>
            <select
              name="purpose"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select Purpose</option>
              {purposes.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              min="1"
              max="600"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., 30"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Response Received
          </label>
          <textarea
            name="response"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="How did they respond to your dawat?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Any additional notes about the visit"
          />
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="followUpNeeded"
              id="followUpNeeded"
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="followUpNeeded" className="ml-2 block text-sm text-gray-900">
              Follow-up needed
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Date
            </label>
            <input
              type="date"
              name="followUpDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedContactId}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Recording..." : "Record Visit"}
          </button>
        </div>
      </form>
    </div>
  );
}
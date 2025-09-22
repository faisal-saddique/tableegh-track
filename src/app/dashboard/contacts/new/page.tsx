"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function NewContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: blocks, isLoading: blocksLoading } = api.block.getAll.useQuery();
  const createContact = api.contact.create.useMutation({
    onSuccess: () => {
      router.push("/dashboard/contacts");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      fatherName: formData.get("fatherName") as string || undefined,
      phoneNumber: formData.get("phoneNumber") as string || undefined,
      houseNumber: formData.get("houseNumber") as string || undefined,
      address: formData.get("address") as string || undefined,
      occupation: formData.get("occupation") as string || undefined,
      timings: formData.get("timings") as string || undefined,
      notes: formData.get("notes") as string || undefined,
      isMuslim: formData.get("isMuslim") === "on",
      isInterested: formData.get("isInterested") === "on",
      blockId: formData.get("blockId") as string,
    };

    try {
      await createContact.mutateAsync(data);
    } catch (error) {
      console.error("Error creating contact:", error);
      setIsSubmitting(false);
    }
  };

  if (blocksLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Contact</h1>
        <p className="text-gray-600 text-sm sm:text-base">Record details of a person you met during dawat</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 space-y-5 sm:space-y-6">
        <div className="space-y-5 sm:space-y-6 sm:grid sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-6 space-y-5 sm:space-y-0">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Father's Name
              </label>
              <input
                type="text"
                name="fatherName"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                placeholder="S/O"
              />
            </div>
          </div>

          <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-6 space-y-5 sm:space-y-0">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                placeholder="03XX-XXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Block <span className="text-red-500">*</span>
              </label>
              <select
                name="blockId"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
              >
                <option value="">Select Block</option>
                {blocks?.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-6 space-y-5 sm:space-y-0">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                House Number
              </label>
              <input
                type="text"
                name="houseNumber"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                placeholder="House #"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                placeholder="Job/Business"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complete Address
          </label>
          <textarea
            name="address"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base resize-none"
            placeholder="Full address details"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Timings
          </label>
          <input
            type="text"
            name="timings"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
            placeholder="e.g., Evening after Maghrib, Weekends"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base resize-none"
            placeholder="Any additional notes about the contact or conversation"
          />
        </div>

        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isMuslim"
              id="isMuslim"
              className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="isMuslim" className="ml-3 block text-sm text-gray-900">
              Already Muslim
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isInterested"
              id="isInterested"
              className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="isInterested" className="ml-3 block text-sm text-gray-900">
              Interested in learning more
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors order-1 sm:order-2"
          >
            {isSubmitting ? "Adding..." : "Add Contact"}
          </button>
        </div>
      </form>
    </div>
  );
}
"use client";

import { useState } from "react";

type Props = {
  request: any;
};

const statuses = [
  {
    value: "new",
    label: "Nieuw",
  },
  {
    value: "contacted",
    label: "Contact opgenomen",
  },
  {
    value: "meeting",
    label: "Afspraak gepland",
  },
  {
    value: "proposal",
    label: "Voorstel verstuurd",
  },
  {
    value: "won",
    label: "Gewonnen",
  },
  {
    value: "lost",
    label: "Verloren",
  },
];

export default function ActivationRequestForm({
  request,
}: Props) {
  const [status, setStatus] = useState(
    request.status ?? "new"
  );

  const [notesInternal, setNotesInternal] =
    useState(request.notes_internal ?? "");

  const [followUpAt, setFollowUpAt] =
    useState(
      request.follow_up_at
        ? request.follow_up_at.slice(0, 16)
        : ""
    );

  const [saving, setSaving] =
    useState(false);

  async function save() {
    try {
      setSaving(true);

      const res = await fetch(
        `/api/admin/activatiegesprekken/${request.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
            notes_internal:
              notesInternal,
            follow_up_at:
              followUpAt || null,
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      alert("Wijzigingen opgeslagen.");
    } catch {
      alert(
        "Opslaan is mislukt."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">

      <div className="rounded-xl border bg-white p-6">

        <h2 className="font-semibold mb-4">
          CRM
        </h2>

        <div className="space-y-5">

          <div>

            <label className="text-sm font-medium">
              Status
            </label>

            <select
              className="mt-2 w-full rounded-lg border px-3 py-2"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
            >
              {statuses.map((s) => (
                <option
                  key={s.value}
                  value={s.value}
                >
                  {s.label}
                </option>
              ))}
            </select>

          </div>

          <div>

            <label className="text-sm font-medium">
              Follow-up
            </label>

            <input
              type="datetime-local"
              className="mt-2 w-full rounded-lg border px-3 py-2"
              value={followUpAt}
              onChange={(e) =>
                setFollowUpAt(
                  e.target.value
                )
              }
            />

          </div>

          <div>

            <label className="text-sm font-medium">
              Interne notities
            </label>

            <textarea
              rows={6}
              className="mt-2 w-full rounded-lg border px-3 py-2"
              value={notesInternal}
              onChange={(e) =>
                setNotesInternal(
                  e.target.value
                )
              }
            />

          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-lg bg-[#1f9d55] px-4 py-3 font-medium text-white hover:bg-[#15803d]"
          >
            {saving
              ? "Opslaan..."
              : "Wijzigingen opslaan"}
          </button>

        </div>

      </div>

      <div className="rounded-xl border bg-white p-6">

        <h2 className="font-semibold mb-4">
          Aangevraagd op
        </h2>

        <p>
          {new Date(
            request.created_at
          ).toLocaleString("nl-NL")}
        </p>

      </div>

    </div>
  );
}
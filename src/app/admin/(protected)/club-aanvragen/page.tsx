"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { toast } from "sonner";
import { useConfirm } from "@/components/providers/confirm-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";


/* ===============================
   Types
   =============================== */

type SignupRequest = {
  id: string;
  club_name: string;
  email: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
};

/* ===============================
   Club signup requests panel
   =============================== */

function ClubSignupRequestsPanel() {
  const supabase = useMemo(() => getSupabaseBrowser(), []);
  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const { confirm } = useConfirm();
  const [rejectingRequest, setRejectingRequest] =
  useState<SignupRequest | null>(null);

const [rejectionReason, setRejectionReason] =
  useState("");

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("club_signup_requests")
      .select("id, club_name, email, created_at, status")
      .eq("status", "pending")
      .is("club_id", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load signup requests error:", error);
      setRequests([]);
    } else {
      setRequests(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(requestId: string) {
    if (approvingId) return;
    const confirmed = await confirm({
  title: "Club goedkeuren",
  description:
    "Weet je zeker dat je deze club wilt goedkeuren?",
  confirmText: "Goedkeuren",
  cancelText: "Annuleren",
});

if (!confirmed) return;

    setApprovingId(requestId);

    try {
      const res = await fetch("/api/admin/approve-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (!res.ok) {
        toast.error("Goedkeuren mislukt");
        return;
      }

      await load();
    } finally {
      setApprovingId(null);
    }
  }

async function confirmReject() {
  if (!rejectingRequest) return;

  if (!rejectionReason.trim()) {
    toast.error("Vul een reden in.");
    return;
  }

  setRejectingId(rejectingRequest.id);

  try {
    const res = await fetch("/api/admin/reject-club", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestId: rejectingRequest.id,
        reason: rejectionReason,
      }),
    });

    if (!res.ok) {
      toast.error("Afkeuren mislukt");
      return;
    }

    await load();

    setRejectingRequest(null);
    setRejectionReason("");

    toast.success("Clubaanvraag afgekeurd.");
  } finally {
    setRejectingId(null);
  }
}

  if (loading) return <p>Laden…</p>;
  if (requests.length === 0)
    return (
      <div className="bg-white text-black rounded-2xl shadow p-6">
        <p>Geen nieuwe aanvragen</p>
      </div>
    );

  return (
  <>
    <motion.div
      className="bg-white text-black rounded-2xl shadow p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-semibold text-lg mb-4">
        Nieuwe clubaanvragen
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#0d1b2a] text-white text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">Club</th>
              <th className="px-3 py-2 text-left">E-mail</th>
              <th className="px-3 py-2 text-center">
                Aangevraagd
              </th>
              <th className="px-3 py-2 text-center">Actie</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0">
                <td className="px-3 py-2 font-medium">
                  {r.club_name}
                </td>
                <td className="px-3 py-2 break-all">
  {r.email}
</td>
                <td className="px-3 py-2 text-center text-xs">
                  {new Date(
                    r.created_at
                  ).toLocaleDateString("nl-NL")}
                </td>
                <td className="px-3 py-2 text-center">
  <div className="flex flex-wrap justify-center gap-2">

    <Button
  size="sm"
  disabled={approvingId === r.id}
  onClick={() => approve(r.id)}
>
  Goedkeuren
</Button>

<Button
  size="sm"
  variant="destructive"
  disabled={rejectingId === r.id}
  onClick={() => {
    setRejectingRequest(r);
    setRejectionReason("");
  }}
>
  Afkeuren
</Button>

  </div>
</td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>

<Dialog
  open={!!rejectingRequest}
  onOpenChange={(open) => {
    if (!open) {
      setRejectingRequest(null);
      setRejectionReason("");
    }
  }}
>
  <DialogContent>

    <DialogHeader>
      <DialogTitle>
        Clubaanvraag afkeuren
      </DialogTitle>

      <DialogDescription>
        Geef de reden op waarom deze aanvraag wordt afgekeurd.
      </DialogDescription>
    </DialogHeader>

    <Textarea
      rows={5}
      value={rejectionReason}
      onChange={(e) =>
        setRejectionReason(e.target.value)
      }
    />

    <DialogFooter>

      <Button
        variant="outline"
        onClick={() => {
          setRejectingRequest(null);
          setRejectionReason("");
        }}
      >
        Annuleren
      </Button>

      <Button
        variant="destructive"
        onClick={confirmReject}
      >
        Afkeuren
      </Button>

    </DialogFooter>

  </DialogContent>
</Dialog>
</>
);
}

/* ===============================
   Admin dashboard page
   =============================== */

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <ClubSignupRequestsPanel />
    </div>
  );
}

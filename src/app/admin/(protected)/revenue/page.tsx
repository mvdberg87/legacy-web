"use client";

import { useState } from "react";
import SubscriptionsTable from "@/components/admin/SubscriptionsTable";
import UpgradeRequestsTable from "@/components/admin/UpgradeRequestsTable";

export default function AdminRevenuePage() {

  const [tab, setTab] = useState<"subscriptions" | "upgrades">("subscriptions");

  return (
    <div className="space-y-6">

      <h1 className="text-xl font-semibold">
        Revenue management
      </h1>

      <div className="flex gap-4">

        <button
          onClick={() => setTab("subscriptions")}
          className="px-4 py-2 border rounded"
        >
          Subscriptions
        </button>

        <button
          onClick={() => setTab("upgrades")}
          className="px-4 py-2 border rounded"
        >
          Upgrade requests
        </button>

      </div>

      {tab === "subscriptions" && <SubscriptionsTable />}
      {tab === "upgrades" && <UpgradeRequestsTable />}

    </div>
  );
}
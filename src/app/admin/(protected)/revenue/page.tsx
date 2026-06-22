"use client";

import { useState } from "react";
import SubscriptionsTable from "@/components/admin/SubscriptionsTable";
import AdvertisementRevenueTable
from "@/components/admin/AdvertisementRevenueTable";

export default function AdminRevenuePage() {

  const [tab, setTab] = useState<
  "subscriptions" |
  "advertisements"
>("subscriptions");

  return (
    <div className="space-y-6">

      <h1 className="text-xl font-semibold">
        Abonnementen
      </h1>

      <div className="flex flex-col sm:flex-row gap-2">

        <button
          onClick={() => setTab("subscriptions")}
          className="px-4 py-2 border rounded"
        >
          Abonnementen
        </button>

        <button
  onClick={() =>
    setTab("advertisements")
  }
  className="px-4 py-2 border rounded"
>
  Advertenties
</button>

      </div>

      {tab === "subscriptions" && <SubscriptionsTable />}
      {tab === "advertisements" &&
  <AdvertisementRevenueTable />}

    </div>
  );
}
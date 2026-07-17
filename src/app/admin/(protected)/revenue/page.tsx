"use client";

import { useState } from "react";
import SubscriptionsTable from "@/components/admin/SubscriptionsTable";
import AdvertisementRevenueTable
from "@/components/admin/AdvertisementRevenueTable";
import { Button } from "@/components/ui/button";

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

        <Button
  variant={tab === "subscriptions" ? "default" : "outline"}
  onClick={() => setTab("subscriptions")}
>
  Abonnementen
</Button>

        <Button
  variant={tab === "advertisements" ? "default" : "outline"}
  onClick={() => setTab("advertisements")}
>
  Advertenties
</Button>

      </div>

      {tab === "subscriptions" && <SubscriptionsTable />}
      {tab === "advertisements" &&
  <AdvertisementRevenueTable />}

    </div>
  );
}
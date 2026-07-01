"use client";

type Props = {
  metrics: any;
};

function Kpi({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-[#132a44] rounded-2xl p-6 h-full flex flex-col justify-center">
      <div className="text-2xl font-semibold break-words">
        {value}
      </div>

      <div className="text-sm text-gray-400 mt-2">
        {label}
      </div>
    </div>
  );
}

export default function RevenueMetrics({
  metrics,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-6 mb-12">

        <Kpi label="MRR" value={`€${metrics.mrr}`} />
        <Kpi label="ARR" value={`€${metrics.arr}`} />
        <Kpi label="ARPU" value={`€${metrics.arpu.toFixed(0)}`} />
        <Kpi label="Churn %" value={`${metrics.churnRate.toFixed(2)}%`} />
        <Kpi label="NRR %" value={`${metrics.nrr.toFixed(1)}%`} />
        <Kpi label="LTV" value={`€${metrics.ltv}`} />
        <Kpi label="Conversion %" value={`${metrics.conversionRate}%`} />
        <Kpi label="Opgezegd" value={metrics.pendingCancellation} />

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">

        <Kpi
          label="Advertentie omzet"
          value={`€${metrics.totalAdRevenue}`}
        />

        <Kpi
          label="Club aandeel"
          value={`€${metrics.totalClubShare}`}
        />

        <Kpi
          label="Sponsuls aandeel"
          value={`€${metrics.totalSponsulsShare}`}
        />

        <Kpi
          label="Actieve advertenties"
          value={metrics.activeAds}
        />

        <Kpi
          label="Totale platform omzet"
          value={`€${metrics.totalPlatformRevenue}`}
        />

      </div>
    </>
  );
}
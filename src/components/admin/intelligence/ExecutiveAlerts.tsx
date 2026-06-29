"use client";

import SectionCard from "../ui/SectionCard";

export type AlertSeverity =
  | "success"
  | "info"
  | "warning"
  | "danger";

export type ExecutiveAlert = {
  severity: AlertSeverity;
  title: string;
  description: string;
  action?: string;
};

type Props = {
  alerts: ExecutiveAlert[];
};

const COLORS = {
  success: {
    dot: "bg-green-500",
    border: "border-green-200",
    bg: "bg-green-50",
  },

  info: {
    dot: "bg-blue-500",
    border: "border-blue-200",
    bg: "bg-blue-50",
  },

  warning: {
    dot: "bg-amber-500",
    border: "border-amber-200",
    bg: "bg-amber-50",
  },

  danger: {
    dot: "bg-red-500",
    border: "border-red-200",
    bg: "bg-red-50",
  },
};

export default function ExecutiveAlerts({
  alerts,
}: Props) {
  return (
    <SectionCard
      title="Executive Alerts"
      subtitle="Belangrijkste aandachtspunten op basis van platformdata."
    >
      <div className="space-y-4">

        {alerts.length === 0 && (

          <div className="rounded-xl border border-green-200 bg-green-50 p-5">

            <div className="flex items-center gap-3">

              <div className="h-3 w-3 rounded-full bg-green-500" />

              <div>

                <h3 className="font-semibold text-[#0d1b2a]">
                  Geen openstaande aandachtspunten
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Alle belangrijke KPI's bevinden zich binnen de ingestelde marges.
                </p>

              </div>

            </div>

          </div>

        )}

        {alerts.map((alert, index) => {

          const color = COLORS[alert.severity];

          return (

            <div
              key={index}
              className={`
                rounded-xl
                border
                p-5
                ${color.border}
                ${color.bg}
              `}
            >

              <div className="flex gap-4">

                <div
                  className={`
                    h-3
                    w-3
                    rounded-full
                    mt-2
                    ${color.dot}
                  `}
                />

                <div className="flex-1">

                  <h3 className="font-semibold text-[#0d1b2a]">
                    {alert.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    {alert.description}
                  </p>

                  {alert.action && (

                    <div className="mt-3 rounded-lg bg-white/70 p-3">

                      <p className="text-sm font-medium text-[#0d1b2a]">
                        Aanbevolen actie
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {alert.action}
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          );
        })}

      </div>
    </SectionCard>
  );
}
"use client";

import { useState } from "react";
import TalentpoolProgress from "./TalentpoolProgress";
import TalentpoolIntro from "./TalentpoolIntro";
import TalentpoolPersonal from "./TalentpoolPersonal";
import TalentpoolPreferences from "./TalentpoolPreferences";
import TalentpoolEducation from "./TalentpoolEducation";
import TalentpoolAvailability from "./TalentpoolAvailability";

type Club = {
  name: string;
  primary_color?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  club: Club;
};

export default function TalentpoolModal({
  open,
  onClose,
  club,
}: Props) {
  if (!open) return null;

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferences: [],
  education: "",
study: "",
field: "",
city: "",
distance: 15,
availableFrom: "",
notes: "",
});

function updateField(
  field: string,
  value: string | number
) {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
}

function togglePreference(value: string) {
  setFormData((prev: any) => ({
    ...prev,
    preferences: prev.preferences.includes(value)
      ? prev.preferences.filter((v: string) => v !== value)
      : [...prev.preferences, value],
  }));
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div
          className="p-8 text-white"
          style={{
            backgroundColor: club.primary_color ?? "#1d4ed8",
          }}
        >
          <h2 className="text-3xl font-bold">
  Talentpool
</h2>

<p className="mt-2 text-lg opacity-90">
  Laat jouw talent zien aan de sponsoren van {club.name}.
</p>

<div className="mt-6">
  <TalentpoolProgress
    step={step}
    totalSteps={5}
  />
</div>
        </div>

        {/* Content */}
        <div className="p-8">

          {step === 0 && (
  <TalentpoolIntro
    clubName={club.name}
  />
)}

{step === 1 && (
  <TalentpoolPersonal
    firstName={formData.firstName}
    lastName={formData.lastName}
    email={formData.email}
    phone={formData.phone}
    onChange={updateField}
  />
)}

{step === 2 && (
  <TalentpoolPreferences
    selected={formData.preferences}
    onToggle={togglePreference}
    primaryColor={club.primary_color}
  />
)}

{step === 3 && (
  <TalentpoolEducation
    education={formData.education}
    study={formData.study}
    field={formData.field}
    onChange={updateField}
  />
)}

{step === 4 && (
  <TalentpoolAvailability
    city={formData.city}
    distance={formData.distance}
    availableFrom={formData.availableFrom}
    notes={formData.notes}
    onChange={updateField}
  />
)}
          <div className="mt-8 flex justify-between">

  <div>
    {step > 0 ? (
      <button
        onClick={() => setStep(step - 1)}
        className="rounded-xl border px-5 py-3"
      >
        ← Vorige
      </button>
    ) : (
      <button
        onClick={onClose}
        className="rounded-xl border px-5 py-3"
      >
        Annuleren
      </button>
    )}
  </div>

  <button
  onClick={async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      await fetch("/api/talentpool/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Verzonden");
    }
  }}
  className="rounded-xl px-6 py-3 font-semibold text-white"
  style={{
    backgroundColor: club.primary_color ?? "#1d4ed8",
  }}
>
  {step === 0 && "Start aanmelding →"}
  {step > 0 && step < 4 && "Volgende →"}
  {step === 4 && "Aanmelden"}
</button>

</div>

        </div>

      </div>

    </div>
  );
}
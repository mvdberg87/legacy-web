"use client";

import { useState } from "react";
import TalentpoolProgress from "./TalentpoolProgress";
import TalentpoolIntro from "./TalentpoolIntro";
import TalentpoolPersonal from "./TalentpoolPersonal";
import TalentpoolPreferences from "./TalentpoolPreferences";
import TalentpoolEducation from "./TalentpoolEducation";
import TalentpoolAvailability from "./TalentpoolAvailability";
import TalentpoolPrivacy from "./TalentpoolPrivacy";

type Club = {
  id: string;
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

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferences: [] as string[],
    education: "",
    study: "",
    field: "",
    city: "",
    distance: 15,
    availableFrom: "",
    notes: "",
    acceptedPrivacy: false,
    acceptedTerms: false,
  });

  if (!open) return null;

  function updateField(
  field: string,
  value: string | number | boolean
) {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));

  if (showErrors) {
    setShowErrors(false);
  }
}

  function togglePreference(value: string) {
  setFormData((prev: any) => ({
    ...prev,
    preferences: prev.preferences.includes(value)
      ? prev.preferences.filter((v: string) => v !== value)
      : [...prev.preferences, value],
  }));

  if (showErrors) {
    setShowErrors(false);
  }
}

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-2xl">

          <div className="text-6xl mb-6">🎉</div>

          <h2 className="text-3xl font-bold mb-4">
            Bedankt voor je aanmelding!
          </h2>

          <p className="text-gray-600 leading-relaxed mb-8">
            Je profiel is succesvol aangemeld voor de Talentpool van{" "}
            <strong>{club.name}</strong>.
          </p>

          <div className="rounded-xl bg-gray-100 p-5 text-left text-sm text-gray-700 mb-8">
            <p>✅ Je gegevens zijn veilig opgeslagen.</p>
            <p>✅ Alleen de sponsorcommissie kan jouw profiel bekijken.</p>
            <p>✅ Wanneer een sponsor een passende vacature heeft, kan er contact met je worden opgenomen.</p>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
setShowErrors(false);
setStep(0);

              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                preferences: [] as string[],
                education: "",
                study: "",
                field: "",
                city: "",
                distance: 15,
                availableFrom: "",
                notes: "",
                acceptedPrivacy: false,
                acceptedTerms: false,
              });

              onClose();
            }}
            className="rounded-xl px-8 py-3 font-semibold text-white"
            style={{
              backgroundColor: club.primary_color ?? "#1d4ed8",
            }}
          >
            Sluiten
          </button>

        </div>
      </div>
    );
  }

  function canContinue() {
  switch (step) {
    case 0:
      return true;

    case 1:
      return (
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.phone.trim() !== ""
      );

    case 2:
      return formData.preferences.length > 0;

    case 3:
  return true;

    case 4:
  return true;

    case 5:
      return (
        formData.acceptedPrivacy &&
        formData.acceptedTerms
      );

    default:
      return false;
  }
}

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4">

      <div className="flex min-h-full items-start justify-center pt-2 sm:py-6">

        <div className="
  flex h-[100dvh] w-full flex-col bg-white
  sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl sm:shadow-2xl
">

          {/* Header */}
          <div
            className="p-5 sm:p-8 text-white"
            style={{
              backgroundColor: club.primary_color ?? "#1d4ed8",
            }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold">
              Talentpool
            </h2>

            <p className="mt-2 text-base sm:text-lg opacity-90">
              Laat jouw talent zien aan de sponsoren van {club.name}.
            </p>

            <div className="mt-6">
              <TalentpoolProgress
                step={step}
                totalSteps={6}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8">

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
  showErrors={showErrors}
  onChange={updateField}
/>
            )}

            {step === 2 && (
              <TalentpoolPreferences
  selected={formData.preferences}
  onToggle={togglePreference}
  primaryColor={club.primary_color}
  showErrors={showErrors}
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

            {step === 5 && (
              <TalentpoolPrivacy
  clubName={club.name}
  acceptedPrivacy={formData.acceptedPrivacy}
  acceptedTerms={formData.acceptedTerms}
  showErrors={showErrors}
  onTogglePrivacy={() =>
    updateField(
      "acceptedPrivacy",
      !formData.acceptedPrivacy
    )
  }
  onToggleTerms={() =>
    updateField(
      "acceptedTerms",
      !formData.acceptedTerms
    )
  }
/>
            )}

          </div>

          <div
  className="
    sticky
    bottom-0
    border-t
    bg-white

    px-5
    py-4

    sm:px-8
    sm:py-5

    flex
    flex-col-reverse
    gap-3

    sm:flex-row
    sm:justify-between
  "
>

            <div>
              {step > 0 ? (
                <button
                  onClick={() => {
  setShowErrors(false);
  setStep(step - 1);
}}
                  className="w-full sm:w-auto rounded-xl border px-5 py-3"
                >
                  ← Vorige
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowErrors(false);
                    setStep(0);
                    setSubmitted(false);

                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      preferences: [] as string[],
                      education: "",
                      study: "",
                      field: "",
                      city: "",
                      distance: 15,
                      availableFrom: "",
                      notes: "",
                      acceptedPrivacy: false,
                      acceptedTerms: false,
                    });

                    onClose();
                  }}
                  className="w-full sm:w-auto rounded-xl border px-5 py-3"
                >
                  Annuleren
                </button>
              )}
            </div>

            <button
              onClick={async () => {
                if (!canContinue()) {
  setShowErrors(true);
  return;
}

setShowErrors(false);

if (step < 5) {
  setStep(step + 1);
} else {
                  const response = await fetch("/api/talentpool/create", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ...formData,
                      clubId: club.id,
                    }),
                  });

                  if (!response.ok) {
                    alert("Er ging iets mis. Probeer het later opnieuw.");
                    return;
                  }

                  setSubmitted(true);
                  setShowErrors(false);
                }
              }}
              className={`w-full sm:w-auto rounded-xl px-6 py-3 font-semibold text-white transition ${
  !canContinue()
  ? "opacity-90"
  : "hover:opacity-90"
}`}
              style={{
                backgroundColor: club.primary_color ?? "#1d4ed8",
              }}
            >
              {step === 0 && "Start aanmelding →"}
              {step > 0 && step < 5 && "Volgende →"}
              {step === 5 && "Aanmelden"}
            </button>

          </div> {/* sticky navigatie */}

        </div> {/* witte kaart */}

      </div> {/* flex wrapper */}

  </div>
  );
}
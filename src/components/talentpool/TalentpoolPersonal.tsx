type Props = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  showErrors: boolean;
  onChange: (field: string, value: string) => void;
};

export default function TalentpoolPersonal({
  firstName,
  lastName,
  email,
  phone,
  showErrors,
  onChange,
}: Props) {
  return (
    <div>

      <h3 className="text-xl font-semibold mb-2">
        Persoonlijke gegevens
      </h3>

      <p className="text-gray-600 mb-6">
        Vul hieronder je gegevens in.
      </p>

      <div className="space-y-4">

        <input
  autoFocus
  type="text"
  placeholder="Voornaam"
  value={firstName}
  onChange={(e) =>
    onChange("firstName", e.target.value)
  }
  className={`w-full rounded-xl border px-4 py-3 text-base ${
    showErrors && !firstName.trim()
      ? "border-red-500"
      : "border-gray-300"
  }`}
/>

{showErrors && !firstName.trim() && (
  <p className="mt-1 text-sm text-red-600">
    Voornaam is verplicht.
  </p>
)}

        <input
  type="text"
  placeholder="Achternaam"
  value={lastName}
  onChange={(e) =>
    onChange("lastName", e.target.value)
  }
  className={`w-full rounded-xl border px-4 py-3 text-base ${
    showErrors && !lastName.trim()
      ? "border-red-500"
      : "border-gray-300"
  }`}
/>

{showErrors && !lastName.trim() && (
  <p className="mt-1 text-sm text-red-600">
    Achternaam is verplicht.
  </p>
)}

        <input
  type="email"
  placeholder="E-mailadres"
  value={email}
  onChange={(e) => onChange("email", e.target.value)}
  className={`w-full rounded-xl border px-4 py-3 text-base ${
    showErrors && !email.trim()
      ? "border-red-500"
      : "border-gray-300"
  }`}
/>

{showErrors && !email.trim() && (
  <p className="mt-1 text-sm text-red-600">
    E-mailadres is verplicht.
  </p>
)}

        <input
  type="tel"
  placeholder="Telefoonnummer"
  value={phone}
  onChange={(e) => onChange("phone", e.target.value)}
  className={`w-full rounded-xl border px-4 py-3 text-base ${
    showErrors && !phone.trim()
      ? "border-red-500"
      : "border-gray-300"
  }`}
/>

{showErrors && !phone.trim() && (
  <p className="mt-1 text-sm text-red-600">
    Telefoonnummer is verplicht.
  </p>
)}

      </div>

    </div>
  );
}
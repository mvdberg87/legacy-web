type Props = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  onChange: (field: string, value: string) => void;
};

export default function TalentpoolPersonal({
  firstName,
  lastName,
  email,
  phone,
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
          type="text"
          placeholder="Voornaam"
          value={firstName}
          onChange={(e) =>
            onChange("firstName", e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />

        <input
          type="text"
          placeholder="Achternaam"
          value={lastName}
          onChange={(e) =>
            onChange("lastName", e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />

        <input
          type="email"
          placeholder="E-mailadres"
          value={email}
          onChange={(e) =>
            onChange("email", e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />

        <input
          type="tel"
          placeholder="Telefoonnummer"
          value={phone}
          onChange={(e) =>
            onChange("phone", e.target.value)
          }
          className="w-full rounded-xl border p-3"
        />

      </div>

    </div>
  );
}
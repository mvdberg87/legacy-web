import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ActivatieGesprekBedanktPage() {
  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white flex items-center justify-center px-6">

      <div className="max-w-2xl text-center">

        <div className="text-6xl mb-8">🎉</div>

        <h1 className="text-5xl font-bold">
          Bedankt voor je aanvraag!
        </h1>

        <p className="mt-8 text-lg text-white/75 leading-8">
          We hebben je aanvraag voor een vrijblijvend
          activatiegesprek goed ontvangen.
        </p>

        <p className="mt-4 text-lg text-white/75 leading-8">
          Eén van onze collega's neemt binnen drie werkdagen
          contact met je op om samen te bekijken hoe jouw
          organisatie meer rendement kan halen uit
          sponsoring en recruitment.
        </p>

        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">

          <Link href="/bedrijven">
            <Button className="bg-[#1f9d55] hover:bg-[#15803d] rounded-2xl px-8 py-6">
              Terug naar bedrijven
            </Button>
          </Link>

          <Link href="/">
            <Button
  variant="outline"
  className="
    rounded-2xl
    px-8
    py-6
    border-white
    bg-transparent
    !text-white
    hover:bg-white
    hover:!text-[#0d1b2a]
  "
>
  Naar homepage
</Button>
          </Link>

        </div>

      </div>

    </main>
  );
}
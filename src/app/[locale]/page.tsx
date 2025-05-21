import Image from "next/image";
import { commingSoonImage } from "@/assets/static";
import { getTranslations } from "@/lib/dictionary/getTranslations";
import { Locale } from "@/components/Locale";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: "en" | "de" }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Coming Soon</h1>
        <p className="text-lg mb-6">
          We're working hard to bring you something amazing. Stay tuned!
        </p>
        <div className="flex justify-center">
          <div className="flex justify-center">
            <Image
              src={commingSoonImage}
              alt="Coming Soon"
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        </div>
        <Locale />
      </div>
    </div>
  );
}

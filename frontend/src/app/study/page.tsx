import { StudyScreen } from "@/components/StudyScreen";
import { StudyRoomScreen } from "@/components/StudyRoomScreen";

export const metadata = {
  title: "Study | Ranjan Sir",
};

interface StudyPageProps {
  searchParams: Promise<{ from?: string; plan?: string; document?: string }>;
}

export default async function StudyPage({ searchParams }: StudyPageProps) {
  const params = await searchParams;
  if (!params.document && params.from !== "today") {
    return <StudyRoomScreen />;
  }
  const initialSeconds =
    params.from === "today"
      ? (params.plan === "short" ? 20 : 25) * 60
      : 18 * 60 + 42;
  return (
    <StudyScreen initialSeconds={initialSeconds} documentId={params.document} />
  );
}

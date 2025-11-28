import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8">
        <h1 className="text-4xl mb-4 font-bold">Welcome to AOOS!</h1>
        <p className="mb-2">This is your AI Outbound OS landing page.</p>
      </Card>
    </main>
  );
}

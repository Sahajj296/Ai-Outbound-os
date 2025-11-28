import { Card } from "@/components/ui/card";

export default function LeadDetailsPage({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8">
        <h2 className="text-2xl font-bold mb-4">Lead Details</h2>
        <div>Lead ID: {params.id}</div>
        {/* Additional lead info here */}
      </Card>
    </main>
  );
}

import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";

export default function ResultsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8">
        <h2 className="text-2xl font-bold mb-4">Results</h2>
        <Table>
          {/* Placeholder head and row */}
        </Table>
      </Card>
    </main>
  );
}

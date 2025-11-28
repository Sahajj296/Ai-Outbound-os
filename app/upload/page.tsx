import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 space-y-4">
        <h2 className="text-2xl font-bold">Upload</h2>
        <Input placeholder="Lead CSV or file..." />
        <Textarea placeholder="Paste leads here..." />
        <Button>Upload</Button>
      </Card>
    </main>
  );
}

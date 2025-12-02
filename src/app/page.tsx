'use client';

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="pt-4">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <div>
            <h1 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
              AI Outbound<br />Operating System
            </h1>
          </div>

          <p
            className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Intelligent lead scoring and prioritization powered by AI. Upload your leads,
            get instant insights, and focus on prospects that matter most.
          </p>

          <div>
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={() => router.push('/upload')}
            >
              Upload Leads <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
          >
            {[
              { icon: TrendingUp, title: 'Smart Scoring', desc: 'AI-powered lead qualification' },
              { icon: Users, title: 'Instant Insights', desc: 'Know your best prospects immediately' },
              { icon: Target, title: 'Focus Your Team', desc: 'Prioritize high-value opportunities' }
            ].map((feature, idx) => (
              <div
                key={idx}
              >
                <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-slate-700 mb-3" />
                    <CardTitle className="text-slate-900">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-600">{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

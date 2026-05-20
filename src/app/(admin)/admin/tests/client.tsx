"use client";

import { Plus, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { toggleTestActive } from "@/lib/actions/tests";
import { toast } from "sonner";
import { useState } from "react";

export type TestFormatted = {
  id: string;
  title: string;
  batch: string;
  week_number: number;
  questions_count: number;
  is_active: boolean;
  submissions: number;
  created_at: string;
};

export default function TestsClient({ initialTests }: { initialTests: TestFormatted[] }) {
  const [tests, setTests] = useState(initialTests);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setTests(tests.map(t => t.id === id ? { ...t, is_active: !currentStatus } : t));
      await toggleTestActive(id, !currentStatus);
      toast.success(currentStatus ? "Test deactivated" : "Test activated");
    } catch (error: unknown) {
      // Revert on error
      setTests(tests);
      toast.error(error instanceof Error ? error.message : "Failed to toggle test status");
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Tests</h1>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage weekly MCQ tests
          </p>
        </div>
        <Link href="/admin/tests/create">
          <Button className="gradient-accent text-white rounded-xl cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Create Test
          </Button>
        </Link>
      </div>

      {/* Tests List */}
      <div className="space-y-3">
        {tests.map((test) => (
          <Card
            key={test.id}
            className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow"
          >
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#1a1a2e]">
                      {test.title}
                    </h3>
                    <Badge
                      className={
                        test.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }
                    >
                      {test.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>{test.batch}</span>
                    <span>•</span>
                    <span>{test.questions_count} questions</span>
                    <span>•</span>
                    <span>{test.submissions} submissions</span>
                    <span>•</span>
                    <span>{test.created_at}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-xs cursor-pointer"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Results
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg text-xs cursor-pointer"
                    onClick={() => handleToggle(test.id, test.is_active)}
                  >
                    {test.is_active ? (
                      <ToggleRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

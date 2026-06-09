"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Quote, Award } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { addResult, deleteResult } from "@/features/admin/actions";
import type { StudentResult } from "@/types/database";

export default function ResultsClient({
  initialResults,
}: {
  initialResults: StudentResult[];
}) {
  const [results, setResults] = useState<StudentResult[]>(initialResults);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    student_name: "",
    exam_name: "",
    score_before: "",
    score_after: "",
    parent_quote: "",
    photo_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addResult(formData);
      toast.success("Result added successfully");
      setIsOpen(false);
      window.location.reload();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to add result");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this result?")) return;
    try {
      await deleteResult(id);
      setResults(results.filter((r) => r.id !== id));
      toast.success("Result deleted");
    } catch {
      toast.error("Failed to delete result");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Success Stories ({results.length})</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            render={
              <Button className="gradient-accent text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Result
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Success Story</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Student Name</label>
                <Input
                  required
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  placeholder="e.g. Aryan K."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Exam/Class</label>
                <Input
                  required
                  value={formData.exam_name}
                  onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
                  placeholder="e.g. Class 10 Board"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Score Before</label>
                  <Input
                    required
                    value={formData.score_before}
                    onChange={(e) => setFormData({ ...formData, score_before: e.target.value })}
                    placeholder="e.g. 47%"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Score After</label>
                  <Input
                    required
                    value={formData.score_after}
                    onChange={(e) => setFormData({ ...formData, score_after: e.target.value })}
                    placeholder="e.g. 92%"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Parent Quote (Optional)</label>
                <Textarea
                  value={formData.parent_quote || ""}
                  onChange={(e) => setFormData({ ...formData, parent_quote: e.target.value })}
                  placeholder="Vidyazo changed our child's life..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Photo URL (Optional)</label>
                <Input
                  value={formData.photo_url || ""}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Result"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result) => (
          <Card key={result.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center overflow-hidden">
                    {result.student_photo_url ? (
                      <Image src={result.student_photo_url} alt={result.student_name} fill className="object-cover" />
                    ) : (
                      <Award className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1a2e]">{result.student_name}</h3>
                    <p className="text-xs text-gray-500">{result.subject ?? "General"}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(result.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-3 border border-gray-100">
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 font-medium uppercase">Before</p>
                  <p className="font-bold text-gray-600">{result.score_before}</p>
                </div>
                <div className="h-0.5 w-12 bg-gray-200 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-gray-300 rotate-45" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-green-600 font-medium uppercase">After</p>
                  <p className="font-bold text-green-600 text-lg">{result.score_after}</p>
                </div>
              </div>

              {result.parent_quote && (
                <div className="flex gap-2 text-sm text-gray-600 italic bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                  <Quote className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <p className="leading-tight">&quot;{result.parent_quote}&quot;</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, FileText, Download, Lock, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { addMaterial, deleteMaterial } from "@/lib/actions/admin-crud";
import type { StudyMaterial } from "@/types/database";

export default function MaterialsClient({
  initialMaterials,
  batches,
}: {
  initialMaterials: (StudyMaterial & { batch?: any })[];
  batches: any[];
}) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    topic: "",
    file_url: "",
    batch_id: "all",
    class_grade: "",
    is_free: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        title: formData.title,
        subject: formData.subject,
        topic: formData.topic || null,
        file_url: formData.file_url,
        batch_id: formData.batch_id === "all" ? null : formData.batch_id,
        class_grade: formData.class_grade ? parseInt(formData.class_grade) : null,
        is_free: formData.is_free,
      };
      
      await addMaterial(dataToSubmit);
      toast.success("Material added successfully");
      setIsOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to add material");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    try {
      await deleteMaterial(id);
      setMaterials(materials.filter((m) => m.id !== id));
      toast.success("Material deleted");
    } catch (error: any) {
      toast.error("Failed to delete material");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Materials ({materials.length})</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            render={
              <Button className="gradient-accent text-white">
                <Plus className="w-4 h-4 mr-2" />
                Upload Material
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Study Material</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Algebra Fundamentals"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Subject *</label>
                  <Input
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Mathematics"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Topic</label>
                  <Input
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g. Chapter 1"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">File URL (PDF link) *</label>
                <Input
                  required
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://storage.../file.pdf"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Target Batch</label>
                  <Select
                    value={formData.batch_id}
                    onValueChange={(v) => setFormData({ ...formData, batch_id: v ?? "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Batches (Global)</SelectItem>
                      {batches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name} ({b.subject})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Target Class</label>
                  <Select
                    value={formData.class_grade}
                    onValueChange={(v) => setFormData({ ...formData, class_grade: v ?? "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Classes</SelectItem>
                      {[6,7,8,9,10,11,12].map((c) => (
                        <SelectItem key={c} value={c.toString()}>Class {c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <input 
                  type="checkbox" 
                  id="is_free"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#e94560] focus:ring-[#e94560]"
                />
                <label htmlFor="is_free" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-1.5">
                  <LockOpen className="w-4 h-4 text-green-600" />
                  Free for all students (No active subscription needed)
                </label>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Material"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((mat) => (
          <Card key={mat.id}>
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${mat.is_free ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(mat.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <h3 className="font-semibold text-[#1a1a2e] line-clamp-1">{mat.title}</h3>
                
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                    {mat.subject ?? "—"}
                  </span>
                  {mat.topic && (
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">
                      {mat.topic}
                    </span>
                  )}
                  {mat.class_grade && (
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold">
                      Class {mat.class_grade}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-3 line-clamp-1">
                  Target: {mat.batch ? mat.batch.name : 'Global (All Batches)'}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  {mat.is_free ? (
                    <><LockOpen className="w-3.5 h-3.5 text-green-500" /> Free</>
                  ) : (
                    <><Lock className="w-3.5 h-3.5 text-amber-500" /> Paid</>
                  )}
                </span>
                <a href={mat.file_url ?? "#"} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 hover:bg-blue-50">
                    <Download className="w-3.5 h-3.5 mr-1" />
                    PDF
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

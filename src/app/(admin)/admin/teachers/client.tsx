"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Video, GraduationCap } from "lucide-react";
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
import { toast } from "sonner";
import { addTeacher, deleteTeacher } from "@/lib/actions/admin-crud";
import type { Teacher } from "@/types/database";

export default function TeachersClient({
  initialTeachers,
}: {
  initialTeachers: Teacher[];
}) {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    experience: "",
    photo_url: "",
    video_url: "",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTeacher(formData);
      toast.success("Teacher added successfully");
      setIsOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await deleteTeacher(id);
      setTeachers(teachers.filter((t) => t.id !== id));
      toast.success("Teacher deleted");
    } catch (error: any) {
      toast.error("Failed to delete teacher");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Active Teachers ({teachers.length})</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            render={
              <Button className="gradient-accent text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Mathematics"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Experience</label>
                <Input
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g. 8+ Years Experience"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Photo URL (Optional)</label>
                <Input
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Demo Video URL (Optional)</label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Teacher"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {teacher.photo_url ? (
                  <img src={teacher.photo_url} alt={teacher.full_name} className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1a1a2e] truncate">{teacher.full_name}</h3>
                <p className="text-sm text-[#e94560] font-medium">{teacher.subjects?.join(", ")}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {teacher.experience_years ? `${teacher.experience_years}+ Years Experience` : ""}
                </p>
                
                <div className="flex gap-2 mt-3">
                  {teacher.intro_video_url && (
                    <Button variant="outline" size="icon" className="h-8 w-8 text-blue-500" title="Has Demo Video">
                      <Video className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-50 ml-auto"
                    onClick={() => handleDelete(teacher.id)}
                  >
                    <Trash2 className="w-4 h-4" />
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

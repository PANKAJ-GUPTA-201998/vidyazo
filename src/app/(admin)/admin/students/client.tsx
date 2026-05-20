"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Phone,
  GraduationCap,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { BOARDS, CLASS_GRADES } from "@/lib/constants";

import { createStudent } from "@/lib/actions/students";
import { toast } from "sonner";

const planColors: Record<string, string> = {
  batch: "bg-blue-100 text-blue-700",
  hybrid: "bg-purple-100 text-purple-700",
  one_on_one: "bg-amber-100 text-amber-700",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  inactive: "bg-gray-100 text-gray-700",
};

type StudentFormatted = {
  id: string;
  full_name: string;
  phone: string;
  class_grade: number;
  board: string;
  batch: string;
  plan: string;
  status: string;
  joined_at: string;
};

export default function StudentsClient({ initialStudents }: { initialStudents: StudentFormatted[] }) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    class_grade: "",
    board: "",
    parent_phone: "",
  });

  const filtered = initialStudents.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  const handleAddStudent = async () => {
    if (!formData.full_name || !formData.phone || !formData.class_grade || !formData.board) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await createStudent({
        full_name: formData.full_name,
        phone: formData.phone,
        class_grade: parseInt(formData.class_grade),
        board: formData.board,
        parent_phone: formData.parent_phone || undefined,
      });
      toast.success("Student added successfully!");
      setAddOpen(false);
      setFormData({ full_name: "", phone: "", class_grade: "", board: "", parent_phone: "" });
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Students</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your students and enrollments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-gray-200 cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger
              render={
                <Button className="gradient-accent text-white rounded-xl cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              }
            />
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input 
                  placeholder="Full Name" 
                  className="rounded-xl"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-xl bg-gray-50 border text-gray-500 text-sm">
                    +91
                  </div>
                  <Input
                    placeholder="Phone Number"
                    className="rounded-xl flex-1"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <Select value={formData.class_grade} onValueChange={(v) => setFormData({ ...formData, class_grade: v ?? "" })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_GRADES.map((g) => (
                      <SelectItem key={g} value={g.toString()}>
                        Class {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={formData.board} onValueChange={(v) => setFormData({ ...formData, board: v ?? "" })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select Board" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOARDS.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Parent Phone Number"
                  className="rounded-xl"
                  value={formData.parent_phone}
                  onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                />
                <Button
                  className="w-full gradient-accent text-white rounded-xl cursor-pointer"
                  onClick={handleAddStudent}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Student"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-gray-200"
          />
        </div>
        <Button
          variant="outline"
          className="rounded-xl border-gray-200 cursor-pointer"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Student List */}
      <div className="space-y-3">
        {filtered.map((student) => (
          <Card
            key={student.id}
            className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a1a2e] to-[#e94560] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {student.full_name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#1a1a2e] truncate">
                      {student.full_name}
                    </h3>
                    <Badge
                      className={`text-[10px] px-2 py-0 ${statusColors[student.status]}`}
                    >
                      {student.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {student.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      Class {student.class_grade} • {student.board}
                    </span>
                  </div>
                </div>

                {/* Plan Badge */}
                <Badge
                  className={`hidden sm:inline-flex text-xs px-3 py-1 rounded-lg ${planColors[student.plan]}`}
                >
                  {student.plan === "one_on_one"
                    ? "1-on-1"
                    : student.plan.charAt(0).toUpperCase() +
                      student.plan.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <p className="text-center text-sm text-gray-400">
        Showing {filtered.length} of {initialStudents.length} students
      </p>
    </div>
  );
}

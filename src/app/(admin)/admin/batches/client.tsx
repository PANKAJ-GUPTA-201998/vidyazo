/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Plus, Users, Calendar, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASS_GRADES, BOARDS } from "@/lib/constants";

import { createBatch } from "@/lib/actions/students";
import { toast } from "sonner";

const dayNames: Record<string, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export default function BatchesClient({ initialBatches }: { initialBatches: any[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    class_grade: "",
    board: "",
    max_capacity: "25",
    price_monthly: "899",
  });

  const handleCreateBatch = async () => {
    if (!formData.name || !formData.subject || !formData.class_grade || !formData.board || !formData.price_monthly) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createBatch({
        name: formData.name,
        subject: formData.subject,
        class_grade: parseInt(formData.class_grade),
        board: formData.board,
        max_capacity: parseInt(formData.max_capacity) || 25,
        price_monthly: parseInt(formData.price_monthly) * 100, // convert Rs to paise
        schedule: { mon: "17:00", wed: "17:00", fri: "17:00" }, // default schedule for now
      });
      toast.success("Batch created successfully");
      setCreateOpen(false);
      setFormData({
        name: "",
        subject: "",
        class_grade: "",
        board: "",
        max_capacity: "25",
        price_monthly: "899",
      });
    } catch (error: unknown) {
      toast.error(error.message || "Failed to create batch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Batches</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your class batches and schedules
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger
            render={
              <Button className="gradient-accent text-white rounded-xl cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Create Batch
              </Button>
            }
          />
          <DialogContent className="rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder='Batch Name (e.g. "Class 10 Math - Evening")'
                className="rounded-xl"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input 
                placeholder="Subject" 
                className="rounded-xl" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <Select value={formData.class_grade} onValueChange={(v) => setFormData({ ...formData, class_grade: v })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_GRADES.map((g) => (
                      <SelectItem key={g} value={g.toString()}>
                        Class {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={formData.board} onValueChange={(v) => setFormData({ ...formData, board: v })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Board" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOARDS.map((b) => (
                      <SelectItem key={b.value} value={b.value}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Max Capacity"
                  className="rounded-xl"
                  value={formData.max_capacity}
                  onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Price (₹/month)"
                  className="rounded-xl"
                  value={formData.price_monthly}
                  onChange={(e) => setFormData({ ...formData, price_monthly: e.target.value })}
                />
              </div>
              <Button
                className="w-full gradient-accent text-white rounded-xl cursor-pointer"
                onClick={handleCreateBatch}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Batch"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Batch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialBatches.map((batch) => {
          const fillPercent = Math.round(
            (batch.current_strength / batch.max_capacity) * 100
          );
          return (
            <Card
              key={batch.id}
              className={`border-0 shadow-md rounded-2xl hover:shadow-lg transition-shadow cursor-pointer ${
                !batch.is_active ? "opacity-60" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] text-lg">
                      {batch.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {batch.subject} • Class {batch.class_grade} •{" "}
                      {batch.board}
                    </p>
                  </div>
                  <Badge
                    className={
                      batch.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }
                  >
                    {batch.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-1.5 mb-4">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div className="flex gap-1.5 flex-wrap">
                    {Object.entries(batch.schedule).map(([day, time]) => (
                      <span
                        key={day}
                        className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700"
                      >
                        {dayNames[day]} {time}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Capacity */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Users className="w-4 h-4" />
                      {batch.current_strength}/{batch.max_capacity} students
                    </span>
                    <span className="font-medium text-[#1a1a2e]">
                      {fillPercent}%
                    </span>
                  </div>
                  <Progress value={fillPercent} className="h-2" />
                </div>

                {/* Price */}
                <div className="flex items-center gap-1.5 text-[#1a1a2e]">
                  <IndianRupee className="w-4 h-4" />
                  <span className="font-bold text-lg">
                    {(batch.price_monthly / 100).toLocaleString("en-IN")}
                  </span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

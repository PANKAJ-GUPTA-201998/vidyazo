import { getMyEnrollments } from "@/lib/actions/students";
import { getStudentRecordings } from "@/lib/actions/classes";
import ClassesClient from "./client";
import { addDays, setHours, setMinutes, isToday as dateFnsIsToday, startOfDay } from "date-fns";

type Enrollment = {
  id: string;
  batch: {
    id: string;
    subject: string;
    name: string;
    schedule: Record<string, string>;
  };
};

// Helper to generate next few classes based on schedule map {mon: '19:00', ...}
function generateClassesFromSchedule(enrollment: Enrollment, count = 3) {
  const schedule = enrollment.batch?.schedule || {};
  const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const classes = [];
  
  let currentDate = startOfDay(new Date());
  
  // Look ahead up to 14 days
  for (let i = 0; i < 14; i++) {
    if (classes.length >= count) break;
    
    const dayStr = dayNames[currentDate.getDay()];
    if (schedule[dayStr]) {
      const [hourStr, minStr] = schedule[dayStr].split(":");
      const classDate = setMinutes(setHours(currentDate, parseInt(hourStr)), parseInt(minStr));
      
      // If today and time has passed, maybe still show it, but usually we just list it
      classes.push({
        id: `${enrollment.id}_${classDate.getTime()}`,
        title: `${enrollment.batch.subject} Class`,
        topic: enrollment.batch.name,
        scheduled_at: classDate.toISOString(),
        meet_link: "https://meet.google.com/vid-yazo-edu", // Mock meet link
        status: "scheduled",
        isToday: dateFnsIsToday(classDate),
      });
    }
    
    currentDate = addDays(currentDate, 1);
  }
  
  return classes;
}

export default async function ClassesPage() {
  const enrollments = await getMyEnrollments();
  
  let upcomingClasses: ReturnType<typeof generateClassesFromSchedule> = [];
  
  (enrollments as Enrollment[]).forEach((e) => {
    upcomingClasses = [...upcomingClasses, ...generateClassesFromSchedule(e)];
  });
  
  // Sort by date ascending
  upcomingClasses.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  // Fetch real recordings
  const batchIds = (enrollments as Enrollment[]).map((e) => e.batch.id);
  const recordings = await getStudentRecordings(batchIds);

  return <ClassesClient initialUpcoming={upcomingClasses} initialRecordings={recordings} />;
}

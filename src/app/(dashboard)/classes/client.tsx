"use client";

import { Video, Play, Calendar, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UpcomingClass = {
  id: string;
  title: string;
  topic: string;
  scheduled_at: string;
  meet_link: string;
  status: string;
  isToday: boolean;
};

type Recording = {
  id: string;
  title: string;
  topic: string;
  date: string;
  recording_url: string;
  duration: string;
};

export default function ClassesClient({
  initialUpcoming,
  initialRecordings
}: {
  initialUpcoming: UpcomingClass[];
  initialRecordings: Recording[];
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1a1a2e]">Classes</h2>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-gray-100 p-1 h-auto">
          <TabsTrigger
            value="upcoming"
            className="rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Video className="w-4 h-4 mr-1.5" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="recordings"
            className="rounded-lg py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Play className="w-4 h-4 mr-1.5" />
            Recordings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {initialUpcoming.length === 0 ? (
            <div className="text-center p-6 text-gray-500">No upcoming classes scheduled.</div>
          ) : (
            initialUpcoming.map((cls) => (
            <Card
              key={cls.id}
              className={`border-0 shadow-sm rounded-2xl ${
                cls.isToday ? "ring-2 ring-blue-200" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    {cls.isToday && (
                      <Badge className="bg-blue-100 text-blue-700 text-[10px] mb-2">
                        TODAY
                      </Badge>
                    )}
                    <h3 className="font-semibold text-[#1a1a2e] mb-1">
                      {cls.title}
                    </h3>
                    <Badge className="bg-purple-50 text-purple-700 text-[10px] mb-2">
                      {cls.topic}
                    </Badge>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(cls.scheduled_at).toLocaleDateString("en-IN", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(cls.scheduled_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <a
                    href={cls.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className={`rounded-xl cursor-pointer ${
                        cls.isToday
                          ? "gradient-accent text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                      disabled={!cls.isToday}
                    >
                      <ExternalLink className="w-4 h-4 mr-1.5" />
                      Join
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )))}
        </TabsContent>

        <TabsContent value="recordings" className="mt-4 space-y-3">
          {initialRecordings.length === 0 ? (
            <div className="text-center p-6 text-gray-500">No recordings available.</div>
          ) : (
            initialRecordings.map((rec) => (
            <Card
              key={rec.id}
              className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] text-sm mb-1">
                      {rec.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-50 text-purple-700 text-[10px]">
                        {rec.topic}
                      </Badge>
                      <span className="text-xs text-gray-400">{rec.date}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {rec.duration}
                      </span>
                    </div>
                  </div>
                  <a
                    href={rec.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg cursor-pointer"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, BookOpen, Calculator, ScrollText, FlaskConical, CheckCircle2, Users, Clock, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_LINK } from "@/lib/constants";

const subjects = [
  {
    name: "Mathematics",
    nameHindi: "Mathematics",
    image: "/images/subject-maths.png",
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    lightGradient: "from-blue-50 to-indigo-50",
    accentColor: "#4f46e5",
    badgeColor: "bg-blue-100 text-blue-700",
    icon: Calculator,
    tagline: "Master everything from basic Logic to advanced Calculus!",
    description: "Understand every concept with expert teachers, practice thoroughly, and ace your exams. Track your progress with weekly tests.",
    topics: ["Algebra & Equations", "Geometry & Mensuration", "Trigonometry", "Statistics & Probability", "Number System", "Coordinate Geometry"],
    highlights: [
      { icon: Users, text: "Expert Math Teachers" },
      { icon: Clock, text: "4 Live Classes/Week" },
      { icon: Star, text: "Daily Doubt Sessions" },
    ],
    classes: "Class 6-12",
    boards: "CBSE • ICSE • UP • MP • Bihar",
    students: "500+",
    rating: "4.9",
  },
  {
    name: "English",
    nameHindi: "English Language",
    image: "/images/subject-english.png",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    lightGradient: "from-amber-50 to-orange-50",
    accentColor: "#ea580c",
    badgeColor: "bg-orange-100 text-orange-700",
    icon: BookOpen,
    tagline: "Master Grammar, Writing, and Speaking skills!",
    description: "Learn to write and speak fluent English. Build every essential skill from basic grammar to creative writing and literature.",
    topics: ["Grammar & Tenses", "Reading Comprehension", "Creative Writing", "Literature & Poetry", "Letter & Essay Writing", "Spoken English Tips"],
    highlights: [
      { icon: Users, text: "Native-Level Faculty" },
      { icon: Clock, text: "3 Live Classes/Week" },
      { icon: Star, text: "Writing Practice" },
    ],
    classes: "Class 6-12",
    boards: "CBSE • ICSE • UP • MP • Bihar",
    students: "350+",
    rating: "4.8",
  },
  {
    name: "Sanskrit",
    nameHindi: "Sanskrit",
    image: "/images/subject-sanskrit.png",
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    lightGradient: "from-emerald-50 to-teal-50",
    accentColor: "#059669",
    badgeColor: "bg-emerald-100 text-emerald-700",
    icon: ScrollText,
    tagline: "High-scoring subject — 90%+ marks guaranteed!",
    description: "Sanskrit is the easiest scoring subject. Guarantee full marks with smart learning techniques and consistent daily practice!",
    topics: ["Vyakaranam (Grammar)", "Shloka & Paath", "Anuvaad (Translation)", "Nibandh & Patra Lekhan", "Sandhi & Samas", "Dhatu Roop & Shabd Roop"],
    highlights: [
      { icon: Users, text: "Sanskrit Visheshagya" },
      { icon: Clock, text: "2 Live Classes/Week" },
      { icon: Star, text: "Exam-Focused Prep" },
    ],
    classes: "Class 6-12",
    boards: "CBSE • UP • MP • Bihar",
    students: "200+",
    rating: "4.9",
  },
  {
    name: "Science",
    nameHindi: "Science (PCB/PCM)",
    image: "/images/subject-maths.png",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-600",
    lightGradient: "from-rose-50 to-pink-50",
    accentColor: "#e11d48",
    badgeColor: "bg-rose-100 text-rose-700",
    icon: FlaskConical,
    tagline: "From atoms to ecosystems — master every concept!",
    description: "Build a strong foundation in Physics, Chemistry, and Biology with experiments, diagrams, and concept-based learning.",
    topics: ["Physics: Motion & Force", "Physics: Light & Electricity", "Chemistry: Elements & Reactions", "Chemistry: Acids, Bases & Salts", "Biology: Life Processes", "Biology: Heredity & Evolution"],
    highlights: [
      { icon: Users, text: "Expert Science Faculty" },
      { icon: Clock, text: "4 Live Classes/Week" },
      { icon: Star, text: "Practical Demos" },
    ],
    classes: "Class 6-12",
    boards: "CBSE • ICSE • UP • MP • Bihar",
    students: "400+",
    rating: "4.8",
  },
];

export function SubjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const subject = subjects[activeIndex];

  const goNext = () => setActiveIndex((prev) => (prev + 1) % subjects.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + subjects.length) % subjects.length);

  return (
    <section className="py-20 sm:py-28 bg-white" id="subjects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1a1a2e]/10 text-[#1a1a2e] text-sm font-medium mb-4">
            Our Subjects
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4">
            4 Subjects,{" "}
            <span className="bg-gradient-to-r from-[#e94560] to-[#ff6b81] bg-clip-text text-transparent">
              Unlimited Learning
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Expert teachers, weekly tests, and detailed progress reports for every subject
          </p>
        </div>

        {/* Subject Selector Tabs */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-10">
          {subjects.map((sub, idx) => (
            <button
              key={sub.name}
              onClick={() => setActiveIndex(idx)}
              className={`flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? `bg-gradient-to-r ${sub.gradient} text-white shadow-lg scale-105`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <sub.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              {sub.name}
            </button>
          ))}
        </div>

        {/* Main Card with Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={goPrev}
            className="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:scale-110 transition-all duration-300 cursor-pointer"
            aria-label="Previous subject"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goNext}
            className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:scale-110 transition-all duration-300 cursor-pointer"
            aria-label="Next subject"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Card */}
          <div
            className={`relative rounded-[2rem] overflow-hidden border-2 border-gray-100 shadow-2xl bg-gradient-to-br ${subject.lightGradient} mx-8 sm:mx-12 transition-all duration-500`}
          >
            {/* Top gradient bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${subject.gradient}`} />

            <div className="flex flex-col lg:flex-row">
              {/* Left Side — Image + Quick Info */}
              <div className="lg:w-5/12 p-6 sm:p-8 lg:p-10 flex flex-col items-center lg:items-start">
                {/* Subject Image */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-6 group">
                  <Image
                    src={subject.image}
                    alt={subject.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Name */}
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] mb-1">
                  {subject.name}
                </h3>
                <p className="text-lg text-gray-400 font-medium mb-3">{subject.nameHindi}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    ⭐ {subject.rating} Rating
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {subject.students} Students
                  </span>
                </div>

                {/* Tagline */}
                <p className="text-gray-700 text-base sm:text-lg italic font-medium mb-4 text-center lg:text-left">
                  &quot;{subject.tagline}&quot;
                </p>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-6 text-center lg:text-left">
                  {subject.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {subject.highlights.map((h) => (
                    <div
                      key={h.text}
                      className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-2 rounded-xl shadow-sm border border-gray-100"
                    >
                      <h.icon className="w-4 h-4" style={{ color: subject.accentColor }} />
                      <span className="text-xs font-semibold text-gray-700">{h.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button
                    className={`w-full h-13 bg-gradient-to-r ${subject.gradient} text-white rounded-xl text-base font-semibold hover:opacity-90 hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-lg`}
                  >
                    Book Free Demo — {subject.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>

              {/* Right Side — Topics */}
              <div className="lg:w-7/12 bg-white/60 backdrop-blur-sm p-6 sm:p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-gray-200/60">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                  📚 What You&apos;ll Learn
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {subject.topics.map((topic, i) => (
                    <div
                      key={topic}
                      className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${subject.accentColor}15` }}
                      >
                        <CheckCircle2
                          className="w-4 h-4"
                          style={{ color: subject.accentColor }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1a1a2e]">{topic}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Boards */}
                <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Supported Boards</p>
                  <p className="text-sm font-semibold text-gray-700">{subject.boards}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {subjects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? "w-8 h-3 bg-gradient-to-r " + subjects[idx].gradient
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to ${subjects[idx].name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

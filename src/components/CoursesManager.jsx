import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  GraduationCap,
  Plus,
  BookOpen,
  FileText,
  Video,
  Users,
  Star,
  Edit,
  Trash2,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  BookMarked
} from 'lucide-react';

const CoursesManager = () => {
  const {
    courses,
    selectedBatchFilter,
    searchQuery,
    openModal,
    deleteCourse
  } = useAdmin();

  const [selectedSubject, setSelectedSubject] = useState('All');
  const [expandedCourseId, setExpandedCourseId] = useState(courses[0]?.id || null);

  const subjects = ['All', 'Accountancy', 'Economics', 'Business Studies', 'Entrepreneurship'];

  // Filtering
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.referenceBook.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBatch =
      selectedBatchFilter === 'All' || course.classLevel === selectedBatchFilter;

    const matchesSubject =
      selectedSubject === 'All' || course.subject === selectedSubject;

    return matchesSearch && matchesBatch && matchesSubject;
  });

  const totalLectures = courses.reduce((acc, c) => acc + c.totalLectures, 0);
  const totalEnrolled = courses.reduce((acc, c) => acc + c.enrolledStudents, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-bold mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Curriculum & Batch Management</span>
          </div>
          <h2 className="text-2xl font-black text-white">Class 11 & 12 Commerce Courses</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage video lectures, chapter breakdowns, and T.S. Grewal & Sandeep Garg PDF notes solutions.
          </p>
        </div>

        <button
          onClick={() => openModal('course')}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-600/25 flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Quick Summary Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Published Courses</span>
          <span className="text-xl font-black text-white">{courses.length} Batches</span>
        </div>
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Video Lectures</span>
          <span className="text-xl font-black text-blue-400">{totalLectures} HD Hours</span>
        </div>
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Enrolled Commerce Students</span>
          <span className="text-xl font-black text-emerald-400">{totalEnrolled.toLocaleString()}</span>
        </div>
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Syllabus Coverage Rate</span>
          <span className="text-xl font-black text-amber-400">100% CBSE & NCERT</span>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-400 font-bold mr-2">Filter Subject:</span>
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedSubject === sub
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Courses List Accordion / Grid */}
      <div className="space-y-4">
        {filteredCourses.map((course) => {
          const isExpanded = expandedCourseId === course.id;

          return (
            <div
              key={course.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden transition shadow-xl"
            >
              {/* Course Card Header */}
              <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-700 flex-shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 font-extrabold text-[10px] rounded-md border border-blue-500/30">
                        {course.classLevel}
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] rounded-md border border-emerald-500/30">
                        {course.badge}
                      </span>
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white leading-tight">{course.title}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span>Instructor: <strong className="text-slate-200">{course.instructor}</strong></span>
                      <span>Ref Book: <strong className="text-amber-300">{course.referenceBook}</strong></span>
                      <span>Enrolled: <strong className="text-emerald-400">{course.enrolledStudents.toLocaleString()} Students</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions & Chapter Count */}
                <div className="flex items-center space-x-3 self-end lg:self-center">
                  <button
                    onClick={() => openModal('course', course)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition border border-slate-700"
                    title="Edit Course & Chapters"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition border border-rose-500/20"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                    className="px-4 py-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
                  >
                    <span>{course.chapters.length} Chapters</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Chapters Breakdown Drawer */}
              {isExpanded && (
                <div className="bg-slate-950 p-6 border-t border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      Chapter Breakdown & PDF Notes Handouts
                    </h4>
                    <span className="text-xs text-blue-400 font-semibold">
                      {course.completedLectures} of {course.totalLectures} Lectures Completed
                    </span>
                  </div>

                  <div className="space-y-3">
                    {course.chapters.map((ch, idx) => (
                      <div
                        key={ch.id || idx}
                        className="p-4 bg-slate-900 border border-slate-800/90 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            0{idx + 1}
                          </span>
                          <div>
                            <h5 className="font-bold text-white text-sm">{ch.title}</h5>
                            <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                              <span>{ch.lecturesCount} Video Lectures</span>
                              <span>Duration: {ch.duration}</span>
                              <span className="text-emerald-400 font-semibold">{ch.status}</span>
                            </div>
                          </div>
                        </div>

                        {ch.pdfHandouts && (
                          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-xs font-medium truncate max-w-[200px]">{ch.pdfHandouts}</span>
                            <Download className="w-3.5 h-3.5 text-blue-400 cursor-pointer hover:text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesManager;

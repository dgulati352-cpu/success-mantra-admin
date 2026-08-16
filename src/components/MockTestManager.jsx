import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  FileCheck2,
  Plus,
  Clock,
  Award,
  Users,
  BarChart3,
  Edit,
  Trash2,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Brain
} from 'lucide-react';

const MockTestManager = () => {
  const {
    tests,
    selectedBatchFilter,
    searchQuery,
    openModal,
    deleteTest,
    students
  } = useAdmin();

  const [selectedTestId, setSelectedTestId] = useState(tests[0]?.id || null);
  const selectedTest = tests.find((t) => t.id === selectedTestId) || tests[0];

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch =
      selectedBatchFilter === 'All' || test.classLevel === selectedBatchFilter;
    return matchesSearch && matchesBatch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs text-purple-400 font-bold mb-1">
            <FileCheck2 className="w-4 h-4" />
            <span>NTA Computer Based Test (CBT) Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white">NTA Mock Test Series & Question Bank</h2>
          <p className="text-xs text-slate-400 mt-1">
            Create NTA CBT standard practice exams for CBSE Class 11 & 12 Commerce and CUET Domain.
          </p>
        </div>

        <button
          onClick={() => openModal('testBuilder')}
          className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-purple-600/25 flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create NTA Mock Test</span>
        </button>
      </div>

      {/* Test List & Detailed Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Test Series Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredTests.map((test) => {
            const isSelected = test.id === selectedTest?.id;

            return (
              <div
                key={test.id}
                onClick={() => setSelectedTestId(test.id)}
                className={`p-5 rounded-3xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-purple-500/80 ring-1 ring-purple-500/40 shadow-xl'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded border border-purple-500/30">
                    {test.classLevel} • {test.subject}
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">{test.markingScheme}</span>
                </div>

                <h3 className="font-extrabold text-white text-sm leading-snug">{test.title}</h3>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{test.durationMinutes} Mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{test.totalMarks} Marks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>{test.attemptsCount.toLocaleString()} Taken</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Test Details, Question Bank & Leaderboard */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          {selectedTest ? (
            <>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-purple-400 font-bold">
                    <span>{selectedTest.classLevel}</span>
                    <span>•</span>
                    <span>{selectedTest.subject}</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">{selectedTest.title}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openModal('testBuilder', selectedTest)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition border border-slate-700"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Test</span>
                  </button>
                  <button
                    onClick={() => deleteTest(selectedTest.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition border border-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stat Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Duration</span>
                  <span className="font-bold text-white">{selectedTest.durationMinutes} Minutes</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Total Questions</span>
                  <span className="font-bold text-purple-400">{selectedTest.totalQuestions} MCQs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Average Score</span>
                  <span className="font-bold text-emerald-400">{selectedTest.avgScore} / {selectedTest.totalMarks}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Pass Rate</span>
                  <span className="font-bold text-amber-400">{selectedTest.passRate}%</span>
                </div>
              </div>

              {/* Question Bank Sample Viewer */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-black text-white">NTA Question Bank & Solution Blueprint</h4>
                  </div>
                  <button
                    onClick={() => openModal('testBuilder', selectedTest)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-bold"
                  >
                    + Add Questions
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedTest.questions && selectedTest.questions.length > 0 ? (
                    selectedTest.questions.map((q, idx) => (
                      <div key={q.id || idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
                        <div className="flex items-start justify-between">
                          <span className="font-bold text-purple-400">Q{idx + 1}. ({q.type})</span>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold">
                            +4 Marks
                          </span>
                        </div>
                        <p className="font-semibold text-white leading-relaxed">{q.questionText}</p>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-xl border font-medium ${
                                oIdx === q.correctOption
                                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-bold'
                                  : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </div>
                          ))}
                        </div>

                        {q.explanation && (
                          <div className="p-2.5 bg-slate-900/90 border border-slate-800/80 rounded-xl text-[11px] text-slate-300 space-y-1">
                            <span className="text-amber-400 font-bold block">Step Solution:</span>
                            <p>{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                      No questions added yet. Click "Edit Test" to populate the question bank.
                    </div>
                  )}
                </div>
              </div>

              {/* Student Leaderboard */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Top Rankers Scorecard (Current Session)
                </h4>
                <div className="space-y-2">
                  {students.slice(0, 3).map((stu, idx) => (
                    <div key={stu.id} className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 font-black text-[10px] flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <strong className="text-white">{stu.name}</strong>
                          <span className="text-slate-400 block text-[10px]">{stu.classLevel} • {stu.stream}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-black">{stu.testAvg}</span>
                        <span className="text-slate-500 block text-[10px]">{stu.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">Select a test to inspect question bank</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockTestManager;

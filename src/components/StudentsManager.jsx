import React from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  Users,
  Search,
  Crown,
  Award,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const StudentsManager = () => {
  const {
    students,
    toggleStudentVip,
    searchQuery,
    selectedBatchFilter,
    openModal
  } = useAdmin();

  const filteredStudents = students.filter((stu) => {
    const matchesSearch =
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.phone.includes(searchQuery);

    const matchesBatch =
      selectedBatchFilter === 'All' || stu.classLevel === selectedBatchFilter;

    return matchesSearch && matchesBatch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-bold mb-1">
            <Users className="w-4 h-4" />
            <span>Student Management & CRM Directory</span>
          </div>
          <h2 className="text-2xl font-black text-white">Commerce Student Directory</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track student test performances, active batch enrollment, and VIP subscription passes.
          </p>
        </div>
      </div>

      {/* Directory Table Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white">Enrolled Students ({filteredStudents.length})</h3>
          <span className="text-xs text-slate-400">Class 11 & 12 Commerce (Non-Maths)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl">Student Name</th>
                <th className="p-3.5">Batch / Stream</th>
                <th className="p-3.5">Test Score Avg</th>
                <th className="p-3.5">Rank</th>
                <th className="p-3.5">VIP Access</th>
                <th className="p-3.5">Last Active</th>
                <th className="p-3.5 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-950/50 transition">
                  <td className="p-3.5">
                    <div className="flex items-center space-x-3">
                      <img
                        src={stu.avatar}
                        alt={stu.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                      />
                      <div>
                        <strong className="text-white block font-bold">{stu.name}</strong>
                        <span className="text-[11px] text-slate-400">{stu.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 space-y-0.5">
                    <span className="font-bold text-white block">{stu.classLevel}</span>
                    <span className="text-[10px] text-slate-400">{stu.stream}</span>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-400">{stu.testAvg}</td>
                  <td className="p-3.5 font-bold text-amber-400">{stu.rank}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-black rounded-lg ${
                        stu.vipStatus === 'VIP Active'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {stu.vipStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">{stu.lastActive}</td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => toggleStudentVip(stu.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] rounded-xl transition border border-slate-700"
                    >
                      {stu.vipStatus === 'VIP Active' ? 'Revoke VIP' : 'Grant VIP'}
                    </button>
                    <button
                      onClick={() => openModal('studentDetail', stu)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-xl transition shadow-sm"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsManager;

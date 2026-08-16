import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { X, Plus, Trash2, CheckCircle2, Truck, FileText, Video, GraduationCap, ShoppingBag } from 'lucide-react';

export const AllModals = () => {
  const { activeModal, modalData, closeModal, saveCourse, saveLiveClass, saveTest, saveBook, updateOrderStatus, sendBroadcast } = useAdmin();

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-scale-up">
        <button
          onClick={closeModal}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>

        {activeModal === 'course' && <CourseModalForm data={modalData} saveCourse={saveCourse} closeModal={closeModal} />}
        {activeModal === 'liveClass' && <LiveClassModalForm data={modalData} saveLiveClass={saveLiveClass} closeModal={closeModal} />}
        {activeModal === 'testBuilder' && <TestBuilderModalForm data={modalData} saveTest={saveTest} closeModal={closeModal} />}
        {activeModal === 'book' && <BookModalForm data={modalData} saveBook={saveBook} closeModal={closeModal} />}
        {activeModal === 'orderDispatch' && <OrderDispatchForm data={modalData} updateOrderStatus={updateOrderStatus} closeModal={closeModal} />}
        {activeModal === 'studentDetail' && <StudentDetailView data={modalData} closeModal={closeModal} />}
        {activeModal === 'broadcast' && <BroadcastForm sendBroadcast={sendBroadcast} closeModal={closeModal} />}
      </div>
    </div>
  );
};

// Course Modal Form
const CourseModalForm = ({ data, saveCourse, closeModal }) => {
  const [formData, setFormData] = useState(
    data || {
      title: '',
      classLevel: 'Class 12',
      subject: 'Accountancy',
      referenceBook: 'T.S. Grewal 2026 Edition',
      instructor: 'CA Shivam Grewal',
      totalLectures: 30,
      badge: 'Core Domain',
      thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      chapters: [
        { id: 'ch-1', title: 'Chapter 1: Basics & Accounting Rules', lecturesCount: 5, duration: '3h 30m', pdfHandouts: 'Handwritten Notes.pdf', status: 'Completed' }
      ]
    }
  );

  const [newChTitle, setNewChTitle] = useState('');

  const handleAddChapter = () => {
    if (!newChTitle) return;
    setFormData({
      ...formData,
      chapters: [
        ...formData.chapters,
        { id: `ch-${Date.now()}`, title: newChTitle, lecturesCount: 4, duration: '2h 45m', pdfHandouts: 'Chapter Notes.pdf', status: 'Upcoming' }
      ]
    });
    setNewChTitle('');
  };

  const handleRemoveChapter = (idx) => {
    setFormData({ ...formData, chapters: formData.chapters.filter((_, i) => i !== idx) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveCourse({ ...formData, totalLectures: formData.chapters.reduce((acc, c) => acc + (c.lecturesCount || 1), 0) });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
        <GraduationCap className="w-4 h-4" />
        <span>{data ? 'Edit Course & Curriculum' : 'Add New Commerce Course'}</span>
      </div>
      <h3 className="text-xl font-black text-white">{data ? data.title : 'Create New Subject Batch'}</h3>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="text-slate-400 font-semibold block mb-1">Course Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Class 12 Accountancy Master Batch"
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Class Level</label>
            <select
              value={formData.classLevel}
              onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="Class 12">Class 12</option>
              <option value="Class 11">Class 11</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="Accountancy">Accountancy</option>
              <option value="Economics">Economics</option>
              <option value="Business Studies">Business Studies</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Reference Book</label>
            <input
              type="text"
              value={formData.referenceBook}
              onChange={(e) => setFormData({ ...formData, referenceBook: e.target.value })}
              placeholder="e.g. T.S. Grewal 2026"
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Master Instructor</label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              placeholder="e.g. CA Shivam Grewal"
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Chapters Builder */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-slate-300 font-bold block">Chapters Breakdown & Notes</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newChTitle}
              onChange={(e) => setNewChTitle(e.target.value)}
              placeholder="Enter chapter name (e.g. Partnership Deed)..."
              className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddChapter}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition"
            >
              Add
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pt-2">
            {formData.chapters.map((ch, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="font-semibold text-white truncate max-w-sm">{idx + 1}. {ch.title}</span>
                <button type="button" onClick={() => handleRemoveChapter(idx)} className="text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md">
            Save Course
          </button>
        </div>
      </form>
    </div>
  );
};

// Live Class Modal Form
const LiveClassModalForm = ({ data, saveLiveClass, closeModal }) => {
  const [formData, setFormData] = useState(
    data || {
      title: 'Live Accountancy Masterclass',
      subject: 'Accountancy',
      classLevel: 'Class 12',
      instructor: 'CA Shivam Grewal',
      assistantTeacher: 'CA Ritu Verma (Doubts)',
      scheduledTime: 'Today 06:00 PM',
      duration: '90 mins',
      status: 'Upcoming',
      streamKey: `sm_live_${Math.floor(Math.random() * 900000 + 100000)}`,
      unlockedForVip: true,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    saveLiveClass(formData);
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="flex items-center space-x-2 text-emerald-400 font-bold">
        <Video className="w-4 h-4" />
        <span>Schedule Live Studio Stream</span>
      </div>
      <h3 className="text-xl font-black text-white">Live Broadcast Configurator</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-slate-400 font-semibold block mb-1">Session Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Master Teacher</label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Assistant Teacher (2-Teacher Doubts)</label>
            <input
              type="text"
              value={formData.assistantTeacher}
              onChange={(e) => setFormData({ ...formData, assistantTeacher: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Scheduled Date & Time</label>
            <input
              type="text"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">RTMP Stream Key</label>
            <input
              type="text"
              readOnly
              value={formData.streamKey || 'live_key_98765'}
              className="w-full bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs rounded-xl px-3.5 py-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md">
            Save Stream
          </button>
        </div>
      </form>
    </div>
  );
};

// Test Builder Modal Form
const TestBuilderModalForm = ({ data, saveTest, closeModal }) => {
  const [formData, setFormData] = useState(
    data || {
      title: 'Commerce Full Board Mock Test #05',
      subject: 'Accountancy, Economics, BST',
      classLevel: 'Class 12',
      durationMinutes: 180,
      totalMarks: 300,
      totalQuestions: 75,
      markingScheme: '+4 for correct, -1 for incorrect',
      questions: [
        {
          id: 'q-1',
          type: 'MCQ',
          questionText: 'In the absence of a Partnership Deed, what is the profit sharing ratio among partners?',
          options: ['Equal (1:1)', 'In Capital Ratio', '2:1', 'No profits distributed'],
          correctOption: 0,
          explanation: 'As per Indian Partnership Act 1932, profits/losses are shared equally in the absence of a deed.',
        }
      ]
    }
  );

  const [qText, setQText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctOpt, setCorrectOpt] = useState(0);
  const [exp, setExp] = useState('');

  const handleAddQuestion = () => {
    if (!qText || !opt0 || !opt1) return;
    const newQ = {
      id: `q-${Date.now()}`,
      type: 'MCQ',
      questionText: qText,
      options: [opt0, opt1, opt2 || 'Option C', opt3 || 'Option D'],
      correctOption: Number(correctOpt),
      explanation: exp || 'Standard CBSE solution steps.',
    };
    setFormData({
      ...formData,
      questions: [...(formData.questions || []), newQ],
      totalQuestions: (formData.questions?.length || 0) + 1,
    });
    setQText('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setExp('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveTest(formData);
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="flex items-center space-x-2 text-purple-400 font-bold">
        <FileText className="w-4 h-4" />
        <span>NTA CBT Test Series Builder</span>
      </div>
      <h3 className="text-xl font-black text-white">{data ? 'Edit NTA CBT Test' : 'Publish New Mock Test'}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-slate-400 font-semibold block mb-1">Test Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Duration (Mins)</label>
            <input
              type="number"
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Total Marks</label>
            <input
              type="number"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Marking Scheme</label>
            <input
              type="text"
              value={formData.markingScheme}
              onChange={(e) => setFormData({ ...formData, markingScheme: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2"
            />
          </div>
        </div>

        {/* Question Creator */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <label className="text-purple-400 font-bold block">Add Question to Question Bank</label>
          <textarea
            rows={2}
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            placeholder="Type question stem (KaTeX math supported)..."
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2"
          />

          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Option A" value={opt0} onChange={(e) => setOpt0(e.target.value)} className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5" />
            <input type="text" placeholder="Option B" value={opt1} onChange={(e) => setOpt1(e.target.value)} className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5" />
            <input type="text" placeholder="Option C" value={opt2} onChange={(e) => setOpt2(e.target.value)} className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5" />
            <input type="text" placeholder="Option D" value={opt3} onChange={(e) => setOpt3(e.target.value)} className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-1.5" />
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-slate-400 font-semibold">Correct Option Index:</label>
            <select
              value={correctOpt}
              onChange={(e) => setCorrectOpt(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-emerald-400 font-bold rounded-xl px-3 py-1"
            >
              <option value={0}>Option A (0)</option>
              <option value={1}>Option B (1)</option>
              <option value={2}>Option C (2)</option>
              <option value={3}>Option D (3)</option>
            </select>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition"
            >
              Add Question
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-md">
            Save Test Series
          </button>
        </div>
      </form>
    </div>
  );
};

// Book Modal Form
const BookModalForm = ({ data, saveBook, closeModal }) => {
  const [formData, setFormData] = useState(
    data || {
      title: 'T.S. Grewal Double Entry Bookkeeping Class 12',
      author: 'T.S. Grewal Board',
      subject: 'Accountancy',
      classLevel: 'Class 12',
      price: 699,
      originalPrice: 850,
      discount: '18% OFF',
      stock: 120,
      sku: `BK-TSG-${Math.floor(Math.random() * 900 + 100)}`,
      isbn: '978-93-5389-102-1',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    saveBook(formData);
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="flex items-center space-x-2 text-amber-400 font-bold">
        <ShoppingBag className="w-4 h-4" />
        <span>Bookstore Catalog & Inventory</span>
      </div>
      <h3 className="text-xl font-black text-white">{data ? 'Edit Book Details' : 'Add Book to Catalog'}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-slate-400 font-semibold block mb-1">Book Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="Accountancy">Accountancy</option>
              <option value="Economics">Economics</option>
              <option value="Business Studies">Business Studies</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Selling Price (₹)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Original Price (₹)</label>
            <input
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Stock Count</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md">
            Save Book
          </button>
        </div>
      </form>
    </div>
  );
};

// Order Dispatch Modal Form
const OrderDispatchForm = ({ data, updateOrderStatus, closeModal }) => {
  const [shippingStatus, setShippingStatus] = useState(data?.shippingStatus || 'Shipped');
  const [trackingNumber, setTrackingNumber] = useState(data?.trackingNumber || `BD-DEL-${Math.floor(Math.random() * 90000000)}`);
  const [courier, setCourier] = useState(data?.courier || 'BlueDart Express');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrderStatus(data.id, shippingStatus, trackingNumber, courier);
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="flex items-center space-x-2 text-blue-400 font-bold">
        <Truck className="w-4 h-4" />
        <span>Fulfill Bookstore Order #{data?.id}</span>
      </div>
      <h3 className="text-xl font-black text-white">Shipping & Tracking Dispatch</h3>

      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
        <p className="font-bold text-white">Student: {data?.studentName} ({data?.phone})</p>
        <p className="text-slate-400">Address: {data?.address}</p>
        <p className="text-slate-300 font-semibold">Items: {data?.items?.join(', ')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-slate-400 font-semibold block mb-1">Status</label>
          <select
            value={shippingStatus}
            onChange={(e) => setShippingStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Courier Partner</label>
            <select
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="BlueDart Express">BlueDart Express</option>
              <option value="Delhivery">Delhivery</option>
              <option value="India Post SpeedPost">India Post SpeedPost</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-emerald-400 font-mono rounded-xl px-3.5 py-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md">
            Update Dispatch Status
          </button>
        </div>
      </form>
    </div>
  );
};

// Student Detail View Modal
const StudentDetailView = ({ data, closeModal }) => {
  if (!data) return null;

  return (
    <div className="space-y-5 text-xs">
      <div className="flex items-center space-x-3">
        <img src={data.avatar} alt={data.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/40" />
        <div>
          <h3 className="text-xl font-black text-white">{data.name}</h3>
          <p className="text-slate-400">{data.email} • {data.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
        <div>
          <span className="text-[10px] text-slate-500 font-bold block uppercase">Enrolled Batch</span>
          <span className="font-bold text-white">{data.classLevel} ({data.stream})</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold block uppercase">Board Syllabus</span>
          <span className="font-bold text-blue-400">{data.board}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold block uppercase">Test Score Average</span>
          <span className="font-bold text-emerald-400">{data.testAvg}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold block uppercase">Platform Rank</span>
          <span className="font-bold text-amber-400">{data.rank}</span>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={closeModal} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl">
          Close Profile
        </button>
      </div>
    </div>
  );
};

// Broadcast Modal Form
const BroadcastForm = ({ sendBroadcast, closeModal }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !message) return;
    sendBroadcast({ title, message, targetAudience: 'All Commerce Students', type: 'Push & In-App' });
  };

  return (
    <div className="space-y-5 text-xs">
      <h3 className="text-xl font-black text-white">Send Quick Push Notification</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-slate-400 font-semibold block mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification Title"
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2"
          />
        </div>
        <div>
          <label className="text-slate-400 font-semibold block mb-1">Message</label>
          <textarea
            rows={3}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Notification Message..."
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2"
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl">
            Send Broadcast
          </button>
        </div>
      </form>
    </div>
  );
};

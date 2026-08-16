import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  INITIAL_STATS,
  INITIAL_COURSES,
  INITIAL_LIVE_CLASSES,
  INITIAL_TESTS,
  INITIAL_BOOKS,
  INITIAL_ORDERS,
  INITIAL_STUDENTS,
  INITIAL_BROADCASTS,
  INITIAL_VIP_PLANS
} from '../data/mockData';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('All');

  // Core Platform Data State with localStorage persistence
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('sm_admin_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('sm_admin_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [liveClasses, setLiveClasses] = useState(() => {
    const saved = localStorage.getItem('sm_admin_live');
    return saved ? JSON.parse(saved) : INITIAL_LIVE_CLASSES;
  });

  const [tests, setTests] = useState(() => {
    const saved = localStorage.getItem('sm_admin_tests');
    return saved ? JSON.parse(saved) : INITIAL_TESTS;
  });

  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('sm_admin_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('sm_admin_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('sm_admin_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [broadcasts, setBroadcasts] = useState(() => {
    const saved = localStorage.getItem('sm_admin_broadcasts');
    return saved ? JSON.parse(saved) : INITIAL_BROADCASTS;
  });

  const [vipPlans, setVipPlans] = useState(() => {
    const saved = localStorage.getItem('sm_admin_vip');
    return saved ? JSON.parse(saved) : INITIAL_VIP_PLANS;
  });

  // Modal Control States
  const [activeModal, setActiveModal] = useState(null); // 'course', 'liveClass', 'testBuilder', 'book', 'orderDispatch', 'studentDetail', 'broadcast'
  const [modalData, setModalData] = useState(null);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('sm_admin_stats', JSON.stringify(stats)); }, [stats]);
  useEffect(() => { localStorage.setItem('sm_admin_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('sm_admin_live', JSON.stringify(liveClasses)); }, [liveClasses]);
  useEffect(() => { localStorage.setItem('sm_admin_tests', JSON.stringify(tests)); }, [tests]);
  useEffect(() => { localStorage.setItem('sm_admin_books', JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem('sm_admin_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('sm_admin_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('sm_admin_broadcasts', JSON.stringify(broadcasts)); }, [broadcasts]);
  useEffect(() => { localStorage.setItem('sm_admin_vip', JSON.stringify(vipPlans)); }, [vipPlans]);

  // Publish books catalog to Firestore + localStorage fallback for real-time student portal sync
  const publishBooksToCatalog = async (updatedBooks) => {
    try {
      // Map admin book fields -> student BookItem fields
      const catalogBooks = updatedBooks.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        targetExam: b.targetExam || 'CBSE',
        classLevel: b.classLevel || 'Both',
        price: b.price || 0,
        originalPrice: b.originalPrice || b.price || 0,
        coverImage: b.image || b.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
        rating: b.rating || 4.8,
        inStock: b.status !== 'Out of Stock',
        subject: b.subject || '',
        discount: b.discount || '',
      }));

      // Write to Firestore for cross-device real-time sync
      await setDoc(doc(db, 'catalog', 'booksCatalog'), {
        books: catalogBooks,
        updatedAt: Date.now(),
        updatedBy: 'admin',
      });

      // Also keep localStorage as instant same-device fallback
      localStorage.setItem('sm_books_catalog', JSON.stringify(catalogBooks));
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('sm_books_channel');
        bc.postMessage({ type: 'BOOKS_UPDATED', books: catalogBooks });
        bc.close();
      }
    } catch (e) {
      console.warn('Failed to publish books catalog to Firestore:', e);
      // Fallback: localStorage only
      try {
        const catalogBooks = updatedBooks.map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          targetExam: b.targetExam || 'CBSE',
          classLevel: b.classLevel || 'Both',
          price: b.price || 0,
          originalPrice: b.originalPrice || b.price || 0,
          coverImage: b.image || b.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
          rating: b.rating || 4.8,
          inStock: b.status !== 'Out of Stock',
          subject: b.subject || '',
          discount: b.discount || '',
        }));
        localStorage.setItem('sm_books_catalog', JSON.stringify(catalogBooks));
      } catch (le) {
        console.warn('localStorage fallback also failed:', le);
      }
    }
  };

  // Toast Helper
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Actions ---
  
  // Courses CRUD
  const saveCourse = (courseData) => {
    if (courseData.id) {
      setCourses((prev) => prev.map((c) => (c.id === courseData.id ? courseData : c)));
      showToast(`Updated course "${courseData.title}" successfully`, 'success');
    } else {
      const newCourse = {
        ...courseData,
        id: `course-${Date.now()}`,
        enrolledStudents: 0,
        completedLectures: 0,
        rating: 5.0,
        chapters: courseData.chapters || [],
      };
      setCourses((prev) => [newCourse, ...prev]);
      showToast(`Created new course "${courseData.title}"`, 'success');
    }
    closeModal();
  };

  const deleteCourse = (id) => {
    const course = courses.find((c) => c.id === id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast(`Deleted course "${course?.title || id}"`, 'warning');
  };

  // Live Classes Management
  const saveLiveClass = (liveData) => {
    if (liveData.id) {
      setLiveClasses((prev) => prev.map((l) => (l.id === liveData.id ? liveData : l)));
      showToast(`Updated Live Session "${liveData.title}"`, 'success');
    } else {
      const newLive = {
        ...liveData,
        id: `live-${Date.now()}`,
        status: liveData.status || 'Upcoming',
        currentViewers: 0,
        peakViewers: 0,
        doubtsQueue: [],
      };
      setLiveClasses((prev) => [newLive, ...prev]);
      showToast(`Scheduled new Live Session "${liveData.title}"`, 'success');
    }
    closeModal();
  };

  const toggleLiveStatus = (id, newStatus) => {
    setLiveClasses((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const currentViewers = newStatus === 'LIVE NOW' ? Math.floor(Math.random() * 500) + 1000 : 0;
          let doubts = l.doubtsQueue || [];
          if (newStatus === 'LIVE NOW' && doubts.length === 0) {
            doubts = [
              { id: `d-${Date.now()}-1`, student: "Dhairya Gulati", question: `Sir, can you please explain ${l.subject} numerical formula step-by-step?`, time: "Just now", status: "Pending" },
              { id: `d-${Date.now()}-2`, student: "Ananya Sharma", question: "Is this chapter weightage high in CBSE Board Exam?", time: "1 min ago", status: "Pending" },
              { id: `d-${Date.now()}-3`, student: "Rohan Kapoor", question: "Can we get the PDF notes of this live masterclass in student portal?", time: "2 mins ago", status: "Pinned" },
            ];
          }
          return { ...l, status: newStatus, currentViewers, doubtsQueue: doubts };
        }
        return l;
      })
    );
    showToast(`Live Stream status changed to ${newStatus}`, 'info');
  };

  const resolveDoubt = (liveId, doubtId) => {
    setLiveClasses((prev) =>
      prev.map((l) => {
        if (l.id === liveId) {
          return {
            ...l,
            doubtsQueue: l.doubtsQueue.map((d) => (d.id === doubtId ? { ...d, status: 'Resolved' } : d)),
          };
        }
        return l;
      })
    );
    showToast('Student doubt marked as Resolved', 'success');
  };

  // Mock Tests CRUD
  const saveTest = (testData) => {
    if (testData.id) {
      setTests((prev) => prev.map((t) => (t.id === testData.id ? testData : t)));
      showToast(`Updated Test Series "${testData.title}"`, 'success');
    } else {
      const newTest = {
        ...testData,
        id: `test-${Date.now()}`,
        attemptsCount: 0,
        avgScore: 0,
        passRate: 100,
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0],
      };
      setTests((prev) => [newTest, ...prev]);
      showToast(`Published NTA Mock Test "${testData.title}"`, 'success');
    }
    closeModal();
  };

  const deleteTest = (id) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
    showToast('Deleted NTA Mock Test', 'warning');
  };

  // Bookstore & Inventory CRUD
  const saveBook = (bookData) => {
    let updatedBooks;
    if (bookData.id) {
      updatedBooks = books.map((b) => (b.id === bookData.id ? bookData : b));
      setBooks(updatedBooks);
      showToast(`Updated book "${bookData.title}"`, 'success');
    } else {
      const newBook = {
        ...bookData,
        id: `book-${Date.now()}`,
        rating: 5.0,
        status: bookData.stock > 10 ? 'In Stock' : bookData.stock > 0 ? 'Low Stock' : 'Out of Stock',
      };
      updatedBooks = [newBook, ...books];
      setBooks(updatedBooks);
      showToast(`Added new book "${bookData.title}" to Bookstore & Student Portal`, 'success');
    }
    publishBooksToCatalog(updatedBooks);
    closeModal();
  };

  const deleteBook = (id) => {
    const updatedBooks = books.filter((b) => b.id !== id);
    setBooks(updatedBooks);
    publishBooksToCatalog(updatedBooks);
    showToast('Removed book from catalog', 'warning');
  };

  // Order Fulfillment
  const updateOrderStatus = (orderId, shippingStatus, trackingNumber, courier) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return { ...o, shippingStatus, trackingNumber: trackingNumber || o.trackingNumber, courier: courier || o.courier };
        }
        return o;
      })
    );
    showToast(`Order #${orderId} status updated to ${shippingStatus}`, 'success');
    closeModal();
  };

  // Student Actions
  const toggleStudentVip = (studentId) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const nextStatus = s.vipStatus === 'VIP Active' ? 'Free Plan' : 'VIP Active';
          showToast(`Toggled VIP status for ${s.name} to ${nextStatus}`, 'info');
          return { ...s, vipStatus: nextStatus };
        }
        return s;
      })
    );
  };

  // Broadcast Notification
  const sendBroadcast = (broadcastData) => {
    const newBc = {
      ...broadcastData,
      id: `bc-${Date.now()}`,
      sentDate: new Date().toLocaleString(),
      status: 'Sent',
      readRate: '98.5%',
    };
    setBroadcasts((prev) => [newBc, ...prev]);
    showToast(`Broadcast notification sent to ${broadcastData.targetAudience}!`, 'success');
    closeModal();
  };

  // VIP Plan CRUD
  const saveVipPlan = (planData) => {
    if (planData.id) {
      setVipPlans((prev) => prev.map((p) => (p.id === planData.id ? planData : p)));
      showToast(`Updated subscription tier ${planData.name}`, 'success');
    } else {
      const newPlan = { ...planData, id: `plan-${Date.now()}`, activeSubscribers: 0 };
      setVipPlans((prev) => [...prev, newPlan]);
      showToast(`Added new subscription tier ${planData.name}`, 'success');
    }
  };

  // Modal Handlers
  const openModal = (type, data = null) => {
    setActiveModal(type);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedBatchFilter,
        setSelectedBatchFilter,
        stats,
        setStats,
        courses,
        saveCourse,
        deleteCourse,
        liveClasses,
        saveLiveClass,
        toggleLiveStatus,
        resolveDoubt,
        tests,
        saveTest,
        deleteTest,
        books,
        saveBook,
        deleteBook,
        orders,
        updateOrderStatus,
        students,
        toggleStudentVip,
        broadcasts,
        sendBroadcast,
        vipPlans,
        saveVipPlan,
        activeModal,
        modalData,
        openModal,
        closeModal,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);

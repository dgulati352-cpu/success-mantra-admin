import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import Overview from './components/Overview';
import CoursesManager from './components/CoursesManager';
import LiveStudioManager from './components/LiveStudioManager';
import MockTestManager from './components/MockTestManager';
import BookstoreManager from './components/BookstoreManager';
import VipMembershipManager from './components/VipMembershipManager';
import StudentsManager from './components/StudentsManager';
import BroadcastManager from './components/BroadcastManager';
import SettingsManager from './components/SettingsManager';
import { AllModals } from './components/modals/AllModals';

const AdminDashboardContent = () => {
  const { activeTab } = useAdmin();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'courses' && <CoursesManager />}
          {activeTab === 'liveStudio' && <LiveStudioManager />}
          {activeTab === 'mockTests' && <MockTestManager />}
          {activeTab === 'bookstore' && <BookstoreManager />}
          {activeTab === 'vipMembership' && <VipMembershipManager />}
          {activeTab === 'students' && <StudentsManager />}
          {activeTab === 'broadcast' && <BroadcastManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </main>
      </div>

      {/* Modals & Toast Alerts */}
      <AllModals />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <AdminDashboardContent />
    </AdminProvider>
  );
}

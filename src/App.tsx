import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';
import { CaptchaModal } from './components/CaptchaModal';
import { CreateTaskModal } from './components/CreateTaskModal';

import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { MyJobsPage } from './pages/MyJobsPage';
import { WalletPage } from './pages/WalletPage';
import { ChallengePage } from './pages/ChallengePage';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPanelPage } from './pages/AdminPanelPage';

import { PlatformStats, Task, TestimonialReview, User } from './types';
import { api } from './lib/api';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Platform Data
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [featuredTasks, setFeaturedTasks] = useState<Task[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialReview[]>([]);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [captchaModalOpen, setCaptchaModalOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);

  // Load initial app data
  const loadInitialData = async () => {
    try {
      const storedUserId = localStorage.getItem('wejobs_active_user_id');
      const [uRes, sRes, tRes, revRes] = await Promise.all([
        storedUserId ? api.getCurrentUser(storedUserId) : Promise.resolve(null),
        api.getStats(),
        api.getTasks({ limit: 6, sortBy: 'highest-reward' }),
        api.getTestimonials(),
      ]);
      setCurrentUser(uRes);
      setStats(sRes);
      setFeaturedTasks(tRes.tasks);
      setTestimonials(revRes);
    } catch (err) {
      console.error('Failed to bootstrap app data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const refreshUser = async () => {
    try {
      const storedUserId = localStorage.getItem('wejobs_active_user_id');
      if (storedUserId) {
        const u = await api.getCurrentUser(storedUserId);
        setCurrentUser(u);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    localStorage.setItem('wejobs_active_user_id', user.id);
    setCurrentUser(user);
    setAuthModalOpen(false);
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setCurrentTab('task-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTaskCreated = (newTask: Task) => {
    setSelectedTask(newTask);
    setCurrentTab('task-detail');
    refreshUser();
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('wejobs_active_user_id');
      await api.logout();
      setCurrentUser(null);
      setCurrentTab('home');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col selection:bg-amber-500 selection:text-black font-sans antialiased">
      {/* 1. TOP BAR NAVBAR */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* 2. MAIN CONTENT VIEW ROUTER */}
      <main className="flex-1 w-full pt-16">
        {currentTab === 'home' && (
          <HomePage
            stats={stats}
            featuredTasks={featuredTasks}
            testimonials={testimonials}
            currentUser={currentUser}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectTask={handleSelectTask}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'jobs' && (
          <JobsPage
            currentUser={currentUser}
            onSelectTask={handleSelectTask}
            onOpenCreateTask={() => setCreateTaskModalOpen(true)}
          />
        )}

        {currentTab === 'task-detail' && selectedTask && (
          <TaskDetailPage
            task={selectedTask}
            currentUser={currentUser}
            onBack={() => setCurrentTab('jobs')}
            onTakeSuccess={() => {
              refreshUser();
              setCurrentTab('my-jobs');
            }}
            onOpenAuth={(mode) => handleOpenAuth(mode)}
          />
        )}

        {currentTab === 'my-jobs' && (
          <MyJobsPage
            currentUser={currentUser}
            onSelectTab={setCurrentTab}
            onOpenAuth={(mode) => handleOpenAuth(mode)}
          />
        )}

        {currentTab === 'wallet' && (
          <WalletPage
            currentUser={currentUser}
            onRefreshUser={refreshUser}
            onOpenAuth={(mode) => handleOpenAuth(mode)}
          />
        )}

        {currentTab === 'challenge' && (
          <ChallengePage
            currentUser={currentUser}
            onOpenAuth={(mode) => handleOpenAuth(mode)}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage onSelectTab={setCurrentTab} />
        )}

        {currentTab === 'faq' && <FaqPage />}

        {currentTab === 'help' && (
          <HelpCenterPage
            currentUser={currentUser}
            onOpenAuth={(mode) => handleOpenAuth(mode)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onUpdateUser={(u) => setCurrentUser(u)}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPanelPage
            onSelectTab={setCurrentTab}
            onOpenCreateTask={() => setCreateTaskModalOpen(true)}
          />
        )}
      </main>

      {/* 3. FOOTER */}
      <Footer
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* 4. MOBILE BOTTOM NAVIGATION */}
      <MobileNav
        activeTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
      />

      {/* 5. MODALS & WORKFLOW OVERLAYS */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />

      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onSuccess={(adminUser) => {
          setCurrentUser(adminUser);
          setAdminModalOpen(false);
          setCurrentTab('admin');
        }}
      />

      <CaptchaModal
        isOpen={captchaModalOpen}
        onClose={() => setCaptchaModalOpen(false)}
        onVerified={() => {
          setCaptchaModalOpen(false);
        }}
      />

      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        currentUser={currentUser}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}

export default App;

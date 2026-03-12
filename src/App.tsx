import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';

import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Activities from './pages/Activities';
import Videos from './pages/Videos';
import Events from './pages/Events';
import Blogs from './pages/Blogs';
import Donation from './pages/Donation';
import Inquiry from './pages/Inquiry';
import Contact from './pages/Contact';
import Login from './pages/Login';

// Protected Pages
import Dashboard from './pages/Dashboard';
import CourseLearn from './pages/CourseLearn';
import CourseVideos from './pages/CourseVideos';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminVideos from './pages/admin/AdminVideos';
import AdminStudents from './pages/admin/AdminStudents';
import AdminFaculties from './pages/admin/AdminFaculties';
import AdminActivities from './pages/admin/AdminActivities';
import AdminEvents from './pages/admin/AdminEvents';
import AdminDonations from './pages/admin/AdminDonations';
import AdminContacts from './pages/admin/AdminContacts';
import AdminInquiries from './pages/admin/AdminInquiries';

import AdminContent from './pages/admin/AdminContent';
import AdminPopups from './pages/admin/AdminPopups';

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to={adminOnly ? "/admin" : "/login"} />;
  if (adminOnly && user.role !== 'admin' && user.role !== 'super_admin') return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseLearn />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/donation" element={<Donation />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/courses/:id/videos" element={<ProtectedRoute><CourseVideos /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="popups" element={<AdminPopups />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="faculties" element={<AdminFaculties />} />
            <Route path="activities" element={<AdminActivities />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
        </Routes>
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

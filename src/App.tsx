import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLoader from "@/components/animations/PageLoader";
import PageTransition from "@/components/animations/PageTransition";
import Navbar from "@/components/nav/Navbar";

// Public pages
import Home from "./pages/Home";
import StudentBody from "./pages/StudentBody";
import Events from "./pages/Events";
import Faculty from "./pages/Faculty";
import Join from "./pages/Join";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminEvents from "./pages/admin/AdminEvents";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isLoading && <PageLoader onComplete={() => setIsLoading(false)} />}
        <BrowserRouter>
          <Routes>
            {/* Public routes with Navbar */}
            <Route
              path="/"
              element={
                <>
                  {!isLoading && <Navbar />}
                  <PageTransition>
                    <Home />
                  </PageTransition>
                </>
              }
            />
            <Route
              path="/student-body"
              element={
                <>
                  {!isLoading && <Navbar />}
                  <PageTransition>
                    <StudentBody />
                  </PageTransition>
                </>
              }
            />
            <Route
              path="/events"
              element={
                <>
                  {!isLoading && <Navbar />}
                  <PageTransition>
                    <Events />
                  </PageTransition>
                </>
              }
            />
            <Route
              path="/faculty"
              element={
                <>
                  {!isLoading && <Navbar />}
                  <PageTransition>
                    <Faculty />
                  </PageTransition>
                </>
              }
            />
            <Route
              path="/join"
              element={
                <>
                  {!isLoading && <Navbar />}
                  <PageTransition>
                    <Join />
                  </PageTransition>
                </>
              }
            />

            {/* Admin routes - no Navbar */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/faculty" element={<AdminFaculty />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/events" element={<AdminEvents />} />

            {/* 404 */}
            <Route
              path="*"
              element={
                <>
                  {!isLoading && <Navbar />}
                  <NotFound />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

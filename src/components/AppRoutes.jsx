// src/components/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CustomLoader from "../components/common/CustomLoader";
import EmployeeProfile from "../pages/profile/EmployeeProfile";
import ManageOrganization from "../pages/admin/ManageOrganization";
import EmployeeProfileEdit from "../pages/profile/EmployeeProfileEdit";
import EmployeeProfileView from "../pages/profile/EmployeeProfileView";
// Lazy load components
const Login = lazy(() => import("../pages/auth/Login"));
const MainLayout = lazy(() => import("./layout/MainLayout"));
const NotFoundPage = lazy(() => import("./common/NotFoundPage"));
const ProtectedRoute = lazy(() => import("./auth/ProtectedRoute"));

// Lazy load pages
const Home = lazy(() => import("../pages/home/Home"));
const About = lazy(() => import("../pages/about/About"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Attendance = lazy(() => import("../pages/leave-management/Attendance"));
const Leave = lazy(() => import("../pages/leave-management/Leave"));
const Broadcast = lazy(() => import("../pages/broadcast/Broadcast"));
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      <Suspense fallback={<CustomLoader />}>
        <Routes>
          {/* Root redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Login route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <Login />
            }
          />

          {/* Protected routes with nested layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="home"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path="about"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <About />
                </Suspense>
              }
            />
            <Route
              path="employee"
              element={
                <ProtectedRoute requiredRoles={["HR", "ADMIN"]}>
                  <Suspense fallback={<CustomLoader />}>
                    <Outlet /> 
                  </Suspense>
                </ProtectedRoute>
              }
            >
              <Route path="create" element={<EmployeeProfileEdit />} />
              <Route path="edit/:id" element={<EmployeeProfileEdit />} />
            </Route>
            <Route
              path="employee-profile"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <EmployeeProfileView />
                </Suspense>
              }
            />
            <Route
              path="manage-organization"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <ManageOrganization />
                </Suspense>
              }
            />
            <Route
              path="attendance"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <Attendance />
                </Suspense>
              }
            />
            <Route
              path="leave-management"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <Leave />
                </Suspense>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRoles={["TEAM MANAGER", "HR", "ADMIN"]}>
                  <Suspense fallback={<CustomLoader />}>
                    <Dashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
          path="broadcast"
          element={
            <Suspense fallback={<CustomLoader />}>
              <Broadcast/>
            </Suspense>
          }
        />
          </Route>
          

          {/* Catch-all route for invalid paths */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRoutes;
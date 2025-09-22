// src/components/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CustomLoader from "./layout/CustomLoader";
import EmployeeProfile from "../pages/profile/EmployeeProfile";
import ManageOrganization from "../pages/admin/ManageOrganization";

// Lazy load components
const Login = lazy(() => import("../pages/auth/Login"));
const MainLayout = lazy(() => import("./layout/MainLayout"));
const NotFoundPage = lazy(() => import("./common/NotFoundPage"));
const ProtectedRoute = lazy(() => import("./auth/ProtectedRoute"));

// Lazy load pages
const Home = lazy(() => import("../pages/home/Home"));
const About = lazy(() => import("../pages/about/About"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

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
              path="employee-profile"
              element={
                <Suspense fallback={<CustomLoader />}>
                  <EmployeeProfile />
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
              path="dashboard"
              element={
                <ProtectedRoute requiredRoles={["TEAM MANAGER", "HR", "ADMIN"]}>
                  <Suspense fallback={<CustomLoader />}>
                    <Dashboard />
                  </Suspense>
                </ProtectedRoute>
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

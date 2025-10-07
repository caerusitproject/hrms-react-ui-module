import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../theme/theme";
import {EmployeeAPI} from "../../api/employeeApi";

const Home = () => {
  const { user, isAuthenticated } = useAuth(); // Moved useAuth to top level
  const [currentTime, setCurrentTime] = useState(new Date());
  const reduxAuthState = useSelector((state) => state.auth);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    console.log("Context API State (useAuth):", { isAuthenticated, user });
    console.log("Redux Auth State:", reduxAuthState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    EmployeeAPI.cats().then(res => console.log(res.data));

  }, []); // Empty array to run only on mount

  const statsData = [
    {
      label: "Present",
      value: "22",
      icon: "👥",
      color: theme.colors.success,
      bgColor: `${theme.colors.success}15`,
    },
    {
      label: "Leave",
      value: "6",
      icon: "📅",
      color: theme.colors.warning,
      bgColor: `${theme.colors.warning}15`,
    },
    {
      label: "Next Payday",
      value: "Apr 29",
      icon: "💰",
      color: theme.colors.primary,
      bgColor: `${theme.colors.primary}15`,
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "New company policy has been announced",
      type: "policy",
      time: "2 hours ago",
      icon: "📢",
    },
    {
      id: 2,
      title: "Team meeting scheduled for tomorrow at 10 AM",
      type: "meeting",
      time: "4 hours ago",
      icon: "🤝",
    },
    {
      id: 3,
      title: "System maintenance scheduled for weekend",
      type: "maintenance",
      time: "1 day ago",
      icon: "🔧",
    },
  ];

  return (
    <div>
      {/* Page Heading */}
      <h1
        style={{
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.lg,
          fontSize: "32px",
          fontWeight: "700",
        }}
      >
        Welcome back, {user?.name}! 👋
      </h1>

      {/* Responsive Card Container */}
      <div
        style={{
          display: "grid",
          gap: theme.spacing.lg,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {/* Example Cards */}
        <div
          style={{
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.lg,
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginBottom: theme.spacing.sm }}>Announcements 📢</h3>
          <p style={{ color: theme.colors.text.secondary }}>
            Here you can see the latest updates and news.
          </p>
        </div>

        <div
          style={{
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.lg,
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginBottom: theme.spacing.sm }}>Quick Actions ⚡</h3>
          <p style={{ color: theme.colors.text.secondary }}>
            Access your most used tools in one click.
          </p>
        </div>

        <div
          style={{
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.lg,
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ marginBottom: theme.spacing.sm }}>Tasks ✅</h3>
          <p style={{ color: theme.colors.text.secondary }}>
            Track your current HR tasks and responsibilities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

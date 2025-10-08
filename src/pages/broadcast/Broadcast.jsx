import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { theme } from "../../theme/theme";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Broadcast = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [broadcasts, setBroadcasts] = useState([
    {
      id: 1,
      heading: "New Employee Onboarding",
      body: "Details about onboarding process for new team members.",
      date: "2025-10-08T10:00:00Z", // today
      expanded: false,
    },
    {
      id: 2,
      heading: "Company Picnic Announcement",
      body: "Join us for a fun picnic tomorrow at Central Park!",
      date: "2025-10-06T10:00:00Z", // tomorrow
      expanded: false,
    },
    {
      id: 3,
      heading: "Q3 Performance Review",
      body: "Review of Q3 performance metrics and goal achievements.",
      date: "2025-10-07T10:00:00Z", // yesterday
      expanded: false,
    },
    {
      id: 4,
      heading: "New Benefits Package",
      body: "We're excited to announce our enhanced benefits package!",
      date: "2025-10-02T10:00:00Z", // earlier
      expanded: false,
    },
  ]);

  const [newBroadcast, setNewBroadcast] = useState({ heading: "", body: "" });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewBroadcast({ heading: "", body: "" });
  };

  const handlePublish = () => {
    if (newBroadcast.heading && newBroadcast.body) {
      setBroadcasts([
        {
          id: Date.now(),
          heading: newBroadcast.heading,
          body: newBroadcast.body,
          date: new Date().toISOString(),
          expanded: false,
        },
        ...broadcasts,
      ]);
      handleCloseModal();
    }
  };

  const toggleExpand = (id) => {
    setBroadcasts(
      broadcasts.map((b) => (b.id === id ? { ...b, expanded: !b.expanded } : b))
    );
  };

  const getDateCategory = (dateString) => {
    const today = new Date();
    const broadcastDate = new Date(dateString);

    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (todayStart - broadcastDate.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays === -1) return "tomorrow";
    return "earlier";
  };

  const getIconForCategory = (category) => {
    switch (category) {
      case "today":
        return "⏰"; // megaphone
      case "yesterday":
        return "📃"; // clock
      case "tomorrow":
        return "🗓️"; // calendar
      default:
        return "🗓️"; // mail
    }
  };

  const groupedBroadcasts = broadcasts.reduce((groups, b) => {
    const cat = getDateCategory(b.date);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(b);
    return groups;
  }, {});

  const renderBroadcastCard = (broadcast) => (
    <div
      key={broadcast.id}
      style={{
        backgroundColor: theme.colors.surface,
        padding: window.innerWidth < 640 ? theme.spacing.md : theme.spacing.lg,
        borderRadius: "8px",
        marginBottom: theme.spacing.md,
        transition: "all 0.3s ease",
        border: `1px solid ${theme.colors.background}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: theme.spacing.md,
          cursor: "pointer",
          backgroundColor: broadcast.expanded
            ? theme.colors.background
            : theme.colors.surface,
          padding: "12px 16px",
          borderRadius: broadcast.expanded ? "8px 8px 0 0" : "8px",
          transition: "background-color 0.2s ease",
        }}
        onClick={() => toggleExpand(broadcast.id)}
        onMouseEnter={(e) => {
          if (!broadcast.expanded) {
            e.currentTarget.style.backgroundColor = theme.colors.background;
          }
        }}
        onMouseLeave={(e) => {
          if (!broadcast.expanded) {
            e.currentTarget.style.backgroundColor = theme.colors.surface;
          }
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: window.innerWidth < 640 ? "15px" : "16px",
              fontWeight: 600,
              color: theme.colors.text.primary,
              margin: "0 0 4px 0",
              wordBreak: "break-word",
            }}
          >
            {broadcast.heading}
          </h3>
          <p
            style={{
              color: theme.colors.text.secondary,
              fontSize: window.innerWidth < 640 ? "13px" : "14px",
              margin: 0,
            }}
          >
            {new Date(broadcast.date).toDateString()}
          </p>
        </div>
        <span
          style={{
            color: theme.colors.text.secondary,
            fontSize: "16px",
            fontWeight: 600,
            transition: "transform 0.3s ease",
            transform: broadcast.expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          {broadcast.expanded ? "▲" : "▼"}
        </span>
      </div>
      <div
        style={{
          maxHeight: broadcast.expanded ? "500px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease, padding 0.3s ease",
          padding: broadcast.expanded
            ? window.innerWidth < 640
              ? theme.spacing.md
              : theme.spacing.lg
            : "0 16px",
          borderTop: broadcast.expanded
            ? `1px solid ${theme.colors.background}`
            : "none",
        }}
      >
        <p
          style={{
            color: theme.colors.text.primary,
            fontSize: window.innerWidth < 640 ? "13px" : "14px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {broadcast.body}
        </p>
      </div>
    </div>
  );

  const renderDateSection = (category, title) => {
    const items = groupedBroadcasts[category];
    if (!items) return null;

    return (
      <div style={{ marginBottom: theme.spacing.xl }}>
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: window.innerWidth < 640 ? "16px" : "18px",
            fontWeight: 600,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.md,
          }}
        >
          <span>{getIconForCategory(category)}</span> {title}
        </h2>
        {items.map(renderBroadcastCard)}
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.xl,
          flexWrap: "nowrap", // prevent wrapping
          gap: theme.spacing.md,
        }}
      >
        <h1
          style={{
            fontSize: window.innerWidth < 640 ? "24px" : "32px",
            fontWeight: 700,
            color: theme.colors.text.primary,
            margin: 0,
            flex: 1, // allows heading to shrink if needed
          }}
        >
          Broadcasts
        </h1>
        {(user?.role === "ADMIN" || user?.role === "HR") && (
          <button
            onClick={handleOpenModal}
            style={{
              backgroundColor: theme.colors.primary,
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: window.innerWidth < 640 ? "10px 20px" : "12px 24px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 8px rgba(255,107,53,0.25)",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap", // prevent button text from wrapping
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E55A2B";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(255,107,53,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(255,107,53,0.25)";
            }}
          >
            <span style={{ fontSize: "18px" }}>+</span> New Broadcast
          </button>
        )}
      </div>

      {renderDateSection("today", "Today")}
      {renderDateSection("yesterday", "Yesterday")}
      {renderDateSection("tomorrow", "Tomorrow")}
      {renderDateSection("earlier", "Earlier")}

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={handleCloseModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: window.innerWidth < 640 ? "24px" : "32px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <h2
              style={{
                fontSize: window.innerWidth < 640 ? "20px" : "24px",
                fontWeight: 700,
                color: theme.colors.text.primary,
                marginTop: 0,
                marginBottom: theme.spacing.lg,
              }}
            >
              New Broadcast
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.lg,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Heading of the event
                </label>
                <input
                  type="text"
                  placeholder="Enter broadcast heading"
                  value={newBroadcast.heading}
                  onChange={(e) =>
                    setNewBroadcast({
                      ...newBroadcast,
                      heading: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: `2px solid ${theme.colors.background}`,
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: theme.colors.text.primary,
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.background;
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Describe the event
                </label>
                <textarea
                  placeholder="Enter broadcast details"
                  value={newBroadcast.body}
                  onChange={(e) =>
                    setNewBroadcast({
                      ...newBroadcast,
                      body: e.target.value,
                    })
                  }
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: `2px solid ${theme.colors.background}`,
                    borderRadius: "8px",
                    fontSize: "15px",
                    color: theme.colors.text.primary,
                    outline: "none",
                    transition: "border-color 0.2s",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.background;
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: theme.spacing.md,
                marginTop: theme.spacing.xl,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleCloseModal}
                style={{
                  padding: window.innerWidth < 640 ? "10px 20px" : "12px 24px",
                  border: `2px solid ${theme.colors.text.secondary}`,
                  borderRadius: "8px",
                  backgroundColor: "white",
                  color: theme.colors.text.secondary,
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  flex: window.innerWidth < 640 ? "1" : "0",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.text.primary;
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    theme.colors.text.secondary;
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={!newBroadcast.heading || !newBroadcast.body}
                style={{
                  padding: window.innerWidth < 640 ? "10px 20px" : "12px 24px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor:
                    !newBroadcast.heading || !newBroadcast.body
                      ? "#E0E0E0"
                      : theme.colors.primary,
                  color:
                    !newBroadcast.heading || !newBroadcast.body
                      ? "#9E9E9E"
                      : "white",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor:
                    !newBroadcast.heading || !newBroadcast.body
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.2s",
                  flex: window.innerWidth < 640 ? "1" : "0",
                }}
                onMouseEnter={(e) => {
                  if (newBroadcast.heading && newBroadcast.body) {
                    e.currentTarget.style.backgroundColor = "#E55A2B";
                  }
                }}
                onMouseLeave={(e) => {
                  if (newBroadcast.heading && newBroadcast.body) {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.primary;
                  }
                }}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Broadcast;

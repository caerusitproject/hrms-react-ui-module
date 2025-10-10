"use client";

import { useState, useEffect } from "react";

const Calendar = ({
  year,
  month,
  events = [],
  mode = "leave",
  selectedDates = [],
  confirmedDates = [],
  onSelectionChange,
  isSelecting,
  isSelectionMode = false,
  darkTheme = false,
  today,
  onEdgeHover,
  onDateClick,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  const days = [];
  const padStart = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < padStart; i++) {
    days.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;

    const event = events.find((e) => e.date === dateStr);
    const isPast = date <= today;
    const isConfirmed = confirmedDates.includes(dateStr);

    days.push({
      day: d,
      isWeekend,
      dateStr,
      event,
      isPast,
      isConfirmed,
    });
  }

  const isSelected = (dateStr) => {
    if (!dateStr) return false;
    return selectedDates.includes(dateStr);
  };

  const handleClick = (dateStr, isPast) => {
    if (isPast && mode === "leave") return;
    if (onSelectionChange && isSelectionMode) {
      onSelectionChange(dateStr, "click");
    } else if (mode === "attendance" && onDateClick) {
      onDateClick(dateStr);
    }
  };

  const handleMouseEnter = (dateStr, isPast, dayNum) => {
    if (isPast && mode === "leave") return;
    if (onSelectionChange && isSelectionMode && isSelecting) {
      onSelectionChange(dateStr, "hover");
      if (dayNum === daysInMonth) {
        onEdgeHover && onEdgeHover("next", dayNum);
      }
    }
  };

  const handleTouchStart = (dateStr, isPast) => {
    if (isPast && mode === "leave") return;
    setIsTouching(true);
    if (onSelectionChange && isSelectionMode) {
      onSelectionChange(dateStr, "click");
    } else if (mode === "attendance" && onDateClick) {
      onDateClick(dateStr);
    }
  };

  const handleTouchMove = (e) => {
    if (!isTouching) return;
    e.preventDefault();

    const touch = e.touches && e.touches[0];
    if (!touch) return;

    const rawEl = document.elementFromPoint(touch.clientX, touch.clientY);
    let cellEl = null;
    if (rawEl) {
      if (rawEl.closest) {
        cellEl = rawEl.closest("[data-datestr]");
      } else {
        let node = rawEl;
        while (
          node &&
          node !== document.body &&
          !(node.dataset && node.dataset.datestr)
        ) {
          node = node.parentElement;
        }
        if (node && node.dataset && node.dataset.datestr) {
          cellEl = node;
        }
      }
    }

    if (cellEl) {
      const targetDateStr = cellEl.dataset.datestr;
      const targetIsPast = cellEl.dataset.ispast === "true";
      const targetDayNum = Number.parseInt(cellEl.dataset.daynum, 10);

      if (!targetIsPast && onSelectionChange && isSelectionMode) {
        onSelectionChange(targetDateStr, "hover");
        if (targetDayNum === daysInMonth) {
          onEdgeHover && onEdgeHover("next", targetDayNum);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
  };

  const getCellStyle = (dayInfo) => {
    if (!dayInfo) return { background: "transparent" };

    const isSelectedDay = isSelected(dayInfo.dateStr);
    const bgColor = darkTheme ? "#1a1a1a" : "#fff";
    const textColor = darkTheme ? "#fff" : "#333";
    const weekendBg = darkTheme ? "#282828" : "#f0f0f0";
    const weekendColor = darkTheme ? "#aaa" : "#777";

    let style = {
      background: bgColor,
      color: textColor,
      border: "1px solid #e0e0e0",
    };

    if (mode === "leave") {
      if (dayInfo.event?.type === "Holiday") {
        style = {
          background: "#ff9b71",
          color: "#fff",
          border: "1px solid #ff8c69",
        };
      } else if (
        dayInfo.event?.type === "Leave" &&
        dayInfo.event?.label === "Absent"
      ) {
        style = {
          background: "#ffe5e5",
          color: "#d32f2f",
          border: "1px solid #ffcccc",
        };
      } else if (dayInfo.event?.type === "Leave") {
        style = {
          background: "#ffccdf",
          color: "#c2185b",
          border: "1px solid #ffb3d1",
        };
      } else if (dayInfo.isConfirmed) {
        style = {
          background: "#ffccdf",
          color: "#c2185b",
          border: "1px solid #ffb3d1",
        };
      } else if (isSelectedDay) {
        style = {
          background: "#007bff",
          color: "#fff",
          border: "1px solid #0056b3",
        };
      } else if (dayInfo.isWeekend) {
        style = {
          background: weekendBg,
          color: weekendColor,
          border: "1px solid #ddd",
        };
      }
    } else if (mode === "attendance") {
      if (dayInfo.isWeekend) {
        style = {
          background: weekendBg,
          color: weekendColor,
          border: "1px solid #ddd",
        };
      } else if (dayInfo.event?.type === "Absent") {
        style = {
          background: "#d47272ff",
          color: "#fff",
          border: "1px solid #b71c1c",
        };
      } else if (dayInfo.event?.type === "Present") {
        style = {
          background: "#66c97dff",
          color: "#fff",
          border: "1px solid #1e7e34",
        };
      }
    }

    // Highlight today
    if (
      dayInfo?.dateStr ===
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(today.getDate()).padStart(2, "0")}`
    ) {
      style.border = "2px solid #000";
    }

    return style;
  };

  return (
    <div
      style={{
        background: darkTheme ? "#1a1a1a" : "#fff",
        padding: isMobile ? "15px 8px" : "60px",
        borderRadius: isMobile ? "8px" : "12px",
        boxShadow: isMobile
          ? "0 2px 8px rgba(0, 0, 0, 0.1)"
          : "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        margin: "0 auto",
        height: isMobile ? "auto" : "80vh",
        minHeight: isMobile ? "450px" : "auto",
        position: "relative",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          color: darkTheme ? "#fff" : "#333",
          marginBottom: isMobile ? "12px" : "20px",
          fontSize: isMobile ? "16px" : "22px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: isMobile ? "0.5px" : "1px",
        }}
      >
        {monthName} {year}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: isMobile ? "1px" : "2px",
          border: "1px solid #e0e0e0",
          borderRadius: isMobile ? "6px" : "8px",
          height: isMobile ? "auto" : "calc(100% - 60px)",
          overflow: "hidden",
        }}
        onTouchMove={isMobile ? handleTouchMove : null}
        onTouchEnd={isMobile ? handleTouchEnd : null}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((header) => (
          <div
            key={header}
            style={{
              background: darkTheme ? "#2a2a2a" : "#f8f9fa",
              fontWeight: "600",
              color: darkTheme ? "#bbb" : "#444",
              textAlign: "center",
              padding: isMobile ? "6px 2px" : "10px",
              fontSize: isMobile ? "10px" : "14px",
              borderBottom: "1px solid #ddd",
              textTransform: "uppercase",
            }}
          >
            {isMobile ? header.slice(0, 1) : header}
          </div>
        ))}

        {days.map((dayInfo, index) => {
          const cellStyle = getCellStyle(dayInfo);

          return (
            <div
              key={index}
              data-datestr={dayInfo?.dateStr}
              data-ispast={dayInfo?.isPast}
              data-daynum={dayInfo?.day}
              style={{
                minHeight: isMobile ? "45px" : "60px",
                padding: isMobile ? "4px" : "8px",
                borderRadius: "0",
                cursor:
                  dayInfo && mode === "attendance" ? "pointer" : "default",
                transition: "background 0.2s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                position: "relative",
                touchAction: isMobile && dayInfo ? "none" : "auto",
                ...cellStyle,
              }}
              onMouseEnter={(e) => {
                const tooltip = e.currentTarget.querySelector(".tooltip");
                if (tooltip) tooltip.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                const tooltip = e.currentTarget.querySelector(".tooltip");
                if (tooltip) tooltip.style.opacity = 0;
              }}
            >
              {dayInfo && (
                <>
                  <div
                    style={{
                      fontSize: isMobile ? "12px" : "16px",
                      fontWeight: "500",
                      marginBottom: isMobile ? "2px" : "4px",
                      color: cellStyle.color,
                    }}
                  >
                    {dayInfo.day}
                  </div>

                  {mode === "attendance" && dayInfo.event && (
                    <>
                      <div
                        style={{
                          fontSize: isMobile ? "9px" : "11px",
                          padding: isMobile ? "1px 2px" : "2px 4px",
                          borderRadius: "4px",
                          color: cellStyle.color,
                          textAlign: "left",
                          width: "100%",
                        }}
                      >
                        {dayInfo.event.label}
                      </div>

                      {/* Tooltip */}
                      <div
                        className="tooltip"
                        style={{
                          position: "absolute",
                          background: "#333",
                          color: "#fff",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                          zIndex: 10,
                          bottom: "100%",
                          left: "50%",
                          transform: "translateX(-50%) translateY(-5px)",
                          opacity: 0,
                          pointerEvents: "none",
                          transition: "opacity 0.2s ease",
                        }}
                      >
                        {`Date: ${dayInfo.dateStr} | Status: ${dayInfo.event.type} | Hours: ${dayInfo.event.label}`}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

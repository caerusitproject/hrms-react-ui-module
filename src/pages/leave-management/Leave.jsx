import React, { useState } from "react";
import Calendar from "../../components/common/Calendar";
import { theme } from "../../theme/theme";

const Leave = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1));
  const [selectedDates, setSelectedDates] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showNextMonthButton, setShowNextMonthButton] = useState(false);
  const [lastDayOfMonth, setLastDayOfMonth] = useState(null);
  const [confirmedLeaves, setConfirmedLeaves] = useState([]);
  const today = new Date(2025, 9, 3);

  // Dummy leave/holiday dataset
  const leaveData = [
    { date: "2025-10-05", type: "Holiday", label: "Client Call Holiday" },
    { date: "2025-10-06", type: "Leave", label: "Absent" },
    { date: "2025-10-12", type: "Leave", label: "Board Meeting Leave" },
    { date: "2025-10-18", type: "Holiday", label: "Quarterly Review Holiday" },
    { date: "2025-10-20", type: "Leave", label: "Absent" },
    { date: "2025-10-25", type: "Holiday", label: "All Hands Holiday" },
    { date: "2025-10-28", type: "Leave", label: "Performance Review Leave" },
    { date: "2025-11-05", type: "Holiday", label: "Team Event" },
    { date: "2025-11-15", type: "Holiday", label: "Company Holiday" },
  ];

  // ✅ Range selector with weekends & holidays skipped
  const getDatesInRange = (start, end, events) => {
    if (!start || !end) return [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    const minDate = new Date(Math.min(startDate, endDate));
    const maxDate = new Date(Math.max(startDate, endDate));

    const dates = [];
    let current = new Date(minDate);

    while (current <= maxDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const event = events.find((e) => e.date === dateStr);
      const dayOfWeek = current.getDay(); // 0=Sunday, 6=Saturday

      // ✅ Allow only Mon–Fri, skip Sat/Sun + holidays
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && (!event || event.type !== "Holiday")) {
        dates.push(dateStr);
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // ✅ Click/drag handler
  const handleSelectionChange = (dateStr, action) => {
    const clickedDay = new Date(dateStr).getDay();
    const isHoliday = leaveData.some((e) => e.date === dateStr && e.type === "Holiday");

    // Skip weekends & holidays instantly
    if (clickedDay === 0 || clickedDay === 6 || isHoliday) return;

    if (action === "click") {
      if (!isSelecting) {
        setIsSelecting(true);
        setDragStart(dateStr);
        setDragEnd(dateStr);
        setSelectedDates([dateStr]);

        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const date = new Date(dateStr);
        setShowNextMonthButton(date.getDate() === lastDay);
      } else {
        setDragEnd(dateStr);
        const dates = getDatesInRange(dragStart, dateStr, leaveData);
        setSelectedDates(dates);
        setIsSelecting(false);
        setShowNextMonthButton(false);
      }
    } else if (action === "hover" && isSelecting) {
      setDragEnd(dateStr);
      const dates = getDatesInRange(dragStart, dateStr, leaveData);
      setSelectedDates(dates);

      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const date = new Date(dateStr);
      setShowNextMonthButton(date.getDate() === lastDay);
      setLastDayOfMonth(date.getDate() === lastDay ? dateStr : null);
    }
  };

  const handleEdgeHover = (direction, dayNum) => {
    if (isSelecting) {
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      setShowNextMonthButton(direction === "next" && dayNum === lastDay);
    }
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);

    if (isSelecting) {
      const newYear = newDate.getFullYear();
      const newMonth = newDate.getMonth();
      const newDragEndDate = direction > 0
        ? new Date(newYear, newMonth, 1)
        : new Date(newYear, newMonth + 1, 0);

      const newDragEndStr = `${newDragEndDate.getFullYear()}-${String(newDragEndDate.getMonth() + 1).padStart(2, "0")}-${String(newDragEndDate.getDate()).padStart(2, "0")}`;
      setDragEnd(newDragEndStr);
      const dates = getDatesInRange(dragStart, newDragEndStr, leaveData);
      setSelectedDates(dates);
    }
    setShowNextMonthButton(false);
  };

  const handleApplyLeave = () => {
    if (selectedDates.length > 0) {
      const newLeave = {
        id: Date.now(),
        dates: [...selectedDates].sort(),
        appliedOn: new Date().toLocaleDateString(),
      };
      setConfirmedLeaves([...confirmedLeaves, newLeave]);
      setSelectedDates([]);
      setIsSelectionMode(false);
      setIsSelecting(false);
      setDragStart(null);
      setDragEnd(null);
      setShowNextMonthButton(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedDates([]);
    setIsSelectionMode(false);
    setIsSelecting(false);
    setDragStart(null);
    setDragEnd(null);
    setShowNextMonthButton(false);
  };

  const removeLeaveDate = (leaveId, dateToRemove) => {
    setConfirmedLeaves(confirmedLeaves.map(leave => {
      if (leave.id === leaveId) {
        const updatedDates = leave.dates.filter(date => date !== dateToRemove);
        return { ...leave, dates: updatedDates };
      }
      return leave;
    }).filter(leave => leave.dates.length > 0));
  };

  const formatDateRange = (dates) => {
    if (dates.length === 0) return "";
    return dates.length === 1 ? dates[0] : `${dates[0]} to ${dates[dates.length - 1]}`;
  };

  // Flatten confirmed leaves for calendar styling
  const allConfirmedDates = confirmedLeaves.flatMap((leave) => leave.dates);

  return (
    <div
      style={{
        //padding: "20px",
        width: "100%",
        maxWidth: "95%",
        //margin: "0 auto",
        //maxHeight: "100%",
       // height: "100vh",
        boxSizing: "border-box",
        //backgroundColor: theme.palette.background.default,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Nav */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => handleMonthChange(-1)}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.3)")}
            onMouseOut={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.2)")}
          >
            ←
          </button>
          <button
            onClick={() => handleMonthChange(1)}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.3)")}
            onMouseOut={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.2)")}
          >
            →
          </button>
        </div>

        <h2 style={{ color: "#fff", margin: 0, fontSize: "24px", fontWeight: "600" }}>
          {isSelectionMode ? "Select Leave Dates" : "Leave Calendar"}
        </h2>

        {isSelectionMode ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleCancelSelection}
              style={{
                background: "#dc3545",
                border: "none",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#c82333")}
              onMouseOut={(e) => (e.target.style.background = "#dc3545")}
            >
              Cancel
            </button>
            <button
              onClick={handleApplyLeave}
              disabled={selectedDates.length === 0}
              style={{
                background: selectedDates.length > 0 ? "#28a745" : "rgba(255, 255, 255, 0.3)",
                border: "none",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: selectedDates.length > 0 ? "pointer" : "not-allowed",
                fontWeight: "500",
                fontSize: "14px",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.background = selectedDates.length > 0 ? "#218838" : "rgba(255, 255, 255, 0.3)")}
              onMouseOut={(e) => (e.target.style.background = selectedDates.length > 0 ? "#28a745" : "rgba(255, 255, 255, 0.3)")}
            >
              Confirm Leave ({selectedDates.length})
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsSelectionMode(true)}
            style={{
              background: "#28a745",
              border: "none",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#218838")}
            onMouseOut={(e) => (e.target.style.background = "#28a745")}
          >
            Apply for Leave
          </button>
        )}
      </div>

      {/* Calendar */}
      <div style={{ position: "relative" }}>
        <Calendar
          year={currentDate.getFullYear()}
          month={currentDate.getMonth()}
          events={leaveData}
          mode="leave"
          selectedDates={selectedDates}
          confirmedDates={allConfirmedDates} // Pass confirmed dates to Calendar
          onSelectionChange={handleSelectionChange}
          isSelecting={isSelecting}
          dragStart={dragStart}
          dragEnd={dragEnd}
          isSelectionMode={isSelectionMode}
          darkTheme={false}
          today={today}
          onEdgeHover={handleEdgeHover}
        />

        {showNextMonthButton && (
          <button
            onClick={() => handleMonthChange(1)}
            style={{
              position: "absolute",
              top: `${41 + 62 + Math.ceil((new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() + new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() - 1) / 7) * 60 - 15}px`,
              left: "calc(100% + 10px)",
              background: "#e69346ff",
              border: "none",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#885f21ff")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#885f21ff")}
          >
            →
          </button>
        )}
      </div>

      {/* Applied Leaves List */}
      {confirmedLeaves.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            style={{
              color: "#333",
              marginBottom: "20px",
              fontSize: "20px",
              fontWeight: "600",
              borderBottom: "2px solid #667eea",
              paddingBottom: "10px",
            }}
          >
            Applied Leaves
          </h3>

          {confirmedLeaves.flatMap((leave) =>
            leave.dates.map((date, index) => (
              <div
                key={`${leave.id}-${index}`}
                style={{
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#a74e57ff",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#fff",
                      marginBottom: "8px",
                    }}
                  >
                    {date}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#fff",
                      marginBottom: "8px",
                    }}
                  >
                    Applied on: {leave.appliedOn}
                  </div>
                </div>

                <button
                  onClick={() => removeLeaveDate(leave.id, date)}
                  style={{
                    background: "#28a745",
                    border: "none",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#218838")}
                  onMouseOut={(e) => (e.target.style.background = "#28a745")}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Leave;
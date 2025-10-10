import React, { useState, useEffect } from "react";
import Calendar from "../../components/common/Calendar";
import { theme } from "../../theme/theme";
import { AttendanceAPI } from "../../api/attendanceApi"; // Adjust path as needed

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = new Date();
  const empCode = "EMP001"; // Hardcoded for now; can be dynamic via props or context

  // Fetch attendance data when month or year changes
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const month = currentDate.getMonth() +1; // 0-based month
        const year = currentDate.getFullYear();
        const response = await AttendanceAPI.getAttendanceByEmployee(empCode, month, year);
        if (response.success) {
          setAttendanceData(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch attendance data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [currentDate]); // Re-run when currentDate changes

  // Calculate hours from checkIn and checkOut times
  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "Absent";
    const start = new Date(`1970-01-01T${checkIn}Z`);
    const end = new Date(`1970-01-01T${checkOut}Z`);
    const diffMs = end - start;
    if (diffMs <= 0) return "Absent";
    const hours = diffMs / (1000 * 60 * 60);
    return `${hours.toFixed(1)}hrs`;
  };

  // Transform API data to match Calendar component's events structure
  const events = attendanceData.map((item) => ({
    date: item.date,
    type: item.status === "Absent" ? "Absent" : "Present",
    label: item.status === "Absent" ? "Absent" : calculateHours(item.checkIn, item.checkOut),
  }));

  // Calculate total hours, present days, and absent days
  const totalHours = attendanceData
    .filter((a) => a.status !== "Absent")
    .reduce((sum, a) => {
      const hours = calculateHours(a.checkIn, a.checkOut);
      return sum + (hours !== "Absent" ? parseFloat(hours) : 0);
    }, 0);

  const absentDays = attendanceData.filter((a) => a.status === "Absent").length;
  const presentDays = attendanceData.length - absentDays;

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // const handleDateClick = (dateStr) => {
  //   const data = attendanceData.find((a) => a.date === dateStr);
  //   if (data) {
  //     const hours = calculateHours(data.checkIn, data.checkOut);
  //     alert(`Date: ${dateStr}\nStatus: ${data.status}\nHours: ${hours}`);
  //   }
  // };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "95%",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: theme.colors.success,
          boxShadow: theme.shadows.medium,
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => handleMonthChange(-1)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ←
            </button>
            <button
              onClick={() => handleMonthChange(1)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              →
            </button>
          </div>

          <h2 style={{ color: "#fff", margin: 0 }}>Attendance Calendar</h2>
          <div style={{ width: "100px" }}></div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>{totalHours.toFixed(1)}</div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>Total Hours</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>{presentDays}</div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>Days Present</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>{absentDays}</div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>Days Absent</div>
          </div>
        </div>
      </div>

      <Calendar
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        events={events}
        mode="attendance"
        //onDateClick={handleDateClick}
        darkTheme={false}
        today={today}
      />
    </div>
  );
};

export default Attendance;
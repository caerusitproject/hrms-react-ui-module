import React, { useState, useEffect } from 'react';
import Calendar from '../../components/common/Calendar';
import { theme } from '../../theme/theme';

// Attendance Calendar Component
const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // August 2025
  const today = new Date(2025, 9, 3); // Today's date as per system

  const attendanceData = [
    { "date": "2025-08-01", "hours": "8.6hrs" },
    { "date": "2025-08-04", "hours": "8.1hrs" },
    { "date": "2025-08-05", "hours": "Absent" },
    { "date": "2025-08-06", "hours": "8.6hrs" },
    { "date": "2025-08-07", "hours": "8.2hrs" },
    { "date": "2025-08-08", "hours": "7.2hrs" },
    { "date": "2025-08-11", "hours": "7.6hrs" },
    { "date": "2025-08-12", "hours": "8.9hrs" },
    { "date": "2025-08-13", "hours": "7.3hrs" },
    { "date": "2025-08-14", "hours": "7.9hrs" },
    { "date": "2025-08-15", "hours": "8.6hrs" },
    { "date": "2025-08-19", "hours": "Absent" },
    { "date": "2025-08-20", "hours": "8.7hrs" },
    { "date": "2025-08-21", "hours": "8.8hrs" },
    { "date": "2025-08-22", "hours": "8.2hrs" },
    { "date": "2025-08-25", "hours": "8.7hrs" },
    { "date": "2025-08-26", "hours": "7.9hrs" },
    { "date": "2025-08-27", "hours": "8.2hrs" },
    { "date": "2025-08-28", "hours": "7.5hrs" },
    { "date": "2025-08-29", "hours": "7.7hrs" }
  ];

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (dateStr) => {
    const data = attendanceData.find(a => a.date === dateStr);
    if (data) {
      alert(`Date: ${dateStr}\nHours: ${data.hours}`);
    }
  };

  const totalHours = attendanceData
    .filter(a => a.hours !== 'Absent')
    .reduce((sum, a) => sum + (a.hours.match(/\d+\.\d+/) ? parseFloat(a.hours) : 0), 0);

  const absentDays = attendanceData.filter(a => a.hours === 'Absent').length;
  const presentDays = attendanceData.length - absentDays;

  // Transform attendanceData to match the events structure expected by Calendar.jsx
  const events = attendanceData.map(item => ({
    date: item.date,
    type: item.hours === 'Absent' ? 'Absent' : 'Present',
    label: item.hours
  }));

  return (
    <div style={{
        //padding: "20px",
        width: "100%",
        maxWidth: "95%",
        //margin: "0 auto",
        //maxHeight: "100%",
       // height: "100vh",
        boxSizing: "border-box",
        //backgroundColor: theme.palette.background.default,
        fontFamily: "Arial, sans-serif", }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => handleMonthChange(-1)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ←
            </button>
            <button
              onClick={() => handleMonthChange(1)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              →
            </button>
          </div>
          
          <h2 style={{ color: '#fff', margin: 0 }}>Attendance Calendar</h2>
          <div style={{ width: '100px' }}></div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center',
          color: '#fff'
        }}>
          {/* <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{totalHours.toFixed(1)}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Hours</div>
          </div> */}
          {/* <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{presentDays}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Days Present</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>{absentDays}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Days Absent</div>
          </div> */}
        </div>
      </div>

      <Calendar
        year={currentDate.getFullYear()}
        month={currentDate.getMonth()}
        events={events}
        mode="attendance"
        onDateClick={handleDateClick}
        darkTheme={false}
        today={today}
      />
    </div>
  );
};

export default Attendance;
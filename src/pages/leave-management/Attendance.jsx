// Attendance.js - Attendance Component using Calendar
import React, { useState, useEffect } from 'react';
import Calendar from '../../components/common/Calendar';
import { theme } from '../../theme/theme';

const Attendance = () => {
  const [workingHours, setWorkingHours] = useState({});

  useEffect(() => {
    // Dummy API call for working hours
    const mockWorkingHours = {};
    for (let d = 1; d <= 30; d++) {
      const date = new Date(2025, 8, d);
      const weekday = date.getDay();
      if (weekday !== 0 && weekday !== 6) { // Not weekend
        mockWorkingHours[d] = Math.floor(Math.random() * 3) + 8; // 8-10 hours
      }
    }
    setWorkingHours(mockWorkingHours);
  }, []);

  const cellRenderer = (day) => {
    const hours = workingHours[day];
    return hours ? <div style={{ color: theme.colors.success, fontSize: '12px' }}>{`${hours} hrs`}</div> : null;
  };

  return (
    <div>
      <h1 style={{ color: theme.colors.text.primary , paddingTop: "20px"}}>Attendance Calendar</h1>
      <Calendar year={2025} month={8} cellRenderer={cellRenderer} />
    </div>
  );
};

export default Attendance;
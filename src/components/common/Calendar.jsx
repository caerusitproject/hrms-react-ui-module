// Calendar.js - Reusable Calendar Component
import React from 'react';
import { theme } from '../../theme/theme'; // Assuming theme.js is in the same directory

const Calendar = ({ year, month, cellRenderer, onCellMouseDown, onCellMouseEnter, onCellMouseUp, selectedStart, selectedEnd }) => {
  // Fixed for September 2025 (month=8 in JS Date)
  const daysInMonth = 30;
  const firstDay = new Date(year, month, 1).getDay(); // 1 = Monday (Sun=0, Mon=1, ..., Sat=6)
  
  // Generate days array
  const days = [];
  // Padding for starting day - if week starts on Sunday, but here header is Mo-Su, so adjust
  // Assuming header: Mo Tu We Th Fr Sa Su, so firstDay 1 (Mon) means start at index 0
  let padStart = firstDay - 1; // If Mon=1, padStart=0 (since Mo is first)
  if (padStart < 0) padStart = 6; // For Sunday
  
  for (let i = 0; i < padStart; i++) {
    days.push(null);
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6; // Sun or Sat
    days.push({ day: d, isWeekend });
  }
  
  // Generate weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  
  const isSelected = (day) => {
    if (!selectedStart || !selectedEnd || !day) return false;
    return day >= selectedStart && day <= selectedEnd;
  };

  return (
    <div style={{ background: theme.colors.background, padding: theme.spacing.md, borderRadius: theme.borderRadius.medium, boxShadow: theme.shadows.medium }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{'‹'}</button>
        <h2 style={{ color: theme.colors.text.primary }}>{`${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`}</h2>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{'›'}</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: theme.spacing.xs, textAlign: 'center' }}>
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((header) => (
          <div key={header} style={{ fontWeight: 'bold', color: theme.colors.text.secondary }}>{header}</div>
        ))}
        {days.map((dayInfo, index) => (
          <div
            key={index}
            onMouseDown={dayInfo?.day ? () => onCellMouseDown?.(dayInfo.day) : null}
            onMouseEnter={dayInfo?.day ? () => onCellMouseEnter?.(dayInfo.day) : null}
            onMouseUp={dayInfo?.day ? () => onCellMouseUp?.(dayInfo.day) : null}
            style={{
              padding: theme.spacing.sm,
              background: isSelected(dayInfo?.day) ? theme.colors.primaryLight : theme.colors.surface,
              borderRadius: theme.borderRadius.small,
              color: dayInfo?.isWeekend ? theme.colors.mediumGray : theme.colors.text.primary,
              opacity: dayInfo?.isWeekend ? 0.5 : 1,
              cursor: dayInfo?.day ? 'pointer' : 'default',
              minHeight: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: isSelected(dayInfo?.day) ? theme.shadows.small : 'none',
            }}
          >
            {dayInfo?.day && (
              <>
                <div>{dayInfo.day}</div>
                {cellRenderer?.(dayInfo.day)}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
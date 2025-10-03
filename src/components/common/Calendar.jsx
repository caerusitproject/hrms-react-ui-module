import React, { useState, useRef, useEffect } from 'react';

// Reusable Calendar Component
const Calendar = ({ 
  year, 
  month, 
  events = [], 
  mode = 'leave',
  selectedDates = [],
  confirmedDates = [],
  onSelectionChange,
  isSelecting,
  isSelectionMode = false,
  darkTheme = false,
  today,
  onEdgeHover
}) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
  
  const days = [];
  const padStart = firstDay === 0 ? 6 : firstDay - 1;
  
  for (let i = 0; i < padStart; i++) {
    days.push(null);
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const weekday = date.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    
    const event = events.find(e => e.date === dateStr);
    const isPast = date <= today;
    const isConfirmed = confirmedDates.includes(dateStr);
    
    days.push({ 
      day: d, 
      isWeekend, 
      dateStr,
      event,
      isPast,
      isConfirmed
    });
  }

  const isSelected = (dateStr) => {
    if (!dateStr) return false;
    return selectedDates.includes(dateStr);
  };

  const handleClick = (dateStr, isPast) => {
    if (isPast) return;
    if (onSelectionChange && isSelectionMode) {
      onSelectionChange(dateStr, 'click');
    }
  };

  const handleMouseEnter = (dateStr, isPast, dayNum) => {
    if (isPast) return;
    if (onSelectionChange && isSelectionMode && isSelecting) {
      onSelectionChange(dateStr, 'hover');
      if (dayNum === daysInMonth) {
        onEdgeHover && onEdgeHover('next', dayNum);
      }
    }
  };

  const getCellStyle = (dayInfo) => {
    if (!dayInfo) return { background: 'transparent' };
    
    const isSelectedDay = isSelected(dayInfo.dateStr);
    const bgColor = darkTheme ? '#1a1a1a' : '#fff';
    const textColor = darkTheme ? '#fff' : '#333';
    const weekendBg = darkTheme ? '#282828' : '#f0f0f0';
    const weekendColor = darkTheme ? '#aaa' : '#777';
    const pastBg = '#f8f9fa';
    const pastColor = '#999';
    
    let style = { background: bgColor, color: textColor, border: '1px solid #e0e0e0' };
    
    if (dayInfo.isPast) {
      style = { background: pastBg, color: pastColor, border: '1px solid #eee', opacity: 0.6 };
    } else if (mode === 'leave') {
      if (dayInfo.event?.type === 'Holiday') {
        style = { background: '#ff9b71', color: '#fff', border: '1px solid #ff8c69' };
      } else if (dayInfo.event?.type === 'Leave' && dayInfo.event?.label === 'Absent') {
        style = { background: '#ffe5e5', color: '#d32f2f', border: '1px solid #ffcccc' };
      } else if (dayInfo.event?.type === 'Leave') {
        style = { background: '#ffccdf', color: '#c2185b', border: '1px solid #ffb3d1' };
      } else if (dayInfo.isConfirmed) {
        style = { background: '#ffccdf', color: '#c2185b', border: '1px solid #ffb3d1' };
      } else if (isSelectedDay) {
        style = { background: '#007bff', color: '#fff', border: '1px solid #0056b3' };
      } else if (dayInfo.isWeekend) {
        style = { background: weekendBg, color: weekendColor, border: '1px solid #ddd' };
      }
    }
    
    return style;
  };

  return (
    <div style={{ 
      background: darkTheme ? '#1a1a1a' : '#fff', 
      padding: '60px', 
      borderRadius: '12px', 
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '100%',
      //maxWidth: '3200px',
     margin: '0 auto',
     height: '80vh',
      position: 'relative'
    }}>
      <h3 style={{ 
        textAlign: 'center', 
        color: darkTheme ? '#fff' : '#333', 
        marginBottom: '20px',
        fontSize: '22px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {monthName} {year}
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '2px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        height: 'calc(100% - 60px)',
        overflow: 'hidden'
      }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((header) => (
          <div key={header} style={{ 
            background: darkTheme ? '#2a2a2a' : '#f8f9fa',
            fontWeight: '600', 
            color: darkTheme ? '#bbb' : '#444',
            textAlign: 'center',
            padding: '10px',
            fontSize: '14px',
            borderBottom: '1px solid #ddd',
            textTransform: 'uppercase'
          }}>
            {header}
          </div>
        ))}
        
        {days.map((dayInfo, index) => {
          const cellStyle = getCellStyle(dayInfo);
          
          return (
            <div
              key={index}
              onClick={dayInfo && !dayInfo.isPast ? () => handleClick(dayInfo.dateStr, dayInfo.isPast) : null}
              onMouseEnter={dayInfo && !dayInfo.isPast ? () => handleMouseEnter(dayInfo.dateStr, dayInfo.isPast, dayInfo.day) : null}
              style={{
                minHeight: '60px',
                padding: '8px',
                borderRadius: '0',
                cursor: dayInfo && isSelectionMode && !dayInfo.isPast ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                ...cellStyle
              }}
            >
              {dayInfo && (
                <>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '500',
                    marginBottom: '4px',
                    color: cellStyle.color
                  }}>
                    {dayInfo.day}
                  </div>
                  
                  {mode === 'leave' && dayInfo.event && (
                    <div style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.7)',
                      color: '#333',
                      textAlign: 'center'
                    }}>
                      {dayInfo.event.label}
                    </div>
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
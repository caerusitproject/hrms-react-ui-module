import React from 'react';

const Calendar = ({ year = 2025, month = 8, cellRenderer, onCellMouseDown, onCellMouseEnter, onCellMouseUp, selectedStart, selectedEnd }) => {
  // Fixed for September 2025 (month=8 in JS Date, 0-indexed)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Generate days array with padding
  const days = [];
  let padStart = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Mo-Su order (Mo=0)
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
    <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{'‹'}</button>
        <h2 style={{ color: '#333' }}>{`${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`}</h2>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>{'›'}</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((header) => (
          <div key={header} style={{ fontWeight: 'bold', color: '#666' }}>{header}</div>
        ))}
        {days.map((dayInfo, index) => (
          <div
            key={index}
            onMouseDown={dayInfo?.day ? () => onCellMouseDown?.(dayInfo.day) : null}
            onMouseEnter={dayInfo?.day ? () => onCellMouseEnter?.(dayInfo.day) : null}
            onMouseUp={dayInfo?.day ? () => onCellMouseUp?.(dayInfo.day) : null}
            style={{
              padding: '8px',
              background: isSelected(dayInfo?.day) ? '#0078d4' : '#fff',
              borderRadius: '4px',
              color: dayInfo?.isWeekend ? '#999' : '#333',
              opacity: dayInfo?.isWeekend ? 0.5 : 1,
              cursor: dayInfo?.day ? 'pointer' : 'default',
              minHeight: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: isSelected(dayInfo?.day) ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {dayInfo?.day && (
              <>
                <div style={{ color: isSelected(dayInfo.day) ? '#fff' : (dayInfo.isWeekend ? '#999' : '#333') }}>{dayInfo.day}</div>
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
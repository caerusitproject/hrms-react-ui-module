// src/pages/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme/theme';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    // Simulate loading attendance data
    const generateAttendanceData = () => {
      const days = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        days.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          status: Math.random() > 0.1 ? 'present' : Math.random() > 0.5 ? 'late' : 'absent',
          hours: Math.random() > 0.1 ? (7 + Math.random() * 2).toFixed(1) : '0'
        });
      }
      return days;
    };

    setAttendanceData(generateAttendanceData());
  }, [selectedPeriod]);

  const leaveBalances = [
    {
      type: 'Annual Leave',
      used: 12,
      total: 30,
      color: theme.colors.primary,
      icon: '🏖️'
    },
    {
      type: 'Sick Leave',
      used: 3,
      total: 12,
      color: theme.colors.error,
      icon: '🏥'
    },
    {
      type: 'Personal Leave',
      used: 5,
      total: 15,
      color: theme.colors.success,
      icon: '👤'
    },
    {
      type: 'Emergency Leave',
      used: 1,
      total: 5,
      color: theme.colors.warning,
      icon: '🚨'
    }
  ];

  const performanceMetrics = [
    {
      label: 'Attendance Rate',
      value: '96.5%',
      change: '+2.1%',
      trend: 'up',
      color: theme.colors.success
    },
    {
      label: 'On-time Rate',
      value: '89.2%',
      change: '-1.3%',
      trend: 'down',
      color: theme.colors.warning
    },
    {
      label: 'Overtime Hours',
      value: '24.5h',
      change: '+5.2h',
      trend: 'up',
      color: theme.colors.primary
    },
    {
      label: 'Tasks Completed',
      value: '87',
      change: '+12',
      trend: 'up',
      color: theme.colors.success
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return theme.colors.success;
      case 'late': return theme.colors.warning;
      case 'absent': return theme.colors.error;
      default: return theme.colors.lightGray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return '✅';
      case 'late': return '⏰';
      case 'absent': return '❌';
      default: return '⭕';
    }
  };

  return (
    <div className="fade-in" style={{
      padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        flexWrap: 'wrap',
        gap: theme.spacing.md
      }}>
        <div>
          <h1 style={{
            color: theme.colors.text.primary,
            margin: 0,
            fontSize: '32px',
            fontWeight: '700'
          }}>
            📊 Analytics Dashboard
          </h1>
          <p style={{
            color: theme.colors.text.secondary,
            margin: '8px 0 0 0',
            fontSize: '16px'
          }}>
            Track your performance and attendance insights
          </p>
        </div>

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: theme.borderRadius.small,
            border: `1px solid ${theme.colors.lightGray}`,
            backgroundColor: theme.colors.white,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>

      {/* Performance Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.xl
      }}>
        {performanceMetrics.map((metric, index) => (
          <div
            key={index}
            className="card"
            style={{
              padding: theme.spacing.lg,
              textAlign: 'center',
              transition: theme.transitions.medium
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = theme.shadows.medium;
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = theme.shadows.small;
            }}
          >
            <div style={{
              color: metric.color,
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: theme.spacing.xs
            }}>
              {metric.value}
            </div>
            <div style={{
              color: theme.colors.text.primary,
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: theme.spacing.xs
            }}>
              {metric.label}
            </div>
            <div style={{
              color: metric.trend === 'up' ? theme.colors.success : theme.colors.error,
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {metric.trend === 'up' ? '↗️' : '↘️'} {metric.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.xl
      }}>
        {/* Attendance Calendar */}
        <div className="card" style={{
          padding: theme.spacing.xl
        }}>
          <h3 style={{
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.lg,
            fontSize: '20px',
            fontWeight: '600'
          }}>
            📅 Attendance Overview
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: theme.spacing.md
          }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '8px 4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: theme.colors.text.secondary
                }}
              >
                {day}
              </div>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px'
          }}>
            {attendanceData.slice(-21).map((day, index) => (
              <div
                key={index}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${getStatusColor(day.status)}20`,
                  border: `2px solid ${getStatusColor(day.status)}`,
                  borderRadius: theme.borderRadius.small,
                  fontSize: '10px',
                  cursor: 'pointer',
                  transition: theme.transitions.fast
                }}
                title={`${day.date} - ${day.status} - ${day.hours}h`}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '8px', fontWeight: 'bold' }}>
                  {day.day}
                </div>
                <div>
                  {getStatusIcon(day.status)}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: theme.spacing.md,
            marginTop: theme.spacing.md,
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: theme.colors.success,
                borderRadius: '2px'
              }} />
              Present
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: theme.colors.warning,
                borderRadius: '2px'
              }} />
              Late
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: theme.colors.error,
                borderRadius: '2px'
              }} />
              Absent
            </div>
          </div>
        </div>

        {/* Leave Balances */}
        <div className="card" style={{
          padding: theme.spacing.xl
        }}>
          <h3 style={{
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.lg,
            fontSize: '20px',
            fontWeight: '600'
          }}>
            🏖️ Leave Balance
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing.lg
          }}>
            {leaveBalances.map((leave, index) => {
              const percentage = (leave.used / leave.total) * 100;
              const remaining = leave.total - leave.used;

              return (
                <div key={index}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: theme.spacing.xs
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.sm
                    }}>
                      <span style={{ fontSize: '16px' }}>{leave.icon}</span>
                      <span style={{
                        color: theme.colors.text.primary,
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {leave.type}
                      </span>
                    </div>
                    <span style={{
                      color: leave.color,
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {remaining} days left
                    </span>
                  </div>

                  <div style={{
                    height: '8px',
                    backgroundColor: theme.colors.lightGray,
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: leave.color,
                      transition: theme.transitions.medium
                    }} />
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '4px',
                    fontSize: '12px',
                    color: theme.colors.text.secondary
                  }}>
                    <span>Used: {leave.used}</span>
                    <span>Total: {leave.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{
        padding: theme.spacing.xl
      }}>
        <h3 style={{
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.lg,
          fontSize: '20px',
          fontWeight: '600'
        }}>
          📋 Recent Activity
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: theme.spacing.md
        }}>
          {[
            { action: 'Checked in', time: '9:15 AM', date: 'Today', icon: '🟢' },
            { action: 'Submitted timesheet', time: '6:30 PM', date: 'Yesterday', icon: '📝' },
            { action: 'Leave request approved', time: '2:45 PM', date: '2 days ago', icon: '✅' },
            { action: 'Updated profile', time: '11:20 AM', date: '3 days ago', icon: '👤' },
            { action: 'Completed training', time: '4:15 PM', date: '1 week ago', icon: '🎓' },
            { action: 'Joined team meeting', time: '10:00 AM', date: '1 week ago', icon: '👥' }
          ].map((activity, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing.md,
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.small,
                border: `1px solid ${theme.colors.lightGray}`,
                transition: theme.transitions.fast
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = theme.colors.gray;
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = theme.colors.background;
              }}
            >
              <span style={{
                fontSize: '20px',
                marginRight: theme.spacing.md
              }}>
                {activity.icon}
              </span>
              <div>
                <div style={{
                  color: theme.colors.text.primary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '2px'
                }}>
                  {activity.action}
                </div>
                <div style={{
                  color: theme.colors.text.secondary,
                  fontSize: '12px'
                }}>
                  {activity.time} • {activity.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
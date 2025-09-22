import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme/theme';

const Home = () => {
  const { user, isAuthenticated } = useAuth(); // Moved useAuth to top level
  const [currentTime, setCurrentTime] = useState(new Date());
  const reduxAuthState = useSelector((state) => state.auth);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    console.log('Context API State (useAuth):', { isAuthenticated, user });
    console.log('Redux Auth State:', reduxAuthState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array to run only on mount

  const statsData = [
    {
      label: 'Present',
      value: '22',
      icon: '👥',
      color: theme.colors.success,
      bgColor: `${theme.colors.success}15`
    },
    {
      label: 'Leave',
      value: '6',
      icon: '📅',
      color: theme.colors.warning,
      bgColor: `${theme.colors.warning}15`
    },
    {
      label: 'Next Payday',
      value: 'Apr 29',
      icon: '💰',
      color: theme.colors.primary,
      bgColor: `${theme.colors.primary}15`
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'New company policy has been announced',
      type: 'policy',
      time: '2 hours ago',
      icon: '📢'
    },
    {
      id: 2,
      title: 'Team meeting scheduled for tomorrow at 10 AM',
      type: 'meeting',
      time: '4 hours ago',
      icon: '🤝'
    },
    {
      id: 3,
      title: 'System maintenance scheduled for weekend',
      type: 'maintenance',
      time: '1 day ago',
      icon: '🔧'
    }
  ];

  return (
    <div className="fade-in" style={{ 
      padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header Section */}
      <div style={{ marginBottom: theme.spacing.xl }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: theme.spacing.md
        }}>
          <div>
            <h1 style={{ 
              color: theme.colors.text.primary, 
              marginBottom: theme.spacing.sm,
              fontSize: '32px',
              fontWeight: '700'
            }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={{
              color: theme.colors.text.secondary,
              fontSize: '16px',
              margin: 0
            }}>
              Here's what's happening in your dashboard today
            </p>
          </div>
          
          <div className="card" style={{
            padding: theme.spacing.md,
            textAlign: 'center',
            minWidth: '200px'
          }}>
            <div style={{
              color: theme.colors.primary,
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              {currentTime.toLocaleTimeString()}
            </div>
            <div style={{
              color: theme.colors.text.secondary,
              fontSize: '14px'
            }}>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.xl
      }}>
        {statsData.map((stat, index) => (
          <div 
            key={index}
            className="card fade-in"
            style={{
              padding: theme.spacing.lg,
              textAlign: 'center',
              backgroundColor: stat.bgColor,
              border: `2px solid ${stat.color}20`,
              transition: theme.transitions.medium,
              cursor: 'pointer'
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
              fontSize: '48px',
              marginBottom: theme.spacing.sm
            }}>
              {stat.icon}
            </div>
            <div style={{ 
              color: stat.color, 
              fontSize: '28px', 
              fontWeight: 'bold',
              marginBottom: theme.spacing.xs
            }}>
              {stat.value}
            </div>
            <div style={{ 
              color: theme.colors.text.secondary, 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: theme.spacing.lg
      }}>
        {/* Broadcasts Section */}
        <div className="card" style={{
          padding: theme.spacing.xl
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: theme.spacing.lg
          }}>
            <h2 style={{ 
              color: theme.colors.text.primary, 
              margin: 0,
              fontSize: '24px',
              fontWeight: '600'
            }}>
              📢 Recent Announcements
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background,
                  borderRadius: theme.borderRadius.medium,
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
                  fontSize: '24px', 
                  marginRight: theme.spacing.md,
                  marginTop: '2px'
                }}>
                  {announcement.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    color: theme.colors.text.primary,
                    margin: '0 0 4px 0',
                    fontWeight: '500',
                    lineHeight: '1.4'
                  }}>
                    {announcement.title}
                  </p>
                  <span style={{
                    color: theme.colors.text.secondary,
                    fontSize: '12px'
                  }}>
                    {announcement.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{
          padding: theme.spacing.xl
        }}>
          <h2 style={{ 
            color: theme.colors.text.primary, 
            marginBottom: theme.spacing.lg,
            fontSize: '24px',
            fontWeight: '600'
          }}>
            ⚡ Quick Actions
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: theme.spacing.md
          }}>
            {[
              { label: 'Mark Attendance', icon: '✅', color: theme.colors.success },
              { label: 'Request Leave', icon: '📋', color: theme.colors.warning },
              { label: 'View Payslip', icon: '💸', color: theme.colors.primary },
              { label: 'Update Profile', icon: '👤', color: theme.colors.secondary }
            ].map((action, index) => (
              <button
                key={index}
                style={{
                  padding: theme.spacing.md,
                  backgroundColor: `${action.color}15`,
                  border: `2px solid ${action.color}30`,
                  borderRadius: theme.borderRadius.medium,
                  cursor: 'pointer',
                  transition: theme.transitions.fast,
                  textAlign: 'center'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = `${action.color}25`;
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = `${action.color}15`;
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: theme.spacing.xs }}>
                  {action.icon}
                </div>
                <div style={{ 
                  color: action.color,
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {action.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
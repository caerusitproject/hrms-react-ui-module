// menuItems.js
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; // Attendance
import BeachAccessIcon from '@mui/icons-material/BeachAccess'; // Leave management
import CampaignIcon from '@mui/icons-material/Campaign'; // Broadcast

export const menuItems = [
  {
    path: "/home",
    label: "Home",
    icon: HomeIcon,
    key: "home",
    requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
  },
  {
    path: "/employee-profile",
    label: "Profile",
    icon: PersonIcon,
    key: "profile",
    requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
  },
  
  {
    path: "/attendance",
    label: "Attendance",
    icon: EventAvailableIcon,
    key: "attendance",
    requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
  },
  {
    path: "/leave-management",
    label: "Leave Management",
    icon: BeachAccessIcon,
    key: "leave-management",
    requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    key: "dashboard",
    requiredRoles: ["TEAM MANAGER", "HR", "ADMIN"],
  },
  {
    path: "/broadcast",
    label: "Broadcast",
    icon: CampaignIcon,
    key: "broadcast",
    requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
  },
  {
    path: "/about",
    label: "About",
    icon: InfoIcon,
    key: "about",
    requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
  },
];

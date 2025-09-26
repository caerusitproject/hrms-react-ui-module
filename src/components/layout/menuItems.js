// menuItems.js (new file)
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ATTENDANCE_STATUS } from '../../utils/constants';

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
    path: "/about",
    label: "About",
    icon: InfoIcon,
    key: "about",
    requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
  },
   {
    path: "/attendance",
    label: "Attendance",
    icon: HomeIcon,
    key: "attendance",
    requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
  },
  // {
  //   path: "/attendance",
  //   label: "Attendance",
  //   icon: ATTENDANCE_STATUS.PRESENT.icon,
  //   key: "attendance",
  //   requiredRoles: ["EMPLOYEE", "TEAM MANAGER", "HR", "ADMIN"],
  // },
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    key: "dashboard",
    requiredRoles: ["TEAM MANAGER", "HR", "ADMIN"],
  },
];
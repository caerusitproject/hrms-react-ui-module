// Dummy API responses for admin configuration

export function getEmailTemplates() {
  return [
    {
      id: "1",
      type: "Welcome",
      subject: "Welcome to Our Platform",
      allowedVariables: ["firstName", "lastName", "email"],
    },
    {
      id: "2",
      type: "Notification",
      subject: "Important Update",
      allowedVariables: ["userName", "updateTitle", "date"],
    },
    {
      id: "3",
      type: "Reminder",
      subject: "Action Required",
      allowedVariables: ["taskName", "dueDate", "priority"],
    },
  ]
}

export function getDepartments() {
  return [
    {
      id: "1",
      name: "Engineering",
      description: "Software development and infrastructure",
      employeeCount: 45,
    },
    {
      id: "2",
      name: "Product",
      description: "Product management and strategy",
      employeeCount: 12,
    },
    {
      id: "3",
      name: "Design",
      description: "UI/UX and brand design",
      employeeCount: 8,
    },
    {
      id: "4",
      name: "Marketing",
      description: "Marketing and growth initiatives",
      employeeCount: 15,
    },
    {
      id: "5",
      name: "Sales",
      description: "Sales and business development",
      employeeCount: 20,
    },
    {
      id: "6",
      name: "HR",
      description: "Human resources and recruitment",
      employeeCount: 6,
    },
  ]
}

export function getDesignations() {
  return [
    {
      id: "1",
      name: "Senior Software Engineer",
      department: "Engineering",
      level: "Senior",
      salary_range: "$150K - $200K",
    },
    {
      id: "2",
      name: "Junior Developer",
      department: "Engineering",
      level: "Junior",
      salary_range: "$80K - $120K",
    },
    {
      id: "3",
      name: "Product Manager",
      department: "Product",
      level: "Mid",
      salary_range: "$120K - $160K",
    },
    {
      id: "4",
      name: "UX Designer",
      department: "Design",
      level: "Mid",
      salary_range: "$100K - $140K",
    },
    {
      id: "5",
      name: "Engineering Lead",
      department: "Engineering",
      level: "Lead",
      salary_range: "$180K - $250K",
    },
    {
      id: "6",
      name: "Marketing Manager",
      department: "Marketing",
      level: "Mid",
      salary_range: "$90K - $130K",
    },
    {
      id: "7",
      name: "Sales Executive",
      department: "Sales",
      level: "Mid",
      salary_range: "$80K - $150K",
    },
    {
      id: "8",
      name: "HR Specialist",
      department: "HR",
      level: "Junior",
      salary_range: "$60K - $90K",
    },
  ]
}

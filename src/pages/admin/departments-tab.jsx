// departments-tab.jsx (Updated)
"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { getDepartments } from "./dummy-api"
import Button from "../../components/common/Button"
import DepartmentCard from "./department-card"
import { theme } from '../../theme/theme';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';

export default function DepartmentsTab({ isAdmin }) {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');

  useEffect(() => {
    setLoading(true)
    // Simulate fetch delay
    setTimeout(() => {
      setDepartments(getDepartments())
      setLoading(false)
    }, 500)
  }, [])

  const handleAddDepartment = () => {
    if (!newDeptName) return;
    // Mock create - add to local state
    const newDept = {
      id: Date.now(),
      name: newDeptName,
      description: newDeptDesc || 'No description',
      employeeCount: 0,
    };
    setDepartments([...departments, newDept]);
    setShowAddModal(false);
    setNewDeptName('');
    setNewDeptDesc('');
  };

  const handleDelete = (id) => {
    if (!isAdmin) return;
    setDepartments(departments.filter(d => d.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" style={{ padding: theme.spacing.lg }}>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" style={{ borderColor: theme.colors.lightGray }}></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between" style={{ marginBottom: theme.spacing.lg }}>
        <h2 className="text-xl font-semibold text-slate-900" style={{ color: theme.colors.text.primary }}>Departments</h2>
        {isAdmin && (
          <Button className="flex items-center gap-2" onClick={() => setShowAddModal(true)} style={{ backgroundColor: theme.colors.primary }}>
            <Plus size={18} />
            Add Department
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <DepartmentCard key={dept.id} department={dept} isAdmin={isAdmin} onDelete={handleDelete} />
        ))}
      </div>

      {/* Add Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
        <DialogTitle style={{ color: theme.colors.text.primary }}>Add Department</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={newDeptDesc}
            onChange={(e) => setNewDeptDesc(e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddDepartment} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
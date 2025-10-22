// designations-tab.jsx (Updated - similar to departments)
"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { getDesignations } from "./dummy-api"
import Button from "../../components/common/Button"
import DesignationCard from "./designation-card"
import { theme } from '../../theme/theme';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getDepartments } from "./dummy-api"; // For dropdown

export default function DesignationsTab({ isAdmin }) {
  const [designations, setDesignations] = useState([])
  const [departments, setDepartments] = useState([]); // For dropdown
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDesig, setNewDesig] = useState({ name: '', dept: '', level: 'Mid', salary_range: '' });

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setDesignations(getDesignations())
      setDepartments(getDepartments())
      setLoading(false)
    }, 500)
  }, [])

  const levels = ['Junior', 'Mid', 'Senior', 'Lead'];

  const handleAddDesignation = () => {
    if (!newDesig.name || !newDesig.dept) return;
    // Mock create
    const newDes = {
      id: Date.now(),
      ...newDesig,
    };
    setDesignations([...designations, newDes]);
    setShowAddModal(false);
    setNewDesig({ name: '', dept: '', level: 'Mid', salary_range: '' });
  };

  const handleDelete = (id) => {
    if (!isAdmin) return;
    setDesignations(designations.filter(d => d.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" style={{ padding: theme.spacing.lg }}>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between" style={{ marginBottom: theme.spacing.lg }}>
        <h2 className="text-xl font-semibold text-slate-900" style={{ color: theme.colors.text.primary }}>Designations</h2>
        {isAdmin && (
          <Button className="flex items-center gap-2" onClick={() => setShowAddModal(true)} style={{ backgroundColor: theme.colors.primary }}>
            <Plus size={18} />
            Add Designation
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {designations.map((desig) => (
          <DesignationCard key={desig.id} designation={desig} isAdmin={isAdmin} onDelete={handleDelete} />
        ))}
      </div>

      {/* Add Modal */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
        <DialogTitle style={{ color: theme.colors.text.primary }}>Add Designation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newDesig.name}
            onChange={(e) => setNewDesig({ ...newDesig, name: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Department</InputLabel>
            <Select
              value={newDesig.dept}
              label="Department"
              onChange={(e) => setNewDesig({ ...newDesig, dept: e.target.value })}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.name}>{dept.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Level</InputLabel>
            <Select
              value={newDesig.level}
              label="Level"
              onChange={(e) => setNewDesig({ ...newDesig, level: e.target.value })}
            >
              {levels.map((level) => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Salary Range"
            value={newDesig.salary_range}
            onChange={(e) => setNewDesig({ ...newDesig, salary_range: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button onClick={handleAddDesignation} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
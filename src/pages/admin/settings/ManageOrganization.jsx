"use client"

import React, { useState } from "react"
import {
  Box,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  Container,
  Grid,
  Stack,
  Divider,
  IconButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { orange } from "@mui/material/colors"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import MailTemplates from "./MailTemplates"
import TemplateEditorDialog from "./TemplateEditorModal"

// Inspired by Home.jsx spacing/cards: rounded corners, soft shadows, generous spacing
const Shell = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}))

const Card = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
}))

const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: orange[500],
    height: 3,
    borderRadius: 1.5,
  },
})

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightMedium,
  minHeight: 48,
  "&.Mui-selected": {
    color: orange[600],
  },
}))

const AddButton = styled(Button)({
  backgroundColor: orange[500],
  color: "#fff",
  "&:hover": {
    backgroundColor: orange[700],
  },
})

// Mock variables and replacement util (kept from original)
const VARIABLES = {
  employeeName: "John Doe",
  companyName: "Acme Co",
  startDate: "2023-10-01",
  endDate: "2023-10-05",
  reviewDate: "2023-12-15",
}

const replaceVariables = (body) => body.replace(/\{\{(\w+)\}\}/g, (_, key) => VARIABLES[key] || `{{${key}}}`)

// Reusable modals to avoid alert/prompt/confirm
function ItemDialog({ open, title, initialName = "", onClose, onSave }) {
  const [name, setName] = useState(initialName)
  React.useEffect(() => setName(initialName), [initialName, open])
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <TextField autoFocus fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={() => onSave(name)} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ConfirmDialog({ open, title, message, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography color="text.secondary">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// "Actions" modal to show per-row actions (no inline alerts)
function ActionsDialog({ open, onClose, onEdit, onDelete }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Actions</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.5}>
          <Button variant="outlined" onClick={onEdit} fullWidth>
            Edit
          </Button>
          <Button variant="outlined" color="error" onClick={onDelete} fullWidth>
            Delete
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const INITIAL_DATA = {
  templates: [
    {
      id: 1,
      name: "Welcome Email",
      subject: "Welcome to Acme Co!",
      lastModified: "2023-08-15",
      body: "Hello {{employeeName}}, Welcome to {{companyName}}. We're excited to have you!",
    },
    {
      id: 2,
      name: "Leave Request Approved",
      subject: "Your Leave Request has been Approved",
      lastModified: "2023-08-10",
      body: "Dear {{employeeName}}, your leave from {{startDate}} to {{endDate}} has been approved.",
    },
    {
      id: 3,
      name: "Performance Review Reminder",
      subject: "Reminder: Performance Review Due",
      lastModified: "2023-08-05",
      body: "Hi {{employeeName}}, this is a reminder that your performance review is due on {{reviewDate}}.",
    },
  ],
  departments: [
    { id: 1, name: "Human Resources" },
    { id: 2, name: "Engineering" },
    { id: 3, name: "Finance" },
  ],
  roles: [
    { id: 1, name: "Admin" },
    { id: 2, name: "Manager" },
    { id: 3, name: "Employee" },
  ],
  designations: [
    { id: 1, name: "Software Engineer" },
    { id: 2, name: "Senior Manager" },
    { id: 3, name: "HR Executive" },
  ],
}

export default function ManageOrganization() {
  const [activeTab, setActiveTab] = useState("mail-templates")
  const [data, setData] = useState(INITIAL_DATA)

  // Template modals
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)

  // Item modals (departments/roles/designations)
  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [itemDialogTitle, setItemDialogTitle] = useState("")
  const [itemType, setItemType] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  // Confirm delete modal
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteCtx, setDeleteCtx] = useState({ type: null, id: null })

  // Actions modal (per-row)
  const [actionsOpen, setActionsOpen] = useState(false)
  const [actionsCtx, setActionsCtx] = useState({ type: null, item: null })

  const handleTabChange = (_e, newValue) => setActiveTab(newValue)

  // Templates
  const openAddTemplate = () => {
    setEditingTemplate(null)
    setTemplateDialogOpen(true)
  }
  const openEditTemplate = (template) => {
    setEditingTemplate(template)
    setTemplateDialogOpen(true)
  }
  const saveTemplate = (template) => {
    const updated = {
      ...template,
      lastModified: new Date().toISOString().split("T")[0],
    }
    setData((prev) => ({
      ...prev,
      templates: template.id
        ? prev.templates.map((t) => (t.id === template.id ? updated : t))
        : [...prev.templates, { ...updated, id: Date.now() }],
    }))
    setTemplateDialogOpen(false)
    setEditingTemplate(null)
  }

  // Items (departments / roles / designations)
  const openAddItem = (type) => {
    setItemType(type)
    setEditingItem(null)
    setItemDialogTitle(`Add ${type.slice(0, 1).toUpperCase()}${type.slice(1, -1)}`)
    setItemDialogOpen(true)
  }
  const openEditItem = (type, item) => {
    setItemType(type)
    setEditingItem(item)
    setItemDialogTitle(`Edit ${type.slice(0, 1).toUpperCase()}${type.slice(1, -1)}`)
    setItemDialogOpen(true)
  }
  const saveItem = (name) => {
    if (!itemType) return
    setData((prev) => {
      if (editingItem) {
        return {
          ...prev,
          [itemType]: prev[itemType].map((i) => (i.id === editingItem.id ? { ...i, name } : i)),
        }
      }
      return {
        ...prev,
        [itemType]: [...prev[itemType], { id: Date.now(), name }],
      }
    })
    setItemDialogOpen(false)
    setEditingItem(null)
    setItemType(null)
  }

  const openDeleteItem = (type, id) => {
    setDeleteCtx({ type, id })
    setConfirmOpen(true)
  }
  const confirmDelete = () => {
    setData((prev) => ({
      ...prev,
      [deleteCtx.type]: prev[deleteCtx.type].filter((i) => i.id !== deleteCtx.id),
    }))
    setConfirmOpen(false)
    setDeleteCtx({ type: null, id: null })
  }

  // Actions modal helpers
  const openActions = (type, item) => {
    setActionsCtx({ type, item })
    setActionsOpen(true)
  }
  const handleActionEdit = () => {
    openEditItem(actionsCtx.type, actionsCtx.item)
    setActionsOpen(false)
  }
  const handleActionDelete = () => {
    openDeleteItem(actionsCtx.type, actionsCtx.item.id)
    setActionsOpen(false)
  }

  const singularLabel = (plural) =>
    plural === "roles" ? "Role" : plural === "departments" ? "Department" : "Designation"

  return (
    <div>
      <Stack spacing={2} mb={2}>
        <Typography variant="h4" fontWeight={700}>
           Admin Configuration
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage mail templates, departments, roles, and designations.
        </Typography>
      </Stack>

      <Card>
        <Box p={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <StyledTabs value={activeTab} onChange={handleTabChange} variant="scrollable">
                <StyledTab value="mail-templates" label="Mail Templates" />
                <StyledTab value="departments" label="Departments" />
                <StyledTab value="designations" label="Designations" />
              </StyledTabs>
            </Grid>
            <Grid item>
              {activeTab === "mail-templates" ? (
                <AddButton onClick={openAddTemplate}>+ Add New Template</AddButton>
              ) : (
                <AddButton onClick={() => openAddItem(activeTab)}>+ Add New {singularLabel(activeTab)}</AddButton>
              )}
            </Grid>
          </Grid>
        </Box>
        <Divider />

        <Box p={2}>
          {activeTab === "mail-templates" && (
            <MailTemplates data={data.templates} onAdd={openAddTemplate} onEdit={openEditTemplate} />
          )}

          {["departments", "roles", "designations"].includes(activeTab) && (
            <Paper variant="outlined" elevation={0}>
              <Table aria-label={`${activeTab} table`}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data[activeTab].map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => openActions(activeTab, item)}>
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data[activeTab].length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        No {activeTab} yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>
      </Card>

      {/* Template Editor Dialog */}
      <TemplateEditorDialog
        open={templateDialogOpen}
        template={editingTemplate}
        onClose={() => {
          setTemplateDialogOpen(false)
          setEditingTemplate(null)
        }}
        onSave={saveTemplate}
        replaceVariables={replaceVariables}
        variables={VARIABLES}
      />

      {/* Item Add/Edit Dialog */}
      <ItemDialog
        open={itemDialogOpen}
        title={itemDialogTitle}
        initialName={editingItem?.name || ""}
        onClose={() => {
          setItemDialogOpen(false)
          setEditingItem(null)
          setItemType(null)
        }}
        onSave={saveItem}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />

      {/* Row Actions Dialog */}
      <ActionsDialog
        open={actionsOpen}
        onClose={() => setActionsOpen(false)}
        onEdit={handleActionEdit}
        onDelete={handleActionDelete}
      />
    </div>
  )
}

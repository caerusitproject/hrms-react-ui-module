"use client"

import React, { useState, useMemo } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  Box,
  Chip,
} from "@mui/material"
import PreviewIcon from "@mui/icons-material/Preview"

export default function TemplateEditorDialog({ open, template, onClose, onSave, replaceVariables, variables }) {
  const [formData, setFormData] = useState(template || { id: null, name: "", subject: "", body: "" })
  const [showPreview, setShowPreview] = useState(false)

  // Keep form in sync when editing a different template
  React.useEffect(() => {
    setFormData(template || { id: null, name: "", subject: "", body: "" })
  }, [template])

  const previewText = useMemo(() => {
    return showPreview && replaceVariables ? replaceVariables(formData.body) : ""
  }, [showPreview, formData.body, replaceVariables])

  const handleSave = () => {
    onSave({ ...formData, id: formData.id || Date.now() })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{template ? "Edit Template" : "Add New Template"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <TextField
                label="Template Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email Body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                fullWidth
                multiline
                minRows={8}
                placeholder="Use variables like {{employeeName}}"
              />
              <FormControlLabel
                control={<Switch checked={showPreview} onChange={(e) => setShowPreview(e.target.checked)} />}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PreviewIcon fontSize="small" />
                    <span>Show Preview</span>
                  </Stack>
                }
              />
              {showPreview && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.default" }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      whiteSpace: "pre-wrap",
                      fontFamily: "monospace",
                      fontSize: 14,
                    }}
                  >
                    {previewText}
                  </Box>
                </Paper>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Available Variables
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {Object.keys(variables || {}).map((key) => (
                  <Chip key={key} label={`{{${key}}}`} color="warning" variant="outlined" />
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" mt={2}>
                Copy any variable into your email body. It will be replaced with actual values when sending.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save Template
        </Button>
      </DialogActions>
    </Dialog>
  )
}

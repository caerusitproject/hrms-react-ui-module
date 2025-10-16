"use client"
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Stack } from "@mui/material"

export default function MailTemplates({ data, onEdit, onAdd }) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="flex-end">
        {/* <Button variant="contained" color="warning" onClick={onAdd}>
          + Add New Template
        </Button> */}
      </Stack>
      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table size="medium" aria-label="mail templates table">
          <TableHead>
            <TableRow>
              <TableCell>Template Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((template) => (
              <TableRow key={template.id} hover>
                <TableCell>{template.name}</TableCell>
                <TableCell>{template.subject}</TableCell>
                <TableCell>{template.lastModified}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => onEdit(template)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No templates yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

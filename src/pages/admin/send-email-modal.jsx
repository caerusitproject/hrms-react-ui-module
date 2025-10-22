// send-email-modal.jsx (New file)
"use client"

import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography } from '@mui/material';
import { theme } from '../../theme/theme';
import { EmployeeAPI } from '../../api/employeeApi';
import { Send } from 'lucide-react';

export default function SendEmailModal({ open, onClose, template }) {
  const [recipient, setRecipient] = useState('');
  const [variables, setVariables] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!template || !recipient) return;
    try {
      setLoading(true);
      const payload = {
        templateId: template.id,
        recipient,
        variables,
      };
      await EmployeeAPI.sendEmail(payload);
      onClose();
    } catch (err) {
      console.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const updateVar = (key, value) => {
    setVariables({ ...variables, [key]: value });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{ color: theme.colors.text.primary }}>Send Email</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Recipient Email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          margin="normal"
        />
        {template?.allowedVariables?.map((varName) => (
          <TextField
            key={varName}
            fullWidth
            label={`Value for {{${varName}}}`}
            value={variables[varName] || ''}
            onChange={(e) => updateVar(varName, e.target.value)}
            margin="normal"
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={theme.cancelBtn}>Cancel</Button>
        <Button
          onClick={handleSend}
          variant="contained"
          startIcon={<Send size={16} />}
          disabled={loading}
          style={{ ...theme.sendBtnModal }}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
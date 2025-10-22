// edit-template-modal.jsx (Updated similarly with formatting toolbar)
"use client"

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, Chip, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import { FormatBold, FormatItalic, FormatListBulleted, FormatQuote, Code, FormatAlignLeft } from '@mui/icons-material';
import { theme } from '../../theme/theme';
import VariablePalette from './variable-palette';
import DOMPurify from "dompurify";
import { EmailTemplateAPI } from '../../api/emailTemplateApi';

export default function EditTemplateModal({ open, onClose, template, onSave }) {
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    body: '',
    allowedVariables: [],
    isHtml: true,
  });
  const [previewVars, setPreviewVars] = useState({});
  const textareaRef = useRef(null);

  const predefinedVars = ['name', 'empCode', 'email', 'employeeName'];

  // Auto-detect variables from body
  const extractVariables = (bodyText) => {
    const matches = bodyText.match(/\{\{([^}]+)\}\}/g);
    if (matches) {
      return [...new Set(matches.map(match => match.slice(2, -2).trim()))];
    }
    return [];
  };

  const handleBodyChange = (e) => {
    let newBody = e.target.value;
    // Auto-wrap plain text lines in <p> tags if isHtml is true
    if (formData.isHtml && !newBody.includes('<p>') && newBody.trim()) {
      const lines = newBody.split('\n').filter(line => line.trim());
      newBody = lines.map(line => `<p>${line}</p>`).join('');
    }
    const detectedVars = extractVariables(newBody);
    setFormData({ 
      ...formData, 
      body: newBody, 
      allowedVariables: detectedVars 
    });
  };

  useEffect(() => {
    if (open && template) {
      const detectedVars = extractVariables(template.body);
      const finalVars = template.allowedVariables?.length > 0 ? template.allowedVariables : detectedVars;
      setFormData({
        type: template.type || '',
        subject: template.subject || '',
        body: template.body || '',
        allowedVariables: finalVars,
        isHtml: template.isHtml !== false,
      });

      // Initialize preview vars with samples
      const samples = {
        name: 'John Doe',
        empCode: 'EMP001',
        email: 'john.doe@caerusit.com',
        employeeName: 'John Doe',
      };
      const initVars = {};
      finalVars.forEach(v => {
        initVars[v] = samples[v] || `[${v.toUpperCase()}]`;
      });
      setPreviewVars(initVars);
    }
  }, [open, template]);

  const updatePreviewVar = (key, value) => {
    setPreviewVars(prev => ({ ...prev, [key]: value }));
  };

  const insertVariable = (variable) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.body;
    const variableText = `{{${variable}}}`;
    const newBody = text.slice(0, start) + variableText + text.slice(end);
    setFormData(prev => {
      const detectedVars = extractVariables(newBody);
      return { ...prev, body: newBody, allowedVariables: detectedVars };
    });
    if (!previewVars[variable]) {
      updatePreviewVar(variable, `[${variable.toUpperCase()}]`);
    }
    setTimeout(() => textarea.focus(), 0);
  };

  const addCustomVar = (customVar) => {
    if (customVar && !formData.allowedVariables.includes(customVar)) {
      insertVariable(customVar);
    }
  };

  // Formatting helpers
  const insertFormat = (tag, content = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.body.slice(start, end);
    const wrapText = selectedText ? `<${tag}>${selectedText}</${tag}>` : `<${tag}>${content}</${tag}>`;
    const newBody = formData.body.slice(0, start) + wrapText + formData.body.slice(end);
    setFormData(prev => {
      const detectedVars = extractVariables(newBody);
      return { ...prev, body: newBody, allowedVariables: detectedVars };
    });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + wrapText.length, start + wrapText.length);
    }, 0);
  };

  const insertNewParagraph = (content = '') => {
    const newPara = content ? `<p>${content}</p>` : '<p></p>';
    insertFormat('p', newPara);
  };

  const handlePreview = (body) => {
    let previewBody = body;
    Object.entries(previewVars).forEach(([key, value]) => {
      const replacement = value || `[${key.toUpperCase()}]`;
      previewBody = previewBody.replace(new RegExp(`{{${key}}}`, 'g'), replacement);
    });
    return previewBody;
  };

  const handleIsHtmlChange = (e) => {
    setFormData({ ...formData, isHtml: e.target.checked });
  };

  const handleSubmit = async () => {
    if (!template?.id) return;
    const payload = {
      type: formData.type,
      subject: formData.subject,
      body: formData.body,
      allowedVariables: formData.allowedVariables,
      isHtml: formData.isHtml,
    };
    try {
      const response = await EmailTemplateAPI.updateTemplate(template.id, payload);
      onSave(response);
    } catch (err) {
      console.error('Failed to update template');
    }
  };

  const handleClose = () => {
    setFormData({ type: '', subject: '', body: '', allowedVariables: [], isHtml: true });
    setPreviewVars({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle style={{ color: theme.colors.text.primary }}>Edit Email Template</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Form */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              margin="normal"
            />
            {/* Formatting Toolbar */}
            <Box sx={{ display: 'flex', gap: 1, mb: 1, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <IconButton onClick={() => insertFormat('b')} title="Bold">
                <FormatBold fontSize="small" />
              </IconButton>
              <IconButton onClick={() => insertFormat('i')} title="Italic">
                <FormatItalic fontSize="small" />
              </IconButton>
              <IconButton onClick={() => insertNewParagraph()} title="New Paragraph">
                <FormatAlignLeft fontSize="small" />
              </IconButton>
              <IconButton onClick={() => insertFormat('ul', '<li></li>')} title="Bullet List">
                <FormatListBulleted fontSize="small" />
              </IconButton>
              <IconButton onClick={() => insertFormat('blockquote')} title="Quote">
                <FormatQuote fontSize="small" />
              </IconButton>
              <IconButton onClick={() => insertFormat('code')} title="Code">
                <Code fontSize="small" />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={12}
              label="Body (HTML Source)"
              value={formData.body}
              onChange={handleBodyChange}
              inputRef={textareaRef}
              style={{ 
                ...theme.textarea || { fontFamily: 'monospace', fontSize: '14px' },
                borderColor: theme.colors.lightGray 
              }}
              margin="normal"
            />
            <FormControlLabel
              control={<Checkbox checked={formData.isHtml} onChange={handleIsHtmlChange} />}
              label="Use HTML Format (Auto-wraps text in <p> tags)"
              style={{ color: theme.colors.text.secondary }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" style={{ color: theme.colors.text.secondary }}>Detected Variables:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {formData.allowedVariables.map((v) => (
                  <Chip 
                    key={v} 
                    label={`{{${v}}}`} 
                    size="small" 
                    style={{ backgroundColor: theme.colors.primary }} 
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Variable Palette */}
          <Box style={{ flex: '0 0 200px' }}>
            <VariablePalette
              predefinedVars={predefinedVars}
              onInsert={insertVariable}
              onAddCustom={addCustomVar}
              usedVars={formData.allowedVariables}
            />
          </Box>

          {/* Preview Section */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography variant="h6" style={{ color: theme.colors.text.primary, marginBottom: theme.spacing.md }}>Live Preview</Typography>
            
            {/* Preview Variables Inputs */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" style={{ color: theme.colors.text.secondary, mb: 1 }}>Preview Values:</Typography>
              {formData.allowedVariables.map((varName) => (
                <Box key={varName} sx={{ mb: 1 }}>
                  <Typography variant="caption" style={{ color: theme.colors.text.secondary, display: 'block', mb: 0.5 }}>
                    {`{{${varName}}}: `}
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    value={previewVars[varName] || ''}
                    onChange={(e) => updatePreviewVar(varName, e.target.value)}
                    placeholder={`Sample for ${varName}`}
                  />
                </Box>
              ))}
            </Box>

            {/* Rendered Preview */}
            <Box style={{ 
              ...theme.previewBox || { border: `1px solid ${theme.colors.lightGray}`, borderRadius: theme.borderRadius.medium },
              padding: theme.spacing.md,
              backgroundColor: theme.colors.white 
            }}>
              <Typography variant="h6" style={{ 
                ...theme.previewSubject || {}, 
                borderBottom: `1px solid ${theme.colors.lightGray}`,
                paddingBottom: theme.spacing.sm,
                marginBottom: theme.spacing.md 
              }}>
                {formData.subject || '[Subject]'}
              </Typography>
              <div
                style={{ 
                  ...theme.previewContent || { lineHeight: '1.6', minHeight: '200px' },
                  color: theme.colors.text.primary
                }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(handlePreview(formData.body)) }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} style={{ ...theme.cancelBtn }}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" style={{ ...theme.saveBtn }}>Update Template</Button>
      </DialogActions>
    </Dialog>
  );
}
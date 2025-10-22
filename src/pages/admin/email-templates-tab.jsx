// email-templates-tab.jsx (Updated with Edit functionality)
"use client"

import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DOMPurify from "dompurify";
import { EmailTemplateAPI } from '../../api/emailTemplateApi';
import { theme } from '../../theme/theme';
import CreateTemplateModal from './create-template-modal';
import EditTemplateModal from './edit-template-modal'; // New import
import SendEmailModal from './send-email-modal';

export default function EmailTemplatesTab({ isAdmin }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTemplateForEdit, setSelectedTemplateForEdit] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedTemplateForSend, setSelectedTemplateForSend] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await EmailTemplateAPI.getAllTemplates();
        setTemplates(response.templates?.rows || []);
        setError(null);
      } catch (err) {
        setError("Failed to load templates. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handlePreview = (template) => {
    setPreviewTemplate(template);
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
  };

  const handleOpenCreate = () => {
    if (isAdmin) setShowCreateModal(true);
  };

  const handleCloseCreate = () => {
    setShowCreateModal(false);
  };

  const handleTemplateCreated = (newTemplate) => {
    setTemplates([...templates, newTemplate]);
    handleCloseCreate();
  };

  const handleOpenEdit = (template) => {
    if (isAdmin) {
      setSelectedTemplateForEdit(template);
      setShowEditModal(true);
    }
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedTemplateForEdit(null);
  };

  const handleTemplateUpdated = (updatedTemplate) => {
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    handleCloseEdit();
  };

  const handleOpenSend = (template) => {
    setSelectedTemplateForSend(template);
    setShowSendModal(true);
  };

  const handleCloseSend = () => {
    setShowSendModal(false);
    setSelectedTemplateForSend(null);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    try {
      await EmailTemplateAPI.deleteTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
    } catch (err) {
      setError("Failed to delete template.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} style={{ padding: theme.spacing.lg }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} style={{ padding: theme.spacing.lg }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }} style={{ padding: theme.spacing.lg }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }} style={{ marginBottom: theme.spacing.md }}>
        <Typography variant="h5" component="h2" style={{ color: theme.colors.text.primary }}>
          Email Templates
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
            style={{ backgroundColor: theme.colors.primary }}
          >
            New Template
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, '&:hover': { boxShadow: 6 } }} style={{ boxShadow: theme.shadows.medium }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Chip label={template.type} color="primary" size="small" sx={{ marginBottom: 1 }} style={{ backgroundColor: theme.colors.primaryLight }} />
                    <Typography variant="h6" component="h3" style={{ color: theme.colors.text.primary }}>
                      {template.subject}
                    </Typography>
                  </Box>
                  {isAdmin && (
                    <Box>
                      <IconButton aria-label="edit" size="small" onClick={() => handleOpenEdit(template)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton aria-label="delete" size="small" color="error" onClick={() => handleDelete(template.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }} style={{ color: theme.colors.text.secondary }}>
                    Variables:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {template.allowedVariables?.length > 0 ? (
                      template.allowedVariables.map((v) => (
                        <Chip key={v} label={`{{${v}}}`} size="small" variant="outlined" style={{ borderColor: theme.colors.primary }} />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" style={{ color: theme.colors.text.secondary }}>
                        No variables
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-start', padding: 2 }}>
                <Button
                  startIcon={<VisibilityIcon />}
                  onClick={() => handlePreview(template)}
                  variant="outlined"
                  size="small"
                  sx={{ marginRight: 1 }}
                  style={{ borderColor: theme.colors.primary }}
                >
                  Preview
                </Button>
                <Button
                  startIcon={<SendIcon />}
                  onClick={() => handleOpenSend(template)}
                  variant="contained"
                  size="small"
                  style={{ backgroundColor: theme.colors.success }}
                >
                  Send
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewTemplate}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        {previewTemplate && (
          <>
            <DialogTitle style={{ color: theme.colors.text.primary }}>{previewTemplate.subject}</DialogTitle>
            <DialogContent>
              <Box
                sx={{ border: '1px solid #ddd', padding: 2, overflow: 'auto' }}
                style={{ borderColor: theme.colors.lightGray, padding: theme.spacing.md }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewTemplate.body) }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePreview} variant="contained" style={{ backgroundColor: theme.colors.primary }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Create Modal */}
      <CreateTemplateModal
        open={showCreateModal}
        onClose={handleCloseCreate}
        onSave={handleTemplateCreated}
      />

      {/* Edit Modal */}
      <EditTemplateModal
        open={showEditModal}
        onClose={handleCloseEdit}
        template={selectedTemplateForEdit}
        onSave={handleTemplateUpdated}
      />

      {/* Send Modal */}
      <SendEmailModal
        open={showSendModal}
        onClose={handleCloseSend}
        template={selectedTemplateForSend}
      />
    </Box>
  );
}
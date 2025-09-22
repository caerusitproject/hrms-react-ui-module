// EmployeeProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Assuming this provides user
import { Box, Card, CardContent, Grid, Typography, TextField, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, Add as AddIcon, Visibility as ViewIcon, Upload as UploadIcon } from '@mui/icons-material';
import { theme } from '../../theme/theme'; // Assuming custom theme
import { validateFileUpload } from '../../utils/validation';

const EmployeeProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    email: '',
    phone: '',
    address: '',
    aadhaar: '',
    // Professional Details
    designation: '',
    department: '',
    reportingManager: '',
    joinedDate: '',
    // Bank Details
    bankName: '',
    accountNumber: '',
    ifsc: '',
    // Profile Photo
    profilePhoto: null,
  });
  const [documents, setDocuments] = useState([
    { name: 'Offer Letter', file: null, url: '' },
    { name: 'Aadhaar Card', file: null, url: '' },
    { name: 'PAN Card', file: null, url: '' },
  ]);
  const [uploadDialog, setUploadDialog] = useState({ open: false, docIndex: -1 });
  const [docName, setDocName] = useState('');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Mock initial data - replace with API fetch
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: 'Ethan Harper',
        email: 'ethan.harper@example.com',
        phone: '+1-555-234-5678',
        address: '123 Elm Street, Anytown, USA',
        aadhaar: '1234-5678-9012', // Mock
        designation: 'System Engineer',
        department: 'IT Department',
        reportingManager: 'Sophia Clark',
        joinedDate: 'January 15, 2022',
        bankName: 'Sample Bank',
        accountNumber: '1234567890',
        ifsc: 'SBIN0001234',
      });
    }
  }, [user]);

  const canEdit = user?.role && user.role !== 'EMPLOYEE';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSave = () => {
    // API call to save
    console.log('Saving:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original
    setIsEditing(false);
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    const validation = validateFileUpload(file);
    if (!validation.isValid) {
      alert(validation.error); // Or use Snackbar
      return;
    }
    setProfilePhotoFile(file);
    // Update avatar preview
  };

  const handleDocumentUpload = (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const validation = validateFileUpload(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }
      setUploadDialog({ open: true, docIndex: index });
      setProfilePhotoFile(file); // Temp store
    };
    input.click();
  };

  const handleConfirmUpload = () => {
    if (!docName.trim()) {
      alert('Document name is required');
      return;
    }
    const file = profilePhotoFile; // From temp
    // API upload logic
    const updatedDocs = [...documents];
    updatedDocs[uploadDialog.docIndex] = { ...updatedDocs[uploadDialog.docIndex], name: docName, file, url: URL.createObjectURL(file) };
    setDocuments(updatedDocs);
    setUploadDialog({ open: false, docIndex: -1 });
    setDocName('');
  };

  const handleViewDocument = (url) => {
    // Open in new tab or modal
    window.open(url, '_blank');
  };

  return (
    <div className="fade-in" style={{ 
          padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
    
      <Card sx={{ maxWidth: 800, mx: 'auto', borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          {/* Profile Header */}
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar
                src={profilePhotoFile ? URL.createObjectURL(profilePhotoFile) : undefined}
                sx={{ width: 80, height: 80, bgcolor: theme.colors.primary }}
              >
                {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'E'}
              </Avatar>
              {canEdit && isEditing && (
                <IconButton onClick={() => document.getElementById('photo-upload').click()} sx={{ ml: 1 }}>
                  <UploadIcon />
                </IconButton>
              )}
              <input id="photo-upload" type="file" hidden accept="image/*" onChange={handleProfilePhotoUpload} />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" sx={{ color: theme.colors.primary }}>{formData.fullName}</Typography>
              <Typography variant="h6">{formData.designation}</Typography>
              <Typography variant="body2" color="text.secondary">Joined {formData.joinedDate}</Typography>
            </Grid>
            {canEdit && (
              <Grid item>
                <IconButton onClick={() => setIsEditing(!isEditing)} color="primary">
                  {isEditing ? <CancelIcon /> : <EditIcon />}
                </IconButton>
              </Grid>
            )}
          </Grid>

          {/* Edit Controls */}
          {isEditing && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSave}>Save</Button>
              <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel}>Cancel</Button>
            </Box>
          )}

          {/* Personal Details */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Personal Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Aadhaar Number"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Professional Details */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Professional Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Reporting Manager"
                  name="reportingManager"
                  value={formData.reportingManager}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Bank Details */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Bank Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Account Number"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="IFSC Code"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputProps={{ readOnly: !isEditing }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Supportive Documents */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Supportive Documents</Typography>
            <Grid container spacing={2}>
              {documents.map((doc, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={doc.name} color="primary" size="small" />
                        {doc.url && <IconButton onClick={() => handleViewDocument(doc.url)}><ViewIcon /></IconButton>}
                        {canEdit && <IconButton onClick={() => handleDocumentUpload(index)}><UploadIcon /></IconButton>}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {canEdit && (
                <Grid item xs={12}>
                  <Button startIcon={<AddIcon />} onClick={() => handleDocumentUpload(-1)}>Add New Document</Button>
                </Grid>
              )}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog.open} onClose={() => setUploadDialog({ ...uploadDialog, open: false })}>
        <DialogTitle>Document Name</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Enter Document Name"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog({ ...uploadDialog, open: false })}>Cancel</Button>
          <Button onClick={handleConfirmUpload}>Upload</Button>
        </DialogActions>
      </Dialog>
    
    </div>
  );
};

export default EmployeeProfile;
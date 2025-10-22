import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { EmailTemplateAPI } from '../../api/emailTemplateApi';
import { EmployeeAPI } from '../../api/employeeApi';
import { theme } from '../../theme/theme';
import { Mail, Building2, Briefcase, Plus, Edit2, Trash2, Eye, Send, X, AlertCircle, Loader } from 'lucide-react';
import Button from '../../components/common/Button';

const extractVars = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  const matches = text.match(/\{\{(\w+)\}\}/g);
  return matches ? [...new Set(matches.map(m => m.slice(2, -2)))] : [];
};

const AdminConfig = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('templates');
  const [userRole, setUserRole] = useState(user?.role || 'ADMIN');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddDesigModal, setShowAddDesigModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Human Resources' },
    { id: 2, name: 'Information Technology' },
    { id: 3, name: 'Finance' },
    { id: 4, name: 'Marketing' },
  ]);
  const [designations, setDesignations] = useState([
    { id: 1, name: 'HR Manager', dept: 'Human Resources' },
    { id: 2, name: 'Software Engineer', dept: 'Information Technology' },
    { id: 3, name: 'Accountant', dept: 'Finance' },
    { id: 4, name: 'Marketing Executive', dept: 'Marketing' },
    { id: 5, name: 'CEO', dept: 'Human Resources' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    type: '',
    subject: '',
    body: '',
    allowedVariables: [],
    isHtml: true,
  });
  const [newDepartment, setNewDepartment] = useState('');
  const [newDesignation, setNewDesignation] = useState({ name: '', dept: '' });
  const [sendEmailData, setSendEmailData] = useState({ recipient: '', variables: {} });
  const [editingDept, setEditingDept] = useState(null);
  const [editingDesig, setEditingDesig] = useState(null);
  const editorRef = useRef(null);

  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'templates') {
          const response = await EmailTemplateAPI.getAllTemplates();
          setTemplates(response.templates.rows);
        } else if (activeTab === 'departments') {
          // Dummy data, no fetch
        } else if (activeTab === 'designations') {
          // Dummy data, no fetch
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const ensureEditorReady = () => {
    return new Promise((resolve) => {
      if (!newTemplate.body) {
        setNewTemplate(prev => ({ ...prev, body: '<p><br></p>', allowedVariables: extractVars('<p><br></p>') }));
        setTimeout(resolve, 50);
      } else {
        resolve();
      }
    });
  };

  const toggleTag = (tagName) => {
    ensureEditorReady().then(() => {
      const editor = editorRef.current;
      if (editor) {
        editor.focus();
        document.execCommand(tagName.toLowerCase(), false, null);
        setNewTemplate(prev => ({
          ...prev,
          body: editor.innerHTML,
          allowedVariables: extractVars(editor.innerHTML)
        }));
      }
    });
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (!url) return;
    ensureEditorReady().then(() => {
      const editor = editorRef.current;
      if (editor) {
        editor.focus();
        document.execCommand('createLink', false, url);
        setNewTemplate(prev => ({
          ...prev,
          body: editor.innerHTML,
          allowedVariables: extractVars(editor.innerHTML)
        }));
      }
    });
  };

  const insertVariable = (variable) => {
    if (!newTemplate.body) {
      setNewTemplate(prev => ({
        ...prev,
        body: `<p>{{${variable}}}</p>`,
        allowedVariables: [variable]
      }));
      setTimeout(() => {
        const editor = editorRef.current;
        if (editor) {
          editor.focus();
          const range = document.createRange();
          range.selectNodeContents(editor.firstChild);
          range.collapse(false);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }, 50);
      return;
    }
    const editor = editorRef.current;
    if (!editor) return;
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(`{{${variable}}}`);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      setNewTemplate(prev => ({
        ...prev,
        body: editor.innerHTML,
        allowedVariables: extractVars(editor.innerHTML)
      }));
    }
  };

  const handleCreateTemplate = async () => {
    try {
      setLoading(true);
      await EmailTemplateAPI.createTemplate(newTemplate);
      setShowTemplateModal(false);
      setNewTemplate({ type: '', subject: '', body: '', allowedVariables: [], isHtml: true });
      const response = await EmailTemplateAPI.getAllTemplates();
      setTemplates(response.templates.rows);
      setError(null);
    } catch (err) {
      setError('Failed to create template.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async (id, data) => {
    try {
      setLoading(true);
      await EmailTemplateAPI.updateTemplate(id, data);
      const response = await EmailTemplateAPI.getAllTemplates();
      setTemplates(response.templates.rows);
      setShowTemplateModal(false);
      setError(null);
    } catch (err) {
      setError('Failed to update template.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      setLoading(true);
      await EmailTemplateAPI.deleteTemplate(id);
      const response = await EmailTemplateAPI.getAllTemplates();
      setTemplates(response.templates.rows);
      setError(null);
    } catch (err) {
      setError('Failed to delete template.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      const payload = {
        templateId: selectedTemplate.id,
        recipient: sendEmailData.recipient,
        variables: sendEmailData.variables,
      };
      await EmployeeAPI.sendEmail(payload);
      setShowSendModal(false);
      setSendEmailData({ recipient: '', variables: {} });
      setSelectedTemplate(null);
      setError(null);
    } catch (err) {
      setError('Failed to send email.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = () => {
    try {
      setLoading(true);
      if (editingDept) {
        setDepartments((prev) =>
          prev.map((d) => (d.id === editingDept.id ? { ...d, name: newDepartment } : d))
        );
        setEditingDept(null);
      } else {
        const newId = departments.length ? Math.max(...departments.map((d) => d.id)) + 1 : 1;
        setDepartments((prev) => [...prev, { id: newId, name: newDepartment }]);
      }
      setShowAddDeptModal(false);
      setNewDepartment('');
      setError(null);
    } catch (err) {
      setError('Failed to add department.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDesignation = () => {
    try {
      setLoading(true);
      if (editingDesig) {
        setDesignations((prev) =>
          prev.map((d) => (d.id === editingDesig.id ? { ...d, ...newDesignation } : d))
        );
        setEditingDesig(null);
      } else {
        const newId = designations.length ? Math.max(...designations.map((d) => d.id)) + 1 : 1;
        setDesignations((prev) => [...prev, { id: newId, ...newDesignation }]);
      }
      setShowAddDesigModal(false);
      setNewDesignation({ name: '', dept: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add designation.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setShowSendModal(true);
  };

  const placeholderHtml = '<p>Dear {{name}},</p><p>Welcome to CaerusIT...</p>';

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: '32px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a1a1a',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '16px',
      color: '#666666',
      margin: 0,
    },
    roleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    roleLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#666666',
    },
    roleSelect: {
      padding: '10px 16px',
      fontSize: '14px',
      backgroundColor: '#f8fafc',
      color: '#1a1a1a',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    tabsWrapper: {
      borderBottom: '1px solid #e2e8f0',
      marginBottom: '32px',
    },
    tabsContainer: {
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
    },
    tab: {
      padding: '14px 24px',
      fontSize: '15px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      borderRadius: '8px 8px 0 0',
    },
    content: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      minHeight: '400px',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '12px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1a1a1a',
      margin: 0,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
    },
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '20px',
      transition: 'box-shadow 0.2s, transform 0.2s',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    typeBadge: {
      padding: '4px 8px',
      backgroundColor: '#f97316',
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: '600',
      borderRadius: '20px',
      textTransform: 'capitalize',
    },
    cardActions: {
      display: 'flex',
      gap: '8px',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: '8px',
      lineHeight: '1.4',
    },
    cardSubtext: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '12px',
    },
    variablesRow: {
      marginBottom: '16px',
    },
    variableLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      marginBottom: '8px',
      display: 'block',
    },
    variableChips: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
    },
    variableChip: {
      padding: '4px 8px',
      backgroundColor: '#fed7aa',
      color: '#92400e',
      fontSize: '11px',
      fontFamily: 'monospace',
      borderRadius: '6px',
    },
    cardFooter: {
      display: 'flex',
      gap: '12px',
      marginTop: '16px',
      justifyContent: 'space-between',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
    },
    modalSmall: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    },
    modalMedium: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '600px',
      maxHeight: '85vh',
      overflow: 'auto',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    },
    modalLarge: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '900px',
      maxHeight: '85vh',
      overflow: 'auto',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '1px solid #e2e8f0',
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1a1a1a',
      margin: 0,
    },
    modalBody: {
      padding: '20px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      outline: 'none',
      backgroundColor: '#f8fafc',
    },
    editorGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '20px',
      marginBottom: '20px',
    },
    editorSection: {
      display: 'flex',
      flexDirection: 'column',
    },
    toolbar: {
      display: 'flex',
      gap: '8px',
      padding: '10px',
      backgroundColor: '#f8fafc',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      borderBottom: '1px solid #e2e8f0',
      marginBottom: '-1px',
    },
    toolbarDivider: {
      color: '#e2e8f0',
      alignSelf: 'center',
    },
    editor: {
      width: '100%',
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #e2e8f0',
      borderTop: 'none',
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
      outline: 'none',
      fontFamily: 'serif',
      resize: 'none',
      minHeight: '200px',
      lineHeight: '1.6',
      backgroundColor: '#f8fafc',
      boxSizing: 'border-box',
      overflow: 'auto',
    },
    variablesPalette: {
      display: 'flex',
      flexDirection: 'column',
    },
    variableBox: {
      padding: '16px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
    },
    paletteHint: {
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '12px',
    },
    variableInsertBtn: {
      width: '100%',
      padding: '10px',
      marginBottom: '8px',
      textAlign: 'left',
    },
    customVarSection: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #e2e8f0',
    },
    customVarInput: {
      flex: '1',
      padding: '10px',
      fontSize: '13px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      outline: 'none',
      backgroundColor: '#f8fafc',
    },
    usedVariables: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '12px',
      backgroundColor: '#fed7aa',
      borderRadius: '8px',
    },
    usedChip: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 10px',
      backgroundColor: '#f97316',
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: '600',
      borderRadius: '6px',
      cursor: 'pointer',
    },
    previewSection: {
      paddingTop: '16px',
    },
    previewBox: {
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
    },
    previewSubject: {
      fontSize: '14px',
      color: '#1a1a1a',
      marginBottom: '12px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e2e8f0',
    },
    previewBody: {
      fontSize: '14px',
      color: '#1a1a1a',
    },
    previewContent: {
      marginTop: '12px',
      padding: '16px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      minHeight: '100px',
      lineHeight: '1.6',
      border: '1px solid #e2e8f0',
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      padding: '20px',
      borderTop: '1px solid #e2e8f0',
      flexWrap: 'wrap',
    },
    errorBox: {
      padding: '16px',
      backgroundColor: '#fee2e2',
      color: theme.colors.error,
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #fecaca',
    },
    loader: {
      padding: '20px',
    },
    variableInputGroup: {
      marginBottom: '16px',
    },
    variableInputLabel: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#6b7280',
      marginBottom: '6px',
    },
    viewOnlyBadge: {
      padding: '8px 12px',
      backgroundColor: '#f1f5f9',
      color: '#6b7280',
      fontSize: '12px',
      fontWeight: '600',
      borderRadius: '6px',
    },
  };

  const placeholderStyle = {
    ...styles.editor,
    color: '#9ca3af',
    fontStyle: 'italic',
    cursor: 'text',
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Configuration</h1>
          <p style={styles.subtitle}>Manage templates, departments, and designations</p>
        </div>
        <div style={styles.roleSection}>
          <span style={styles.roleLabel}>Role:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            style={styles.roleSelect}
            className="focus:outline-none"
          >
            <option value="ADMIN">Admin</option>
            <option value="HR">HR</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={styles.errorBox} className="flex items-center gap-2">
          <AlertCircle size={20} color={theme.colors.error} />
          <span>{error}</span>
        </div>
      )}
      {loading && (
        <div style={styles.loader} className="flex justify-center">
          <Loader size={24} color={theme.colors.primary} />
        </div>
      )}

      <div style={styles.tabsWrapper}>
        <div style={styles.tabsContainer} className="flex flex-col sm:flex-row">
          <Button
            onClick={() => setActiveTab('templates')}
            variant={activeTab === 'templates' ? 'primary' : 'secondary'}
            style={styles.tab}
          >
            <Mail size={20} />
            Email Templates
          </Button>
          <Button
            onClick={() => setActiveTab('departments')}
            variant={activeTab === 'departments' ? 'primary' : 'secondary'}
            style={styles.tab}
          >
            <Building2 size={20} />
            Departments
          </Button>
          <Button
            onClick={() => setActiveTab('designations')}
            variant={activeTab === 'designations' ? 'primary' : 'secondary'}
            style={styles.tab}
          >
            <Briefcase size={20} />
            Designations
          </Button>
        </div>
      </div>

      <div style={styles.content}>
        {activeTab === 'templates' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Email Templates</h2>
              {isAdmin && (
                <Button
                  onClick={() => setShowTemplateModal(true)}
                  variant="primary"
                  icon={<Plus size={18} />}
                >
                  + New Template
                </Button>
              )}
            </div>
            <div style={styles.grid}>
              {templates.map((template) => (
                <div key={template.id} style={styles.card} className="hover:shadow-lg">
                  <div style={styles.cardHeader}>
                    <span style={styles.typeBadge}>{template.type}</span>
                    {isAdmin && (
                      <div style={styles.cardActions}>
                        <Button
                          variant="icon"
                          onClick={() => {
                            setNewTemplate({
                              ...template,
                              allowedVariables: template.allowedVariables || extractVars(template.body)
                            });
                            setShowTemplateModal(true);
                          }}
                          icon={<Edit2 size={16} />}
                        />
                        <Button
                          variant="icon"
                          onClick={() => handleDeleteTemplate(template.id)}
                          icon={<Trash2 size={16} color={theme.colors.error} />}
                        />
                      </div>
                    )}
                  </div>
                  <h3 style={styles.cardTitle}>{template.subject}</h3>
                  <div style={styles.variablesRow}>
                    <span style={styles.variableLabel}>Variables:</span>
                    <div style={styles.variableChips}>
                      {template.allowedVariables.map((v, i) => (
                        <span key={i} style={styles.variableChip}>
                          {`{{${v}}}`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={styles.cardFooter}>
                    <Button
                      onClick={() => {
                        setSelectedTemplate(template);
                        handlePreview();
                      }}
                      variant="secondary"
                      icon={<Eye size={16} />}
                    >
                      Preview
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowSendModal(true);
                      }}
                      variant="primary"
                      icon={<Send size={16} />}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Departments</h2>
              {isAdmin && (
                <Button
                  onClick={() => {
                    setEditingDept(null);
                    setNewDepartment('');
                    setShowAddDeptModal(true);
                  }}
                  variant="primary"
                  icon={<Plus size={18} />}
                >
                  Add Department
                </Button>
              )}
            </div>
            <div style={styles.grid}>
              {departments.map((dept) => (
                <div key={dept.id} style={styles.card} className="hover:shadow-lg">
                  <div style={styles.cardHeader}>
                    {isAdmin && (
                      <div style={styles.cardActions}>
                        <Button
                          variant="icon"
                          onClick={() => {
                            setEditingDept(dept);
                            setNewDepartment(dept.name);
                            setShowAddDeptModal(true);
                          }}
                          icon={<Edit2 size={16} />}
                        />
                        <Button
                          variant="icon"
                          onClick={() => setDepartments((prev) => prev.filter((d) => d.id !== dept.id))}
                          icon={<Trash2 size={16} color={theme.colors.error} />}
                        />
                      </div>
                    )}
                  </div>
                  <h3 style={styles.cardTitle}>{dept.name}</h3>
                  <div style={styles.cardFooter}>
                    {!isAdmin && <span style={styles.viewOnlyBadge}>View Only</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'designations' && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Designations</h2>
              {isAdmin && (
                <Button
                  onClick={() => {
                    setEditingDesig(null);
                    setNewDesignation({ name: '', dept: '' });
                    setShowAddDesigModal(true);
                  }}
                  variant="primary"
                  icon={<Plus size={18} />}
                >
                  Add Designation
                </Button>
              )}
            </div>
            <div style={styles.grid}>
              {designations.map((desig) => (
                <div key={desig.id} style={styles.card} className="hover:shadow-lg">
                  <div style={styles.cardHeader}>
                    {isAdmin && (
                      <div style={styles.cardActions}>
                        <Button
                          variant="icon"
                          onClick={() => {
                            setEditingDesig(desig);
                            setNewDesignation({ name: desig.name, dept: desig.dept });
                            setShowAddDesigModal(true);
                          }}
                          icon={<Edit2 size={16} />}
                        />
                        <Button
                          variant="icon"
                          onClick={() => setDesignations((prev) => prev.filter((d) => d.id !== desig.id))}
                          icon={<Trash2 size={16} color={theme.colors.error} />}
                        />
                      </div>
                    )}
                  </div>
                  <h3 style={styles.cardTitle}>{desig.name}</h3>
                  <p style={styles.cardSubtext}>{desig.dept}</p>
                  <div style={styles.cardFooter}>
                    {!isAdmin && <span style={styles.viewOnlyBadge}>View Only</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showTemplateModal && (
        <div style={styles.modalOverlay} onClick={() => setShowTemplateModal(false)}>
          <div style={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {newTemplate.id ? 'Edit Email Template' : 'Create Email Template'}
              </h3>
              <Button
                variant="icon"
                onClick={() => setShowTemplateModal(false)}
                icon={<X size={24} />}
              />
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Template Type *</label>
                <input
                  type="text"
                  placeholder="e.g., Onboarding, Offboarding"
                  value={newTemplate.type}
                  onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
                  style={styles.input}
                  className="focus:outline-none focus:border-orange-500"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Subject *</label>
                <input
                  type="text"
                  placeholder="Welcome ON-BOARD {{name}}!"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  style={styles.input}
                  className="focus:outline-none focus:border-orange-500"
                />
              </div>
              <div style={styles.editorGrid}>
                <div style={styles.editorSection}>
                  <label style={styles.label}>Email Body (HTML) *</label>
                  <div style={styles.toolbar}>
                    <Button variant="secondary" size="small" onClick={() => toggleTag('b')}>
                      B
                    </Button>
                    <Button variant="secondary" size="small" onClick={() => toggleTag('i')}>
                      I
                    </Button>
                    <Button variant="secondary" size="small" onClick={() => toggleTag('u')}>
                      U
                    </Button>
                    <span style={styles.toolbarDivider}>|</span>
                    <Button variant="secondary" size="small" onClick={insertLink}>
                      Link
                    </Button>
                  </div>
                  {newTemplate.body ? (
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      style={styles.editor}
                      dangerouslySetInnerHTML={{ __html: newTemplate.body }}
                      onInput={(e) => {
                        const html = e.target.innerHTML;
                        setNewTemplate(prev => ({
                          ...prev,
                          body: html,
                          allowedVariables: extractVars(html)
                        }));
                      }}
                    />
                  ) : (
                    <div
                      style={placeholderStyle}
                      dangerouslySetInnerHTML={{ __html: placeholderHtml }}
                      onClick={() => setNewTemplate(prev => ({ ...prev, body: '<p><br></p>', allowedVariables: [] }))}
                    />
                  )}
                </div>
                <div style={styles.variablesPalette}>
                  <label style={styles.label}>Insert Variables</label>
                  <div style={styles.variableBox}>
                    <p style={styles.paletteHint}>Available Variables:</p>
                    {[
                      'name',
                      'empCode',
                      'email',
                      'department',
                      'designation',
                      'joiningDate',
                      'leavingDate',
                      'newDesignation',
                    ].map((v) => (
                      <Button
                        key={v}
                        variant="secondary"
                        style={styles.variableInsertBtn}
                        onClick={() => insertVariable(v)}
                      >
                        {`{{${v}}}`}
                      </Button>
                    ))}
                    <div style={styles.customVarSection}>
                      <input
                        type="text"
                        placeholder="Custom variable"
                        style={styles.customVarInput}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const value = e.target.value.trim();
                            if (value) {
                              insertVariable(value);
                            }
                            e.target.value = '';
                          }
                        }}
                        className="focus:outline-none focus:border-orange-500"
                      />
                      <Button variant="primary" size="small" icon={<Plus size={16} />} />
                    </div>
                  </div>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Used Variables</label>
                <div style={styles.usedVariables}>
                  {newTemplate.allowedVariables.map((v) => (
                    <span key={v} style={styles.usedChip}>
                      {v} <X size={14} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setShowTemplateModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  newTemplate.id
                    ? handleUpdateTemplate(newTemplate.id, newTemplate)
                    : handleCreateTemplate()
                }
              >
                Save Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {showSendModal && selectedTemplate && (
        <div style={styles.modalOverlay} onClick={() => setShowSendModal(false)}>
          <div style={styles.modalMedium} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Email Preview</h3>
              <Button
                variant="icon"
                onClick={() => setShowSendModal(false)}
                icon={<X size={24} />}
              />
            </div>
            <div style={styles.modalBody}>
              <div style={styles.previewSection}>
                <div style={styles.previewBox}>
                  <div style={styles.previewSubject}>
                    <strong>Subject:</strong>{' '}
                    {selectedTemplate.subject.replace(/{{(\w+)}}/g, (match, key) =>
                      sendEmailData.variables[key] || match
                    )}
                  </div>
                  <div style={styles.previewBody}>
                    <strong>Body:</strong>
                    <div
                      style={styles.previewContent}
                      dangerouslySetInnerHTML={{
                        __html: selectedTemplate.body.replace(
                          /{{(\w+)}}/g,
                          (match, key) => sendEmailData.variables[key] || match
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Recipient Email *</label>
                <input
                  type="email"
                  placeholder="employee@example.com"
                  value={sendEmailData.recipient}
                  onChange={(e) => setSendEmailData({ ...sendEmailData, recipient: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  style={styles.input}
                  className="focus:outline-none focus:border-orange-500"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Fill Variable Data:</label>
                {selectedTemplate.allowedVariables.map((variable) => (
                  <div key={variable} style={styles.variableInputGroup}>
                    <label style={styles.variableInputLabel}>{variable} *</label>
                    <input
                      type="text"
                      placeholder={`Enter ${variable}`}
                      value={sendEmailData.variables[variable] || ''}
                      onChange={(e) =>
                        setSendEmailData({
                          ...sendEmailData,
                          variables: { ...sendEmailData.variables, [variable]: e.target.value },
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') e.preventDefault();
                      }}
                      style={styles.input}
                      className="focus:outline-none focus:border-orange-500"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setShowSendModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSendEmail} icon={<Send size={16} />}>
                Send Email
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAddDeptModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddDeptModal(false)}>
          <div style={styles.modalSmall} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingDept ? 'Edit Department' : 'Add Department'}</h3>
              <Button
                variant="icon"
                onClick={() => setShowAddDeptModal(false)}
                icon={<X size={24} />}
              />
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Department Name *</label>
                <input
                  type="text"
                  placeholder="Enter department name"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  style={styles.input}
                  className="focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setShowAddDeptModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddDepartment}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {showAddDesigModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddDesigModal(false)}>
          <div style={styles.modalSmall} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingDesig ? 'Edit Designation' : 'Add Designation'}</h3>
              <Button
                variant="icon"
                onClick={() => setShowAddDesigModal(false)}
                icon={<X size={24} />}
              />
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Designation Name *</label>
                <input
                  type="text"
                  placeholder="Enter designation name"
                  value={newDesignation.name}
                  onChange={(e) => setNewDesignation({ ...newDesignation, name: e.target.value })}
                  style={styles.input}
                  className="focus:outline-none focus:border-orange-500"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Department *</label>
                <select
                  value={newDesignation.dept}
                  onChange={(e) => setNewDesignation({ ...newDesignation, dept: e.target.value })}
                  style={styles.input}
                  className="focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <Button variant="secondary" onClick={() => setShowAddDesigModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddDesignation}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConfig;
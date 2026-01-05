'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const JoinPageEditor = () => {
  const [joinText, setJoinText] = useState({ blocks: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch join text on mount
  useEffect(() => {
    fetchJoinText();
  }, []);

  const fetchJoinText = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/jointext');
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Failed to load join text');
        return;
      }

      setJoinText(data.joinText || { blocks: [] });
    } catch (error) {
      console.error('Error fetching join text:', error);
      setError('Failed to load join text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Get auth credentials from sessionStorage
      const username = sessionStorage.getItem('settings_username');
      const password = sessionStorage.getItem('settings_password');
      if (!username || !password) {
        setError('You must be logged in to save changes');
        return;
      }

      const authHeader = 'Basic ' + btoa(`${username}:${password}`);

      const response = await fetch('/api/jointext', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify(joinText)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Failed to save join text');
        return;
      }

      setSuccess('Join text saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving join text:', error);
      setError('Failed to save join text. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSeedJoinText = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Get auth credentials from sessionStorage
      const username = sessionStorage.getItem('settings_username');
      const password = sessionStorage.getItem('settings_password');
      if (!username || !password) {
        setError('You must be logged in to seed data');
        return;
      }

      const authHeader = 'Basic ' + btoa(`${username}:${password}`);

      const response = await fetch('/api/jointext/seed', {
        method: 'POST',
        headers: {
          'Authorization': authHeader
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Failed to seed join text');
        return;
      }

      setSuccess('Join text seeded successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Refresh the data
      await fetchJoinText();
    } catch (error) {
      console.error('Error seeding join text:', error);
      setError('Failed to seed join text. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: type,
      order: joinText.blocks.length,
      data: getDefaultBlockData(type)
    };

    setJoinText(prev => ({
      blocks: [...prev.blocks, newBlock]
    }));
  };

  const getDefaultBlockData = (type) => {
    switch (type) {
      case 'heading':
        return {
          floatingText: '',
          highlightText: '',
          mainText: ''
        };
      case 'text':
        return { content: '' };
      case 'text-highlight':
        return { content: '' };
      case 'list':
        return {
          sectionTitle: '',
          icon: 'work',
          title: '',
          items: ['']
        };
      case 'two-column-list':
        return {
          sectionTitle: '',
          icon: 'work',
          leftColumn: { title: '', items: [''] },
          rightColumn: { title: '', items: [''] }
        };
      case 'schedule':
        return {
          sectionTitle: '',
          icon: 'schedule',
          items: [{ day: '', time: '', activity: '' }]
        };
      case 'contact':
        return {
          sectionTitle: '',
          icon: 'contact',
          description: '',
          discord: { label: '', url: '' },
          email: { label: '', url: '' },
          footer: ''
        };
      default:
        return {};
    }
  };

  const updateBlock = (blockId, newData) => {
    setJoinText(prev => ({
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, data: newData } : block
      )
    }));
  };

  const deleteBlock = (blockId) => {
    setJoinText(prev => ({
      blocks: prev.blocks.filter(block => block.id !== blockId)
        .map((block, index) => ({ ...block, order: index }))
    }));
  };

  const moveBlock = (blockId, direction) => {
    setJoinText(prev => {
      const blocks = [...prev.blocks];
      const index = blocks.findIndex(b => b.id === blockId);
      
      if (direction === 'up' && index > 0) {
        [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
      } else if (direction === 'down' && index < blocks.length - 1) {
        [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
      }
      
      return {
        blocks: blocks.map((block, idx) => ({ ...block, order: idx }))
      };
    });
  };

  const renderBlockEditor = (block) => {
    const { id, type, data } = block;

    switch (type) {
      case 'heading':
        return (
          <Box>
            <TextField
              fullWidth
              label="Floating Text"
              value={data.floatingText || ''}
              onChange={(e) => updateBlock(id, { ...data, floatingText: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Highlight Text"
              value={data.highlightText || ''}
              onChange={(e) => updateBlock(id, { ...data, highlightText: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Main Text"
              value={data.mainText || ''}
              onChange={(e) => updateBlock(id, { ...data, mainText: e.target.value })}
            />
          </Box>
        );

      case 'text':
      case 'text-highlight':
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Content"
            value={data.content || ''}
            onChange={(e) => updateBlock(id, { ...data, content: e.target.value })}
          />
        );

      case 'list':
        return (
          <Box>
            <TextField
              fullWidth
              label="Section Title"
              value={data.sectionTitle || ''}
              onChange={(e) => updateBlock(id, { ...data, sectionTitle: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="List Title"
              value={data.title || ''}
              onChange={(e) => updateBlock(id, { ...data, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            {(data.items || []).map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label={`Item ${idx + 1}`}
                  value={item}
                  onChange={(e) => {
                    const newItems = [...data.items];
                    newItems[idx] = e.target.value;
                    updateBlock(id, { ...data, items: newItems });
                  }}
                />
                <IconButton
                  onClick={() => {
                    const newItems = data.items.filter((_, i) => i !== idx);
                    updateBlock(id, { ...data, items: newItems });
                  }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => updateBlock(id, { ...data, items: [...(data.items || []), ''] })}
            >
              Add Item
            </Button>
          </Box>
        );

      case 'two-column-list':
        return (
          <Box>
            <TextField
              fullWidth
              label="Section Title"
              value={data.sectionTitle || ''}
              onChange={(e) => updateBlock(id, { ...data, sectionTitle: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>Left Column</Typography>
                <TextField
                  fullWidth
                  label="Column Title"
                  value={data.leftColumn?.title || ''}
                  onChange={(e) => updateBlock(id, {
                    ...data,
                    leftColumn: { ...data.leftColumn, title: e.target.value }
                  })}
                  sx={{ mb: 2 }}
                />
                {(data.leftColumn?.items || []).map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      label={`Item ${idx + 1}`}
                      value={item}
                      onChange={(e) => {
                        const newItems = [...(data.leftColumn?.items || [])];
                        newItems[idx] = e.target.value;
                        updateBlock(id, {
                          ...data,
                          leftColumn: { ...data.leftColumn, items: newItems }
                        });
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        const newItems = (data.leftColumn?.items || []).filter((_, i) => i !== idx);
                        updateBlock(id, {
                          ...data,
                          leftColumn: { ...data.leftColumn, items: newItems }
                        });
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => updateBlock(id, {
                    ...data,
                    leftColumn: {
                      ...data.leftColumn,
                      items: [...(data.leftColumn?.items || []), '']
                    }
                  })}
                >
                  Add Item
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>Right Column</Typography>
                <TextField
                  fullWidth
                  label="Column Title"
                  value={data.rightColumn?.title || ''}
                  onChange={(e) => updateBlock(id, {
                    ...data,
                    rightColumn: { ...data.rightColumn, title: e.target.value }
                  })}
                  sx={{ mb: 2 }}
                />
                {(data.rightColumn?.items || []).map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      label={`Item ${idx + 1}`}
                      value={item}
                      onChange={(e) => {
                        const newItems = [...(data.rightColumn?.items || [])];
                        newItems[idx] = e.target.value;
                        updateBlock(id, {
                          ...data,
                          rightColumn: { ...data.rightColumn, items: newItems }
                        });
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        const newItems = (data.rightColumn?.items || []).filter((_, i) => i !== idx);
                        updateBlock(id, {
                          ...data,
                          rightColumn: { ...data.rightColumn, items: newItems }
                        });
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => updateBlock(id, {
                    ...data,
                    rightColumn: {
                      ...data.rightColumn,
                      items: [...(data.rightColumn?.items || []), '']
                    }
                  })}
                >
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </Box>
        );

      case 'schedule':
        return (
          <Box>
            <TextField
              fullWidth
              label="Section Title"
              value={data.sectionTitle || ''}
              onChange={(e) => updateBlock(id, { ...data, sectionTitle: e.target.value })}
              sx={{ mb: 2 }}
            />
            {(data.items || []).map((item, idx) => (
              <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Day"
                      value={item.day || ''}
                      onChange={(e) => {
                        const newItems = [...(data.items || [])];
                        newItems[idx] = { ...newItems[idx], day: e.target.value };
                        updateBlock(id, { ...data, items: newItems });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Time"
                      value={item.time || ''}
                      onChange={(e) => {
                        const newItems = [...(data.items || [])];
                        newItems[idx] = { ...newItems[idx], time: e.target.value };
                        updateBlock(id, { ...data, items: newItems });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Activity"
                      value={item.activity || ''}
                      onChange={(e) => {
                        const newItems = [...(data.items || [])];
                        newItems[idx] = { ...newItems[idx], activity: e.target.value };
                        updateBlock(id, { ...data, items: newItems });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      onClick={() => {
                        const newItems = (data.items || []).filter((_, i) => i !== idx);
                        updateBlock(id, { ...data, items: newItems });
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => updateBlock(id, {
                ...data,
                items: [...(data.items || []), { day: '', time: '', activity: '' }]
              })}
            >
              Add Schedule Item
            </Button>
          </Box>
        );

      case 'contact':
        return (
          <Box>
            <TextField
              fullWidth
              label="Section Title"
              value={data.sectionTitle || ''}
              onChange={(e) => updateBlock(id, { ...data, sectionTitle: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={data.description || ''}
              onChange={(e) => updateBlock(id, { ...data, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>Discord</Typography>
            <TextField
              fullWidth
              label="Discord Label"
              value={data.discord?.label || ''}
              onChange={(e) => updateBlock(id, {
                ...data,
                discord: { ...data.discord, label: e.target.value }
              })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Discord URL"
              value={data.discord?.url || ''}
              onChange={(e) => updateBlock(id, {
                ...data,
                discord: { ...data.discord, url: e.target.value }
              })}
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>Email</Typography>
            <TextField
              fullWidth
              label="Email Label"
              value={data.email?.label || ''}
              onChange={(e) => updateBlock(id, {
                ...data,
                email: { ...data.email, label: e.target.value }
              })}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Email URL"
              value={data.email?.url || ''}
              onChange={(e) => updateBlock(id, {
                ...data,
                email: { ...data.email, url: e.target.value }
              })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Footer Text"
              value={data.footer || ''}
              onChange={(e) => updateBlock(id, { ...data, footer: e.target.value })}
            />
          </Box>
        );

      default:
        return <Typography>Unknown block type: {type}</Typography>;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Join Page Editor</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchJoinText}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={handleSeedJoinText}
            disabled={saving}
          >
            Seed Join Data
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Add Block Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Block</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => addBlock('heading')}>+ Heading</Button>
          <Button variant="outlined" onClick={() => addBlock('text')}>+ Text</Button>
          <Button variant="outlined" onClick={() => addBlock('text-highlight')}>+ Highlight Text</Button>
          <Button variant="outlined" onClick={() => addBlock('list')}>+ List</Button>
          <Button variant="outlined" onClick={() => addBlock('two-column-list')}>+ Two Column List</Button>
          <Button variant="outlined" onClick={() => addBlock('schedule')}>+ Schedule</Button>
          <Button variant="outlined" onClick={() => addBlock('contact')}>+ Contact</Button>
        </Box>
      </Paper>

      {/* Blocks List */}
      {joinText.blocks && joinText.blocks.length === 0 && (
        <Alert severity="info">
          No blocks yet. Add your first block using the buttons above.
        </Alert>
      )}

      {joinText.blocks && joinText.blocks.map((block, index) => (
        <Card key={block.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">
                  Block {index + 1}: {block.type}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {block.id}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUpIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === joinText.blocks.length - 1}
                >
                  <ArrowDownIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => deleteBlock(block.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {renderBlockEditor(block)}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default JoinPageEditor;

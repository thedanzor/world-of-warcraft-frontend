'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

export default function JoinPageEditor() {
  const [joinText, setJoinText] = useState({ 
    hero: {
      title: '',
      subtitle: '',
      badges: []
    },
    sections: [] 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchJoinText();
  }, []);

  const fetchJoinText = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/jointext', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });
      const data = await response.json();

      console.log('📥 Fetched join text:', data);
      console.log('📦 Sections count:', data.joinText?.sections?.length || 0);

      if (!response.ok) {
        setError(data.message || data.error || 'Failed to load join text');
        return;
      }

      setJoinText(data.joinText || { 
        hero: {
          title: '',
          subtitle: '',
          badges: []
        },
        sections: [] 
      });
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

      await fetchJoinText();
    } catch (error) {
      console.error('Error seeding join text:', error);
      setError('Failed to seed join text. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Section management
  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      order: (joinText.sections || []).length,
      blocks: []
    };
    setJoinText(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));
  };

  const removeSection = (sectionId) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || [])
        .filter(s => s.id !== sectionId)
        .map((s, index) => ({ ...s, order: index }))
    }));
  };

  const moveSectionUp = (sectionId) => {
    setJoinText(prev => {
      const sections = [...(prev.sections || [])];
      const index = sections.findIndex(s => s.id === sectionId);
      if (index <= 0) return prev;
      [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
      return {
        ...prev,
        sections: sections.map((s, i) => ({ ...s, order: i }))
      };
    });
  };

  const moveSectionDown = (sectionId) => {
    setJoinText(prev => {
      const sections = [...(prev.sections || [])];
      const index = sections.findIndex(s => s.id === sectionId);
      if (index < 0 || index >= sections.length - 1) return prev;
      [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
      return {
        ...prev,
        sections: sections.map((s, i) => ({ ...s, order: i }))
      };
    });
  };

  // Block management
  const addBlock = (sectionId, type = 'text', layout = 'full') => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        
        const newBlock = {
          id: `block-${Date.now()}`,
          order: (section.blocks || []).length,
          type,
          layout,
          title: '',
          ...(type === 'text' ? { content: '' } : {}),
          ...(type === 'list' ? { items: [''] } : {}),
          ...(type === 'contact' ? { discord: { label: '', url: '' }, email: { label: '', url: '' } } : {})
        };
        
        return {
          ...section,
          blocks: [...(section.blocks || []), newBlock]
        };
      })
    }));
  };

  const removeBlock = (sectionId, blockId) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: (section.blocks || [])
            .filter(b => b.id !== blockId)
            .map((b, index) => ({ ...b, order: index }))
        };
      })
    }));
  };

  const updateBlock = (sectionId, blockId, updates) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: (section.blocks || []).map(block =>
            block.id === blockId ? { ...block, ...updates } : block
          )
        };
      })
    }));
  };

  const updateListItem = (sectionId, blockId, itemIndex, value) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: (section.blocks || []).map(block => {
            if (block.id !== blockId) return block;
            const newItems = [...(block.items || [])];
            newItems[itemIndex] = value;
            return { ...block, items: newItems };
          })
        };
      })
    }));
  };

  const addListItem = (sectionId, blockId) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: (section.blocks || []).map(block => {
            if (block.id !== blockId) return block;
            return { ...block, items: [...(block.items || []), ''] };
          })
        };
      })
    }));
  };

  const removeListItem = (sectionId, blockId, itemIndex) => {
    setJoinText(prev => ({
      ...prev,
      sections: (prev.sections || []).map(section => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          blocks: (section.blocks || []).map(block => {
            if (block.id !== blockId) return block;
            return {
              ...block,
              items: (block.items || []).filter((_, i) => i !== itemIndex)
            };
          })
        };
      })
    }));
  };

  // Render block editor
  const renderBlockEditor = (section, block) => {
    return (
      <Card key={block.id} sx={{ mb: 2, border: '2px solid', borderColor: 'primary.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Block: {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
            </Typography>
            <Box>
              <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                <InputLabel>Layout</InputLabel>
                <Select
                  value={block.layout}
                  label="Layout"
                  onChange={(e) => updateBlock(section.id, block.id, { layout: e.target.value })}
                >
                  <MenuItem value="full">Full Width</MenuItem>
                  <MenuItem value="left">Left Half</MenuItem>
                  <MenuItem value="right">Right Half</MenuItem>
                </Select>
              </FormControl>
              <IconButton 
                onClick={() => removeBlock(section.id, block.id)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Title"
            value={block.title}
            onChange={(e) => updateBlock(section.id, block.id, { title: e.target.value })}
            sx={{ mb: 2 }}
          />

          {block.type === 'text' && (
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={4}
              value={block.content}
              onChange={(e) => updateBlock(section.id, block.id, { content: e.target.value })}
            />
          )}

          {block.type === 'list' && (
            <Box>
              {(block.items || []).map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Item ${index + 1}`}
                    value={item}
                    onChange={(e) => updateListItem(section.id, block.id, index, e.target.value)}
                  />
                  <IconButton
                    onClick={() => removeListItem(section.id, block.id, index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addListItem(section.id, block.id)}
                size="small"
              >
                Add Item
              </Button>
            </Box>
          )}

          {block.type === 'contact' && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Discord</Typography>
              <TextField
                fullWidth
                label="Discord Label"
                value={block.discord?.label || ''}
                onChange={(e) => updateBlock(section.id, block.id, {
                  discord: { ...block.discord, label: e.target.value }
                })}
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Discord URL"
                value={block.discord?.url || ''}
                onChange={(e) => updateBlock(section.id, block.id, {
                  discord: { ...block.discord, url: e.target.value }
                })}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Email</Typography>
              <TextField
                fullWidth
                label="Email Label"
                value={block.email?.label || ''}
                onChange={(e) => updateBlock(section.id, block.id, {
                  email: { ...block.email, label: e.target.value }
                })}
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Email URL"
                value={block.email?.url || ''}
                onChange={(e) => updateBlock(section.id, block.id, {
                  email: { ...block.email, url: e.target.value }
                })}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render preview
  const renderPreview = (section, block) => {
    const widthStyle = block.layout === 'full' ? '100%' : '50%';
    
    return (
      <Box 
        key={block.id}
        sx={{ 
          width: widthStyle,
          p: 2,
          border: '1px dashed rgba(255, 255, 255, 0.2)',
          borderRadius: 1,
          minHeight: '100px'
        }}
      >
        <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
          {block.title || 'Untitled'}
        </Typography>
        
        {block.type === 'text' && (
          <Typography variant="body2">
            {block.content || 'No content yet...'}
          </Typography>
        )}
        
        {block.type === 'list' && (
          <Box component="ul" sx={{ pl: 2 }}>
            {(block.items || []).map((item, i) => (
              <li key={i}><Typography variant="body2">{item || 'Empty item'}</Typography></li>
            ))}
          </Box>
        )}
        
        {block.type === 'contact' && (
          <Box>
            {block.discord?.label && (
              <Typography variant="body2">Discord: {block.discord.label}</Typography>
            )}
            {block.email?.label && (
              <Typography variant="body2">Email: {block.email.label}</Typography>
            )}
          </Box>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
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

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          variant="outlined"
          onClick={handleSeedJoinText}
          disabled={saving}
        >
          Seed Example Data
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addSection}
        >
          Add Section
        </Button>
      </Box>

      {/* Hero Section Editor */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(255, 215, 0, 0.05)' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Hero Section</Typography>
        
        <TextField
          fullWidth
          label="Hero Title"
          value={joinText.hero?.title || ''}
          onChange={(e) => setJoinText(prev => ({
            ...prev,
            hero: { ...prev.hero, title: e.target.value }
          }))}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Hero Subtitle"
          multiline
          rows={2}
          value={joinText.hero?.subtitle || ''}
          onChange={(e) => setJoinText(prev => ({
            ...prev,
            hero: { ...prev.hero, subtitle: e.target.value }
          }))}
          sx={{ mb: 3 }}
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" sx={{ mb: 2 }}>Hero Badges</Typography>
        {(joinText.hero?.badges || []).map((badge, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <TextField
              label={`Badge ${index + 1} Label`}
              value={badge.label}
              onChange={(e) => {
                const newBadges = [...(joinText.hero?.badges || [])];
                newBadges[index] = { ...newBadges[index], label: e.target.value };
                setJoinText(prev => ({
                  ...prev,
                  hero: { ...prev.hero, badges: newBadges }
                }));
              }}
              sx={{ flex: 2 }}
            />
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Color</InputLabel>
              <Select
                value={badge.color}
                onChange={(e) => {
                  const newBadges = [...(joinText.hero?.badges || [])];
                  newBadges[index] = { ...newBadges[index], color: e.target.value };
                  setJoinText(prev => ({
                    ...prev,
                    hero: { ...prev.hero, badges: newBadges }
                  }));
                }}
                label="Color"
              >
                <MenuItem value="gold">Gold</MenuItem>
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="green">Green</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              onClick={() => {
                const newBadges = (joinText.hero?.badges || []).filter((_, i) => i !== index);
                setJoinText(prev => ({
                  ...prev,
                  hero: { ...prev.hero, badges: newBadges }
                }));
              }}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            const newBadges = [...(joinText.hero?.badges || []), { label: '', color: 'gold' }];
            setJoinText(prev => ({
              ...prev,
              hero: { ...prev.hero, badges: newBadges }
            }));
          }}
          size="small"
        >
          Add Badge
        </Button>
      </Paper>

      <Typography variant="h5" sx={{ mb: 3 }}>Content Sections</Typography>

      {joinText.sections && joinText.sections.map((section, sectionIndex) => (
        <Paper key={section.id} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Section {sectionIndex + 1}</Typography>
            <Box>
              <IconButton onClick={() => moveSectionUp(section.id)} disabled={sectionIndex === 0}>
                <ArrowUpIcon />
              </IconButton>
              <IconButton onClick={() => moveSectionDown(section.id)} disabled={sectionIndex === (joinText.sections || []).length - 1}>
                <ArrowDownIcon />
              </IconButton>
              <IconButton onClick={() => removeSection(section.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Editor Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>Editor</Typography>
              
              {(section.blocks || []).map(block => renderBlockEditor(section, block))}
              
              {(!section.blocks || section.blocks.length === 0) && (
                <Box sx={{ textAlign: 'center', py: 4, border: '2px dashed', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No blocks yet. Add one to get started.
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addBlock(section.id, 'text', 'full')}
                  size="small"
                  variant="outlined"
                >
                  Add Text
                </Button>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addBlock(section.id, 'list', 'left')}
                  size="small"
                  variant="outlined"
                >
                  Add List
                </Button>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addBlock(section.id, 'contact', 'full')}
                  size="small"
                  variant="outlined"
                >
                  Add Contact
                </Button>
              </Box>
            </Grid>

            {/* Preview Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>Live Preview</Typography>
              <Paper sx={{ p: 2, bgcolor: 'background.default', minHeight: '200px' }}>
                {(!section.blocks || section.blocks.length === 0) ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Add blocks to see preview
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {(section.blocks || []).map(block => renderPreview(section, block))}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      ))}

      {(!joinText.sections || joinText.sections.length === 0) && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No sections yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addSection}
          >
            Add Your First Section
          </Button>
        </Paper>
      )}
    </Box>
  );
}

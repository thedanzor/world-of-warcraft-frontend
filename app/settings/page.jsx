'use client';

/**
 * @file Settings page for admin management
 * @module app/settings/page
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetInfo, setResetInfo] = useState(null);

  // Get Basic Auth header
  const getAuthHeader = () => {
    const username = sessionStorage.getItem('settings_username');
    const password = sessionStorage.getItem('settings_password');
    if (username && password) {
      return 'Basic ' + btoa(`${username}:${password}`);
    }
    return null;
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const authHeader = getAuthHeader();
      if (!authHeader) {
        // Try to get from sessionStorage
        const storedUsername = sessionStorage.getItem('settings_username');
        const storedPassword = sessionStorage.getItem('settings_password');
        if (!storedUsername || !storedPassword) {
          setError('Please login to access settings');
          return;
        }
      }

      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please login again.');
          sessionStorage.removeItem('settings_authenticated');
          sessionStorage.removeItem('settings_username');
          sessionStorage.removeItem('settings_password');
        } else {
          setError(data.message || data.error || 'Failed to load settings');
        }
        return;
      }

      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch settings when component mounts (layout handles authentication)
    const authStatus = sessionStorage.getItem('settings_authenticated');
    if (authStatus === 'true') {
      fetchSettings();
    }
  }, []);

  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Create updates object (excluding protected fields)
      const protectedFields = ['GUILD_NAME', 'GUILD_REALM', 'API_BATTLENET_KEY', 'API_BATTLENET_SECRET', '_id', 'lastUpdated', 'createdAt'];
      const updates = {};
      
      Object.keys(settings).forEach(key => {
        if (!protectedFields.includes(key)) {
          updates[key] = settings[key];
        }
      });

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please login again.');
          sessionStorage.removeItem('settings_authenticated');
        } else {
          setError(data.message || data.error || 'Failed to save settings');
        }
        return;
      }

      setSuccess('Settings saved successfully!');
      // Refresh settings
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenResetDialog = async () => {
    setShowResetDialog(true);
    setResetError('');
    
    // Fetch reset info
    try {
      const response = await fetch('/api/reset/info');
      const data = await response.json();
      if (data.success) {
        setResetInfo(data.info);
      }
    } catch (error) {
      console.error('Error fetching reset info:', error);
    }
  };

  const handleResetDatabase = async () => {
    setResetLoading(true);
    setResetError('');

    try {
      const username = sessionStorage.getItem('settings_username');
      const password = sessionStorage.getItem('settings_password');
      
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResetError(data.message || data.error || 'Failed to reset database');
        return;
      }

      // Clear session and reload
      sessionStorage.clear();
      window.location.href = '/install';
    } catch (error) {
      console.error('Error resetting database:', error);
      setResetError('Failed to reset database. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Alert severity="error">
        {error || 'Failed to load settings. Please refresh the page.'}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          App Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSettings}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
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

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Protected Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          These settings cannot be changed for security reasons.
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Guild Name"
              value={settings.GUILD_NAME || ''}
              disabled
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'text.disabled' }} />,
              }}
              helperText="Cannot be changed"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Guild Realm"
              value={settings.GUILD_REALM || ''}
              disabled
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'text.disabled' }} />,
              }}
              helperText="Cannot be changed"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="API Key"
              value="••••••••••••••••"
              disabled
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'text.disabled' }} />,
              }}
              helperText="Hidden for security - cannot be viewed or changed"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          General Settings
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Region</InputLabel>
              <Select
                value={settings.REGION || 'eu'}
                label="Region"
                onChange={(e) => handleSettingsChange('REGION', e.target.value)}
              >
                <MenuItem value="eu">Europe (EU)</MenuItem>
                <MenuItem value="us">United States (US)</MenuItem>
                <MenuItem value="kr">Korea (KR)</MenuItem>
                <MenuItem value="tw">Taiwan (TW)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="API Parameters"
              value={settings.API_PARAM_REQUIREMENTGS || ''}
              onChange={(e) => handleSettingsChange('API_PARAM_REQUIREMENTGS', e.target.value)}
              helperText="e.g., namespace=profile-eu&locale=en_US"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Guild Requirements
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Level Requirement"
              value={settings.LEVEL_REQUIREMENT || 80}
              onChange={(e) => handleSettingsChange('LEVEL_REQUIREMENT', parseInt(e.target.value) || 80)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Item Level Requirement"
              value={settings.ITEM_LEVEL_REQUIREMENT || 440}
              onChange={(e) => handleSettingsChange('ITEM_LEVEL_REQUIREMENT', parseInt(e.target.value) || 440)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Min Check Cap"
              value={settings.MIN_CHECK_CAP || 640}
              onChange={(e) => handleSettingsChange('MIN_CHECK_CAP', parseInt(e.target.value) || 640)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Max Check Cap"
              value={settings.MAX_CHECK_CAP || 720}
              onChange={(e) => handleSettingsChange('MAX_CHECK_CAP', parseInt(e.target.value) || 720)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Min Tier Item Level"
              value={settings.MIN_TIER_ITEMLEVEL || 640}
              onChange={(e) => handleSettingsChange('MIN_TIER_ITEMLEVEL', parseInt(e.target.value) || 640)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Season Start Date"
              type="date"
              value={settings.SEASON_START_DATE || ''}
              onChange={(e) => handleSettingsChange('SEASON_START_DATE', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Current Raid"
              value={settings.CURRENT_RAID || ''}
              onChange={(e) => handleSettingsChange('CURRENT_RAID', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Current M+ Season"
              value={settings.CURRENT_MPLUS_SEASON || 15}
              onChange={(e) => handleSettingsChange('CURRENT_MPLUS_SEASON', parseInt(e.target.value) || 15)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Guild Rank Requirement"
              value={Array.isArray(settings.GUILD_RANK_REQUIREMENT) ? settings.GUILD_RANK_REQUIREMENT.join(',') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                handleSettingsChange('GUILD_RANK_REQUIREMENT', values);
              }}
              helperText="Comma-separated guild rank IDs (e.g., 0,1,2,3,4,5,6,7,8,9,10)"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Main Ranks"
              value={Array.isArray(settings.MAIN_RANKS) ? settings.MAIN_RANKS.join(',') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                handleSettingsChange('MAIN_RANKS', values);
              }}
              helperText="Comma-separated rank IDs (e.g., 0,1,2,3,4,5,6,7)"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Alt Ranks"
              value={Array.isArray(settings.ALT_RANKS) ? settings.ALT_RANKS.join(',') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                handleSettingsChange('ALT_RANKS', values);
              }}
              helperText="Comma-separated rank IDs (e.g., 8,9,10)"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tank Specializations"
              value={Array.isArray(settings.TANKS) ? settings.TANKS.join(', ') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                handleSettingsChange('TANKS', values);
              }}
              helperText="Comma-separated tank spec names"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Healer Specializations"
              value={Array.isArray(settings.HEALERS) ? settings.HEALERS.join(', ') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                handleSettingsChange('HEALERS', values);
              }}
              helperText="Comma-separated healer spec names"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enchantable Pieces"
              value={Array.isArray(settings.ENCHANTABLE_PIECES) ? settings.ENCHANTABLE_PIECES.join(', ') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                handleSettingsChange('ENCHANTABLE_PIECES', values);
              }}
              helperText="Comma-separated slot names"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Difficulty Modes"
              value={Array.isArray(settings.DIFFICULTY) ? settings.DIFFICULTY.join(', ') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                handleSettingsChange('DIFFICULTY', values);
              }}
              helperText="Comma-separated difficulty names"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Guild Rank Names"
              value={Array.isArray(settings.GUILLD_RANKS) ? settings.GUILLD_RANKS.join(',\n') : ''}
              onChange={(e) => {
                const values = e.target.value.split(/[,\n]/).map(v => v.trim()).filter(v => v);
                handleSettingsChange('GUILLD_RANKS', values);
              }}
              helperText="One rank name per line or comma-separated"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Current Season Tier Sets"
              value={Array.isArray(settings.CURRENT_SEASON_TIER_SETS) ? settings.CURRENT_SEASON_TIER_SETS.join(',\n') : ''}
              onChange={(e) => {
                const values = e.target.value.split(/[,\n]/).map(v => v.trim()).filter(v => v);
                handleSettingsChange('CURRENT_SEASON_TIER_SETS', values);
              }}
              helperText="One tier set name per line or comma-separated"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="error">
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Reset the database to start fresh. This will delete all data except app settings.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<RefreshIcon />}
          onClick={handleOpenResetDialog}
        >
          Reset Database
        </Button>
      </Paper>

      {/* Reset Database Dialog */}
      <Dialog
        open={showResetDialog}
        onClose={() => {
          if (!resetLoading) {
            setShowResetDialog(false);
            setResetError('');
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Reset Database
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: 'error.main' }}>
              ⚠️ DANGER: This action will permanently delete all data!
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              This will wipe all guild data, member information, season stats, and error logs from the database.
            </Typography>
            {resetInfo && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(255, 0, 0, 0.1)', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Collections to be deleted:
                </Typography>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  {resetInfo.collectionsToReset.map((collection) => (
                    <li key={collection}>
                      <Typography variant="body2" component="span">
                        {collection} ({resetInfo.counts[collection] || 0} documents)
                      </Typography>
                    </li>
                  ))}
                </ul>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, color: 'success.main' }}>
                  ✓ Preserved: {resetInfo.collectionsToPreserve.join(', ')}
                </Typography>
              </Box>
            )}
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              After reset, you will need to recreate your admin account and can then re-run the installation process to fetch fresh guild data.
            </Typography>
          </DialogContentText>

          {resetError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setResetError('')}>
              {resetError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setShowResetDialog(false);
              setResetError('');
            }}
            disabled={resetLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResetDatabase}
            color="error"
            variant="contained"
            disabled={resetLoading}
            startIcon={resetLoading ? <CircularProgress size={20} /> : null}
          >
            {resetLoading ? 'Resetting...' : 'Reset Database'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


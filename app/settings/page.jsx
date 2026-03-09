'use client';

/**
 * @file Settings page for admin management
 * @module app/settings/page
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { 
  Save as SaveIcon, 
  RefreshCw as RefreshIcon, 
  AlertTriangle as WarningIcon, 
  Lock as LockIcon 
} from 'lucide-react';

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

      console.log('📥 Fetched settings:', data);

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
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!settings) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error || 'Failed to load settings. Please refresh the page.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          App Settings
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchSettings}
            disabled={loading}
          >
            <RefreshIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Spinner className="mr-2 h-4 w-4" /> : <SaveIcon className="mr-2 h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm border">
        <h3 className="text-md font-medium mb-1">Protected Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These settings cannot be changed for security reasons.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Guild Name</Label>
            <div className="relative">
              <LockIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                value={settings.GUILD_NAME || ''}
                disabled
              />
            </div>
            <p className="text-sm text-muted-foreground">Cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label>Guild Realm</Label>
            <div className="relative">
              <LockIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                value={settings.GUILD_REALM || ''}
                disabled
              />
            </div>
            <p className="text-sm text-muted-foreground">Cannot be changed</p>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>API Key</Label>
            <div className="relative">
              <LockIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                value="••••••••••••••••"
                disabled
              />
            </div>
            <p className="text-sm text-muted-foreground">Hidden for security - cannot be viewed or changed</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm border">
        <h3 className="text-md font-medium mb-4">General Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Region</Label>
            <Select
              value={settings.REGION || 'eu'}
              onValueChange={(value) => handleSettingsChange('REGION', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eu">Europe (EU)</SelectItem>
                <SelectItem value="us">United States (US)</SelectItem>
                <SelectItem value="kr">Korea (KR)</SelectItem>
                <SelectItem value="tw">Taiwan (TW)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>API Parameters</Label>
            <Input
              value={settings.API_PARAM_REQUIREMENTGS || ''}
              onChange={(e) => handleSettingsChange('API_PARAM_REQUIREMENTGS', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">e.g., namespace=profile-eu&locale=en_US</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm border">
        <h3 className="text-md font-medium mb-4">Guild Requirements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Level Requirement</Label>
            <Input
              type="number"
              value={settings.LEVEL_REQUIREMENT || 80}
              onChange={(e) => handleSettingsChange('LEVEL_REQUIREMENT', parseInt(e.target.value) || 80)}
            />
          </div>
          <div className="space-y-2">
            <Label>Item Level Requirement</Label>
            <Input
              type="number"
              value={settings.ITEM_LEVEL_REQUIREMENT || 440}
              onChange={(e) => handleSettingsChange('ITEM_LEVEL_REQUIREMENT', parseInt(e.target.value) || 440)}
            />
          </div>
          <div className="space-y-2">
            <Label>Min Check Cap</Label>
            <Input
              type="number"
              value={settings.MIN_CHECK_CAP || 640}
              onChange={(e) => handleSettingsChange('MIN_CHECK_CAP', parseInt(e.target.value) || 640)}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Check Cap</Label>
            <Input
              type="number"
              value={settings.MAX_CHECK_CAP || 720}
              onChange={(e) => handleSettingsChange('MAX_CHECK_CAP', parseInt(e.target.value) || 720)}
            />
          </div>
          <div className="space-y-2">
            <Label>Min Tier Item Level</Label>
            <Input
              type="number"
              value={settings.MIN_TIER_ITEMLEVEL || 640}
              onChange={(e) => handleSettingsChange('MIN_TIER_ITEMLEVEL', parseInt(e.target.value) || 640)}
            />
          </div>
          <div className="space-y-2">
            <Label>Season Start Date</Label>
            <Input
              type="date"
              value={settings.SEASON_START_DATE || ''}
              onChange={(e) => handleSettingsChange('SEASON_START_DATE', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Current Raid</Label>
            <Input
              value={settings.CURRENT_RAID || ''}
              onChange={(e) => handleSettingsChange('CURRENT_RAID', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Current M+ Season</Label>
            <Input
              type="number"
              value={settings.CURRENT_MPLUS_SEASON || 15}
              onChange={(e) => handleSettingsChange('CURRENT_MPLUS_SEASON', parseInt(e.target.value) || 15)}
            />
          </div>
          <div className="space-y-2">
            <Label>Season Title</Label>
            <Input
              value={settings.SEASON_TITLE || 'Current Season'}
              onChange={(e) => handleSettingsChange('SEASON_TITLE', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Title displayed in navigation (e.g., 'Season 3', 'Season 4')</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm border">
        <h3 className="text-md font-medium mb-1">Seasons Page Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Control the content displayed on the seasons signup page.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Page Title</Label>
            <Input
              value={settings.SEASON_PAGE_TITLE || settings.SEASON_TITLE || 'Current Season'}
              onChange={(e) => handleSettingsChange('SEASON_PAGE_TITLE', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Main title displayed at the top of the seasons page</p>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Page Description</Label>
            <Textarea
              rows={3}
              value={settings.SEASON_PAGE_DESCRIPTION || 'Information about the upcoming season, based on the form the members have filled out.'}
              onChange={(e) => handleSettingsChange('SEASON_PAGE_DESCRIPTION', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Description text displayed below the page title</p>
          </div>
          <div className="space-y-2">
            <Label>Signup Button Text</Label>
            <Input
              value={settings.SEASON_SIGNUP_BUTTON_TEXT || `Sign Up for ${settings.SEASON_TITLE || 'Current Season'}`}
              onChange={(e) => handleSettingsChange('SEASON_SIGNUP_BUTTON_TEXT', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Text displayed on the signup button</p>
          </div>
          <div className="space-y-2">
            <Label>Success Message</Label>
            <Input
              value={settings.SEASON_SIGNUP_SUCCESS_MESSAGE || `Successfully signed up for ${settings.SEASON_TITLE || 'Current Season'}!`}
              onChange={(e) => handleSettingsChange('SEASON_SIGNUP_SUCCESS_MESSAGE', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Message shown after successful signup</p>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Roster Table Title</Label>
            <Input
              value={settings.SEASON_ROSTER_TABLE_TITLE || 'Registered Applications'}
              onChange={(e) => handleSettingsChange('SEASON_ROSTER_TABLE_TITLE', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Title for the roster table section</p>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Roster Table Description</Label>
            <Textarea
              rows={3}
              value={settings.SEASON_ROSTER_TABLE_DESCRIPTION || 'Registered Applications are players who are looking to continue raiding, this doesn\'t however *yet* mean that they have secured a spot.'}
              onChange={(e) => handleSettingsChange('SEASON_ROSTER_TABLE_DESCRIPTION', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Description text for the roster table</p>
          </div>
          
          <div className="col-span-1 md:col-span-2 py-2">
            <div className="h-px bg-border my-2" />
            <h4 className="text-sm font-medium mt-4 mb-2">Season Alert Settings</h4>
          </div>
          
          <div className="space-y-2">
            <Label>Alert Enabled</Label>
            <Select
              value={settings.SEASON_ALERT_ENABLED !== false ? 'true' : 'false'}
              onValueChange={(value) => handleSettingsChange('SEASON_ALERT_ENABLED', value === 'true')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Alert Enabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Enabled</SelectItem>
                <SelectItem value="false">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Alert Title</Label>
            <Input
              value={settings.SEASON_ALERT_TITLE || settings.SEASON_TITLE || 'Current Season'}
              onChange={(e) => handleSettingsChange('SEASON_ALERT_TITLE', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Title shown in the season alert banner</p>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Alert Message</Label>
            <Textarea
              rows={3}
              value={settings.SEASON_ALERT_MESSAGE || `${settings.SEASON_TITLE || 'Current Season'} applications are now open. With limited spots available for progression raiding, please submit your application soon to be considered.`}
              onChange={(e) => handleSettingsChange('SEASON_ALERT_MESSAGE', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Message shown in the season alert banner</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm border">
        <h3 className="text-md font-medium mb-4">Guild Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Guild Rank Requirement</Label>
            <Input
              value={Array.isArray(settings.GUILD_RANK_REQUIREMENT) ? settings.GUILD_RANK_REQUIREMENT.join(',') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                handleSettingsChange('GUILD_RANK_REQUIREMENT', values);
              }}
            />
            <p className="text-sm text-muted-foreground">Comma-separated guild rank IDs (e.g., 0,1,2,3,4,5,6,7,8,9,10)</p>
          </div>
          <div className="space-y-2">
            <Label>Main Ranks</Label>
            <Input
              value={Array.isArray(settings.MAIN_RANKS) ? settings.MAIN_RANKS.join(',') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                handleSettingsChange('MAIN_RANKS', values);
              }}
            />
            <p className="text-sm text-muted-foreground">Comma-separated rank IDs (e.g., 0,1,2,3,4,5,6,7)</p>
          </div>
          <div className="space-y-2">
            <Label>Alt Ranks</Label>
            <Input
              value={Array.isArray(settings.ALT_RANKS) ? settings.ALT_RANKS.join(',') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                handleSettingsChange('ALT_RANKS', values);
              }}
            />
            <p className="text-sm text-muted-foreground">Comma-separated rank IDs (e.g., 8,9,10)</p>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Tank Specializations</Label>
            <Input
              value={Array.isArray(settings.TANKS) ? settings.TANKS.join(', ') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                handleSettingsChange('TANKS', values);
              }}
            />
            <p className="text-sm text-muted-foreground">Comma-separated tank spec names</p>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Healer Specializations</Label>
            <Input
              value={Array.isArray(settings.HEALERS) ? settings.HEALERS.join(', ') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                handleSettingsChange('HEALERS', values);
              }}
            />
            <p className="text-sm text-muted-foreground">Comma-separated healer spec names</p>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Enchantable Pieces</Label>
            <Input
              value={Array.isArray(settings.ENCHANTABLE_PIECES) ? settings.ENCHANTABLE_PIECES.join(', ') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                handleSettingsChange('ENCHANTABLE_PIECES', values);
              }}
            />
            <p className="text-sm text-muted-foreground">Comma-separated slot names</p>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Difficulty Modes</Label>
            <Input
              value={Array.isArray(settings.DIFFICULTY) ? settings.DIFFICULTY.join(', ') : ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                handleSettingsChange('DIFFICULTY', values);
              }}
            />
            <p className="text-sm text-muted-foreground">Comma-separated difficulty names</p>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Guild Rank Names</Label>
            <Textarea
              rows={4}
              value={Array.isArray(settings.GUILLD_RANKS) ? settings.GUILLD_RANKS.join(',\n') : ''}
              onChange={(e) => {
                const values = e.target.value.split(/[,\n]/).map(v => v.trim()).filter(v => v);
                handleSettingsChange('GUILLD_RANKS', values);
              }}
            />
            <p className="text-sm text-muted-foreground">One rank name per line or comma-separated</p>
          </div>
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label>Current Season Tier Sets</Label>
            <Textarea
              rows={6}
              value={Array.isArray(settings.CURRENT_SEASON_TIER_SETS) ? settings.CURRENT_SEASON_TIER_SETS.join(',\n') : ''}
              onChange={(e) => {
                const values = e.target.value.split(/[,\n]/).map(v => v.trim()).filter(v => v);
                handleSettingsChange('CURRENT_SEASON_TIER_SETS', values);
              }}
            />
            <p className="text-sm text-muted-foreground">One tier set name per line or comma-separated</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm border border-red-200 dark:border-red-900/50">
        <h3 className="text-md font-medium mb-1 text-red-600 dark:text-red-400">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Reset the database to start fresh. This will delete all data except app settings.
        </p>
        <Button
          variant="destructive"
          onClick={handleOpenResetDialog}
        >
          <RefreshIcon className="mr-2 h-4 w-4" />
          Reset Database
        </Button>
      </div>

      {/* Reset Database Dialog */}
      <Dialog
        open={showResetDialog}
        onOpenChange={(open) => {
          if (!open && !resetLoading) {
            setShowResetDialog(false);
            setResetError('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <WarningIcon className="h-5 w-5" />
              Reset Database
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="font-semibold text-red-600 dark:text-red-400 mb-2">
              ⚠️ DANGER: This action will permanently delete all data!
            </div>
            <p className="text-sm mb-4">
              This will wipe all guild data, member information, season stats, and error logs from the database.
            </p>
            {resetInfo && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-md text-sm">
                <div className="font-semibold mb-2">
                  Collections to be deleted:
                </div>
                <ul className="list-disc pl-5 mb-2 space-y-1">
                  {resetInfo.collectionsToReset.map((collection) => (
                    <li key={collection}>
                      {collection} ({resetInfo.counts[collection] || 0} documents)
                    </li>
                  ))}
                </ul>
                <div className="font-semibold text-green-600 dark:text-green-400 mt-3">
                  ✓ Preserved: {resetInfo.collectionsToPreserve.join(', ')}
                </div>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              After reset, you will need to recreate your admin account and can then re-run the installation process to fetch fresh guild data.
            </p>
          </div>

          {resetError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{resetError}</AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => {
                setShowResetDialog(false);
                setResetError('');
              }}
              disabled={resetLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetDatabase}
              disabled={resetLoading}
            >
              {resetLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {resetLoading ? 'Resetting...' : 'Reset Database'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

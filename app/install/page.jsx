'use client';

/**
 * @file Installation page for setting up the application
 * @module app/install/page
 */

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import CharacterCard from './components/CharacterCard';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

const steps = ['App Settings', 'Fetching Guild Data', 'Admin Account'];

export default function InstallPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [defaults, setDefaults] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  const [hasGuildData, setHasGuildData] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Reset Dialog State
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetCredentials, setResetCredentials] = useState({ username: '', password: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetInfo, setResetInfo] = useState(null);
  
  // Guild Fetching State
  const [fetchingGuild, setFetchingGuild] = useState(false);
  const [fetchProgress, setFetchProgress] = useState('');
  const [newCharacters, setNewCharacters] = useState([]);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  
  // Socket.IO ref
  const socketRef = useRef(null);
  
  // App Settings Form State
  const [appSettings, setAppSettings] = useState({
    API_BATTLENET_KEY: '',
    API_BATTLENET_SECRET: '',
    GUILD_NAME: '',
    GUILD_REALM: '',
    REGION: 'eu',
    API_PARAM_REQUIREMENTGS: 'namespace=profile-eu&locale=en_US',
    LEVEL_REQUIREMENT: 80,
    GUILD_RANK_REQUIREMENT: [0,1,2,3,4,5,6,7,8,9,10],
    ITEM_LEVEL_REQUIREMENT: 440,
    MIN_CHECK_CAP: 640,
    MAX_CHECK_CAP: 720,
    MIN_TIER_ITEMLEVEL: 640,
    ENCHANTABLE_PIECES: ['WRIST', 'LEGS', 'FEET', 'CHEST', 'MAIN_HAND', 'FINGER_1', 'FINGER_2'],
    MAIN_RANKS: [0,1,2,3,4,5,6,7],
    ALT_RANKS: [8,9,10],
    TANKS: ['Blood', 'Vengeance', 'Guardian', 'Brewmaster', 'Protection'],
    HEALERS: ['Preservation', 'Mistweaver', 'Holy', 'Discipline', 'Restoration'],
    DIFFICULTY: ['Mythic', 'Heroic', 'Normal'],
    SEASON_START_DATE: '2026-02-25',
    CURRENT_EXPANSION: 'Midnight',
    CURRENT_MPLUS_SEASON: 16,
    GUILLD_RANKS: [
      'Guild Lead',
      'Officer',
      'Officer Alt',
      'Cunt',
      'Muppet',
      'Raider',
      'Trial Raider',
      'Member',
      'Alt',
      'New Recruit'
    ],
    CURRENT_SEASON_TIER_SETS: [
      "Relentless Rider's Lament",
      "Devouring Reaver's Sheathe",
      "Sprouts of the Luminous Bloom",
      "Livery of the Black Talon",
      "Primal Sentry's Camouflage",
      "Voidbreaker's Accordance",
      "Way of Ra-den's Chosen",
      "Luminating Verdict's Vestments",
      "Blind Oath's Burden",
      "Motley of the Grim Jest",
      "Mantle of the Primal Core",
      "Reign of the Abyssal Immolator",
      "Rage of the Night Ender"
    ]
  });

  // Admin Form State
  const [adminSettings, setAdminSettings] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Check installation status on mount
  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = sessionStorage.getItem('install_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    checkInstallStatus();
    
    // Cleanup socket connection on unmount
    return () => {
      if (socketRef.current) {
        console.log('🔌 Disconnecting Socket.IO on unmount');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const checkInstallStatus = async () => {
    try {
      setCheckingStatus(true);
      const response = await fetch('/api/install');
      const data = await response.json();

      if (data.installed) {
        setIsInstalled(true);
        const adminExists = data.hasAdmin || false;
        setHasAdmin(adminExists);
        setHasGuildData(data.hasGuildData || false);
        
        // If admin exists but user is not authenticated, require login
        if (adminExists && !isAuthenticated) {
          // Don't show install interface until authenticated
        }
        // Show info that settings exist, but allow overwrite
        if (data.currentSettings) {
          // Pre-fill form with current settings (except sensitive data)
          setAppSettings(prev => ({
            ...prev,
            ...data.currentSettings,
            // Don't pre-fill API keys for security
            API_BATTLENET_KEY: '',
            API_BATTLENET_SECRET: '',
          }));
        }
        
        // Auto-advance to suggested step if settings already exist
        if (data.suggestedStep !== undefined && data.suggestedStep > 0) {
          setActiveStep(data.suggestedStep);
        }
      } else {
        setIsInstalled(false);
        setHasAdmin(data.hasAdmin || false);
        setHasGuildData(data.hasGuildData || false);
      }

      if (data.defaults) {
        setDefaults(data.defaults);
        // Merge defaults with current state if not already installed
        if (!data.installed) {
          setAppSettings(prev => ({
            ...prev,
            ...data.defaults,
            // Don't override sensitive fields if they're not in defaults
            API_BATTLENET_KEY: prev.API_BATTLENET_KEY || '',
            API_BATTLENET_SECRET: prev.API_BATTLENET_SECRET || '',
          }));
        }
      }

      // Set initial step based on installation status
      if (data.suggestedStep !== undefined) {
        setActiveStep(data.suggestedStep);
      } else if (data.hasAdmin && !data.installed) {
        setActiveStep(1);
      }
    } catch (error) {
      console.error('Error checking install status:', error);
      setError('Failed to check installation status');
    } finally {
      setCheckingStatus(false);
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return errors;
  };

  const handleAppSettingsChange = (field, value) => {
    setAppSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdminSettingsChange = (field, value) => {
    setAdminSettings(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleAppSettingsSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submit - isInstalled:', isInstalled, 'hasAdmin:', hasAdmin);
    
    // If already installed AND admin exists, show confirmation dialog
    // If admin doesn't exist, allow overwriting without confirmation (installation incomplete)
    if (isInstalled && hasAdmin) {
      console.log('Showing overwrite dialog - installation complete');
      setShowOverwriteDialog(true);
      return;
    }
    
    // If installed but no admin, OR not installed at all, proceed with overwrite flag
    const shouldOverwrite = isInstalled && !hasAdmin;
    console.log('Submitting with overwrite:', shouldOverwrite);
    await submitAppSettings(shouldOverwrite);
  };

  const submitAppSettings = async (overwrite = false) => {
    console.log('\n=== SUBMIT APP SETTINGS ===');
    console.log('overwrite:', overwrite);
    console.log('isInstalled:', isInstalled);
    console.log('hasAdmin:', hasAdmin);
    console.log('==========================\n');
    
    setLoading(true);
    setError('');
    setSuccess('');
    setValidationResult(null);

    try {
      const response = await fetch('/api/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...appSettings,
          overwrite: overwrite
        }),
      });

      const data = await response.json();
      
      console.log('\n=== RESPONSE ===');
      console.log('Status:', response.status);
      console.log('OK:', response.ok);
      console.log('Data:', data);
      console.log('================\n');

      if (!response.ok) {
        // Check if overwrite is required
        // If requiresOverwrite is true BUT admin doesn't exist, this is a bug - just retry with overwrite
        if (data.requiresOverwrite) {
          console.log('⚠️ Got requiresOverwrite. hasAdmin:', hasAdmin);
          
          if (!hasAdmin) {
            // Installation incomplete - retry with overwrite flag
            console.log('🔄 Retrying with overwrite=true...');
            setLoading(false);
            await submitAppSettings(true);
            return;
          } else {
            // Installation complete - show confirmation dialog
            console.log('📋 Showing overwrite confirmation dialog');
            setShowOverwriteDialog(true);
            setLoading(false);
            return;
          }
        }
        
        // Set detailed error information
        const errorMessage = data.message || data.error || 'Failed to save settings';
        setError(errorMessage);
        
        // Store detailed error information for display
        setErrorDetails({
          error: data.error || 'UNKNOWN_ERROR',
          message: errorMessage,
          details: data.details || errorMessage,
          suggestion: data.suggestion || 'Please check your settings and try again.',
          validation: data.validation
        });
        
        if (data.errors) {
          setPasswordErrors(data.errors);
        }
        
        // Clear success and validation
        setSuccess('');
        setValidationResult(null);
        setLoading(false);
        return;
      }

      setSuccess(overwrite ? 'App settings updated successfully!' : 'App settings saved successfully!');
      setValidationResult({
        isValid: true,
        guildMembers: data.validation?.guildMembers
      });
      
      // Clear any previous errors
      setError('');
      setErrorDetails(null);
      
      // Update installed state
      setIsInstalled(true);
      
      // Start fetching guild data
      setTotalMembers(data.validation?.guildMembers || 0);
      setFetchingGuild(true);
      setActiveStep(1);
      await fetchGuildData();
    } catch (error) {
      console.error('Error saving app settings:', error);
      setError('Failed to save settings. Please try again.');
      setErrorDetails({
        error: 'NETWORK_ERROR',
        message: 'Network error occurred',
        details: error.message || 'Failed to connect to the server.',
        suggestion: 'Please check your internet connection and try again.'
      });
      setSuccess('');
      setValidationResult(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuildData = async () => {
    try {
      setFetchProgress('Starting guild data fetch...');
      setError('');
      setErrorDetails(null);
      
      // Start the guild update
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      // Connect to Socket.IO for real-time updates
      if (!socketRef.current) {
        console.log('🔌 Connecting to Socket.IO:', API_BASE_URL);
        socketRef.current = io(API_BASE_URL, {
          transports: ['websocket', 'polling'],
          reconnection: true,
        });
        
        socketRef.current.on('connect', () => {
          console.log('✅ Socket.IO connected');
        });
        
        socketRef.current.on('disconnect', () => {
          console.log('❌ Socket.IO disconnected');
        });
        
        socketRef.current.on('error', (error) => {
          console.error('Socket.IO error:', error);
        });
      }
      
      const updateResponse = await fetch(`${API_BASE_URL}/api/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataTypes: ['raid', 'mplus', 'pvp'] }),
      });

      const updateData = await updateResponse.json();
      
      if (!updateResponse.ok && updateResponse.status !== 409) {
        const errorMessage = updateData.message || 'Failed to start guild update';
        setError(errorMessage);
        setErrorDetails({
          error: 'GUILD_FETCH_ERROR',
          message: errorMessage,
          details: updateData.error || errorMessage,
          suggestion: 'Please check your API credentials and guild settings. You can go back to step 1 to update your configuration.'
        });
        setFetchingGuild(false);
        setFetchProgress('');
        
        // Disconnect socket on error
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        return;
      }

      const processId = updateData.processId;
      console.log('📝 Guild update started, process ID:', processId);
      setFetchProgress(`Processing guild members... (0/${totalMembers})`);
      
      // Listen for Socket.IO progress updates
      socketRef.current.on('guild-update-progress', (progressData) => {
        console.log('📊 Progress update:', progressData);
        
        const { type, data } = progressData;
        
        switch (type) {
          case 'auth':
            setFetchProgress('Authenticating with Battle.net API...');
            break;
            
          case 'guild-fetch':
            setFetchProgress(`Fetching guild roster... (${data.message || ''})`);
            break;
            
          case 'character-warning':
            // Show warning but continue processing
            console.warn('⚠️  Character warning:', data.message);
            // Don't show error to user, just log it - process continues
            break;
            
          case 'member-processing':
            if (data.current && data.total) {
              setTotalProcessed(data.current);
              const percent = Math.round((data.current / data.total) * 100);
              setFetchProgress(`Processing ${data.character || 'members'}... (${data.current}/${data.total} - ${percent}%)`);
              
              // Add character to display if available
              if (data.character) {
                const [name, realm] = data.character.split('-');
                // Fetch character data to show in card
                fetch(`${API_BASE_URL}/api/fetch/${realm}/${name}?dataTypes=raid,mplus,pvp`)
                  .then(res => res.json())
                  .then(charData => {
                    if (charData.success && charData.character) {
                      const transformedChar = {
                        name: charData.character.name,
                        server: charData.character.server,
                        class: charData.character.metaData?.class || 'Unknown',
                        spec: charData.character.metaData?.spec || 'Unknown',
                        itemLevel: charData.character.itemlevel?.equiped || 0,
                        mplus: charData.character.mplus?.current_mythic_rating?.rating || 0,
                        pvp: charData.character.pvp?.rating || 0,
                        media: charData.character.media,
                        metaData: charData.character.metaData,
                      };
                      setNewCharacters(prev => {
                        const exists = prev.some(c => c.name === transformedChar.name && c.server === transformedChar.server);
                        if (exists) return prev;
                        return [transformedChar, ...prev].slice(0, 3);
                      });
                    }
                  })
                  .catch(err => console.error('Error fetching character:', err));
              }
            }
            break;
            
          case 'final-processing':
            setFetchProgress('Final processing of guild data...');
            break;
            
          case 'statistics':
            setFetchProgress('Generating statistics...');
            break;
            
          case 'complete':
            setFetchProgress(`Complete! Processed ${data.total || totalMembers} members.`);
            setFetchingGuild(false);
            
            // Disconnect socket
            if (socketRef.current) {
              socketRef.current.disconnect();
              socketRef.current = null;
            }
            
            // Move to admin step after a delay
            setTimeout(() => {
              setActiveStep(2);
            }, 2000);
            break;
            
          case 'error':
            const errorMsg = data.message || 'An error occurred during guild fetch';
            setError(errorMsg);
            setErrorDetails({
              error: 'GUILD_FETCH_ERROR',
              message: errorMsg,
              details: data.error || errorMsg,
              suggestion: 'Please check your settings and try again.'
            });
            setFetchingGuild(false);
            
            // Disconnect socket
            if (socketRef.current) {
              socketRef.current.disconnect();
              socketRef.current = null;
            }
            break;
            
          default:
            if (data.message) {
              setFetchProgress(data.message);
            }
        }
      });

      // Poll for status updates
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`${API_BASE_URL}/api/status`);
          const statusData = await statusResponse.json();

          if (statusData.processes && statusData.processes[processId]) {
            const process = statusData.processes[processId];
            
            // Update progress
            if (process.current) {
              setTotalProcessed(process.current);
              setFetchProgress(`Processing ${process.character || 'members'}... (${process.current}/${totalMembers})`);
            }

            // Check for new characters
            if (process.type === 'member-processing' && process.character) {
              // Fetch the character data to show in cards
              try {
                const [realm, name] = process.character.split('-');
                const charResponse = await fetch(`${API_BASE_URL}/api/fetch/${realm}/${name}?dataTypes=raid,mplus,pvp`);
                if (charResponse.ok) {
                  const charData = await charResponse.json();
                  if (charData.success && charData.character) {
                    // Transform character data to match expected format
                    const transformedChar = {
                      name: charData.character.name,
                      server: charData.character.server,
                      class: charData.character.metaData?.class || 'Unknown',
                      spec: charData.character.metaData?.spec || 'Unknown',
                      itemLevel: charData.character.itemlevel?.equiped || charData.character.itemLevel || 0,
                      mplus: charData.character.mplus?.current_mythic_rating?.rating || charData.character.mplus || 0,
                      pvp: charData.character.pvp?.rating || charData.character.pvp || 0,
                      media: charData.character.media,
                      metaData: charData.character.metaData,
                    };
                    setNewCharacters(prev => {
                      // Avoid duplicates
                      const exists = prev.some(c => c.name === transformedChar.name && c.server === transformedChar.server);
                      if (exists) return prev;
                      const updated = [transformedChar, ...prev].slice(0, 3);
                      return updated;
                    });
                  }
                }
              } catch (err) {
                console.error('Error fetching character data:', err);
              }
            }

            // Check if complete
            if (process.type === 'complete' || process.status === 'completed') {
              clearInterval(pollInterval);
              setFetchProgress(`Complete! Processed ${totalMembers} members.`);
              setFetchingGuild(false);
              
              // Move to admin step after a delay
              setTimeout(() => {
                setActiveStep(2);
              }, 2000);
            }
          } else if (statusData.processes && Object.keys(statusData.processes).length === 0) {
            // Process completed
            clearInterval(pollInterval);
            setFetchProgress(`Complete! Processed ${totalMembers} members.`);
            setFetchingGuild(false);
            
            setTimeout(() => {
              setActiveStep(2);
            }, 2000);
          }
        } catch (err) {
          console.error('Error polling status:', err);
        }
      }, 2000); // Poll every 2 seconds

      // Timeout after 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (fetchingGuild) {
          setFetchProgress('Fetch completed (timeout).');
          setFetchingGuild(false);
          setActiveStep(2);
        }
      }, 600000);
    } catch (error) {
      console.error('Error fetching guild data:', error);
      const errorMessage = error.message || 'Failed to fetch guild data';
      setError(errorMessage);
      setErrorDetails({
        error: 'GUILD_FETCH_ERROR',
        message: errorMessage,
        details: error.message || 'An error occurred while fetching guild data.',
        suggestion: 'Please check your API credentials and guild settings. You can go back to step 1 to update your configuration and try again.'
      });
      setFetchingGuild(false);
      setFetchProgress('');
      // Don't auto-advance on error - let user fix the issue
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (adminSettings.password !== adminSettings.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    const errors = validatePassword(adminSettings.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      setError('Password does not meet requirements');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/install/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: adminSettings.username,
          password: adminSettings.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Failed to create admin account');
        if (data.errors) {
          setPasswordErrors(data.errors);
        }
        return;
      }

      setSuccess('Admin account created successfully! Installation complete.');
      
      // Set authenticated state since admin was just created
      sessionStorage.setItem('install_authenticated', 'true');
      setIsAuthenticated(true);
      
      // Redirect to home page after a delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error creating admin account:', error);
      setError('Failed to create admin account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/install/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginCredentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || data.error || 'Login failed');
        return;
      }

      // Store authentication state
      sessionStorage.setItem('install_authenticated', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      setLoginCredentials({ username: '', password: '' });
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('Failed to login. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('install_authenticated');
    setIsAuthenticated(false);
    setLoginCredentials({ username: '', password: '' });
    setLoginError('');
  };

  const handleOpenResetDialog = async () => {
    setShowResetDialog(true);
    setResetError('');
    setResetSuccess('');
    
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

  const handleResetDatabase = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess('');

    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetCredentials),
      });

      const data = await response.json();

      if (!response.ok) {
        setResetError(data.message || data.error || 'Failed to reset database');
        return;
      }

      setResetSuccess(`Database reset successful! ${data.results.summary.droppedCount} collections dropped.`);
      
      // Clear form
      setResetCredentials({ username: '', password: '' });
      
      // Close dialog after a delay and refresh installation status
      setTimeout(() => {
        setShowResetDialog(false);
        setResetSuccess('');
        // Refresh the page to show fresh installation state
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Error resetting database:', error);
      setResetError('Failed to reset database. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  // ── Shared sub-components ─────────────────────────────────────

  const FormSection = ({ title, description, children }) => (
    <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/40 bg-muted/20">
        <p className="text-sm font-semibold tracking-tight">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const Field = ({ label, hint, required: req, span2, children }) => (
    <div className={`space-y-1.5 ${span2 ? 'sm:col-span-2' : ''}`}>
      <Label className="text-sm font-medium">
        {label} {req && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8 select-none">
      {steps.map((label, index) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`
              flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold border-2 transition-all
              ${activeStep > index
                ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]'
                : activeStep === index
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground'}
            `}>
              {activeStep > index ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
            </div>
            <span className={`text-xs font-medium leading-none text-center max-w-[72px] ${activeStep >= index ? 'text-foreground' : 'text-muted-foreground'}`}>
              {label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 sm:w-24 h-px mx-3 mb-5 transition-all ${activeStep > index ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const ErrorAlert = ({ error: err, errorDetails: ed }) => {
    if (!err) return null;
    return (
      <Alert variant="destructive" className="relative">
        <AlertCircle className="h-4 w-4" />
        <Button
          variant="ghost" size="icon"
          className="absolute top-2 right-2 h-6 w-6 rounded-md hover:bg-destructive/20"
          onClick={() => { setError(''); setErrorDetails(null); }}
        ><span className="sr-only">Close</span>&times;</Button>
        <AlertTitle className="font-semibold pr-6">{err}</AlertTitle>
        {ed && (
          <AlertDescription className="mt-2 space-y-2 text-sm">
            {ed.details && ed.details !== err && <p className="opacity-90">{ed.details}</p>}
            {ed.suggestion && (
              <div className="p-2.5 bg-yellow-500/10 border-l-2 border-yellow-500 rounded">
                <p className="font-semibold text-yellow-400 text-xs mb-1">Suggestion</p>
                <p className="opacity-90">{ed.suggestion}</p>
              </div>
            )}
            {ed.error === 'GUILD_NOT_FOUND' && (
              <ul className="list-disc pl-4 space-y-0.5 opacity-80">
                <li>Use lowercase slugs with hyphens, not spaces</li>
                <li>Verify the guild name and realm match exactly</li>
              </ul>
            )}
            {ed.error === 'AUTH_ERROR' && (
              <ul className="list-disc pl-4 space-y-0.5 opacity-80">
                <li>Verify your Battle.net Client ID and Secret</li>
                <li>Ensure no leading/trailing spaces were copied</li>
              </ul>
            )}
          </AlertDescription>
        )}
      </Alert>
    );
  };

  // ── Loading screen ──────────────────────────────────────────

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <img src="/images/logo-without-text.png" alt="Logo" className="h-12 w-12 opacity-60 animate-pulse" />
        <Spinner className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  // ── Login screen ────────────────────────────────────────────

  if (hasAdmin && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 gap-8">
        <div className="flex items-center gap-3">
          <img src="/images/logo-without-text.png" alt="Logo" className="h-10 w-10 opacity-70" />
          <div>
            <p className="text-lg font-bold tracking-tight leading-none">Guild Audit</p>
            <p className="text-xs text-muted-foreground mt-0.5">Setup &amp; Installation</p>
          </div>
        </div>

        <div className="w-full max-w-sm rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border/40 bg-muted/20">
            <p className="font-semibold text-sm">Admin Login Required</p>
            <p className="text-xs text-muted-foreground mt-0.5">Enter your credentials to access the setup page</p>
          </div>

          {loginError && (
            <div className="px-6 pt-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            </div>
          )}

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Username <span className="text-destructive">*</span></Label>
              <Input value={loginCredentials.username} onChange={(e) => setLoginCredentials(prev => ({ ...prev, username: e.target.value }))} required disabled={loginLoading} autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Password <span className="text-destructive">*</span></Label>
              <Input type="password" value={loginCredentials.password} onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))} required disabled={loginLoading} />
            </div>
            <Button type="submit" className="w-full" disabled={loginLoading || !loginCredentials.username || !loginCredentials.password}>
              {loginLoading && <Spinner className="mr-2 h-4 w-4" />}
              {loginLoading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-xs text-muted-foreground">
          Need a fresh start?{' '}
          <button className="underline hover:text-foreground transition-colors" onClick={handleOpenResetDialog}>Reset the database</button>
        </p>

        {/* Reset dialog */}
        <Dialog open={showResetDialog} onOpenChange={(open) => { if (!open && !resetLoading) { setShowResetDialog(false); setResetError(''); setResetSuccess(''); setResetCredentials({ username: '', password: '' }); } }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" />Reset Database</DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-3 pt-2 text-left text-sm">
                  <p className="font-semibold text-destructive">This will permanently delete all guild data and the admin account.</p>
                  {resetInfo && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 space-y-1">
                      <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-2">Collections to be deleted</p>
                      {resetInfo.collectionsToReset.map(c => (
                        <div key={c} className="flex justify-between text-xs"><span>{c}</span><span className="text-muted-foreground">{resetInfo.counts[c] || 0} docs</span></div>
                      ))}
                      <p className="text-xs text-green-500 mt-2 pt-2 border-t border-border/30">✓ Preserved: {resetInfo.collectionsToPreserve.join(', ')}</p>
                    </div>
                  )}
                  <p className="text-muted-foreground text-xs">App settings are preserved — you'll need to recreate your admin account after reset.</p>
                </div>
              </DialogDescription>
            </DialogHeader>
            {resetError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{resetError}</AlertDescription></Alert>}
            {resetSuccess && <Alert className="border-green-500/30 bg-green-500/5 text-green-500"><CheckCircle2 className="h-4 w-4" /><AlertTitle>{resetSuccess}</AlertTitle></Alert>}
            {!resetSuccess && (
              <form onSubmit={handleResetDatabase} className="space-y-3 mt-2">
                <p className="text-xs font-medium text-destructive">Confirm with admin credentials:</p>
                <div className="space-y-1.5"><Label className="text-xs">Username</Label><Input value={resetCredentials.username} onChange={(e) => setResetCredentials(prev => ({ ...prev, username: e.target.value }))} required disabled={resetLoading} /></div>
                <div className="space-y-1.5"><Label className="text-xs">Password</Label><Input type="password" value={resetCredentials.password} onChange={(e) => setResetCredentials(prev => ({ ...prev, password: e.target.value }))} required disabled={resetLoading} /></div>
                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowResetDialog(false)} disabled={resetLoading}>Cancel</Button>
                  <Button type="submit" variant="destructive" disabled={resetLoading || !resetCredentials.username || !resetCredentials.password}>{resetLoading && <Spinner className="mr-2 h-3.5 w-3.5" />}{resetLoading ? 'Resetting…' : 'Reset Database'}</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ── Main install UI ─────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Dialogs */}
      <Dialog open={showOverwriteDialog} onOpenChange={setShowOverwriteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="text-amber-400 h-4 w-4" />Overwrite Existing Settings?</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-2 text-sm text-left">
                <p>This will replace all current configuration including API keys and guild settings.</p>
                <p className="font-semibold text-amber-400">This action cannot be undone.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOverwriteDialog(false)}>Cancel</Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={async () => { setShowOverwriteDialog(false); await submitAppSettings(true); }}>Overwrite Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResetDialog} onOpenChange={(open) => { if (!open && !resetLoading) { setShowResetDialog(false); setResetError(''); setResetSuccess(''); setResetCredentials({ username: '', password: '' }); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" />Reset Database</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-2 text-left text-sm">
                <p className="font-semibold text-destructive">This will permanently delete all guild data and the admin account.</p>
                {resetInfo && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 space-y-1">
                    <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-2">Collections to be deleted</p>
                    {resetInfo.collectionsToReset.map(c => (
                      <div key={c} className="flex justify-between text-xs"><span>{c}</span><span className="text-muted-foreground">{resetInfo.counts[c] || 0} docs</span></div>
                    ))}
                    <p className="text-xs text-green-500 mt-2 pt-2 border-t border-border/30">✓ Preserved: {resetInfo.collectionsToPreserve.join(', ')}</p>
                  </div>
                )}
                <p className="text-muted-foreground text-xs">App settings are preserved — you'll need to recreate your admin account.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          {resetError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{resetError}</AlertDescription></Alert>}
          {resetSuccess && <Alert className="border-green-500/30 bg-green-500/5 text-green-500"><CheckCircle2 className="h-4 w-4" /><AlertTitle>{resetSuccess}</AlertTitle></Alert>}
          {!resetSuccess && (
            <form onSubmit={handleResetDatabase} className="space-y-3 mt-2">
              <p className="text-xs font-medium text-destructive">Confirm with admin credentials:</p>
              <div className="space-y-1.5"><Label className="text-xs">Username</Label><Input value={resetCredentials.username} onChange={(e) => setResetCredentials(prev => ({ ...prev, username: e.target.value }))} required disabled={resetLoading} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Password</Label><Input type="password" value={resetCredentials.password} onChange={(e) => setResetCredentials(prev => ({ ...prev, password: e.target.value }))} required disabled={resetLoading} /></div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setShowResetDialog(false)} disabled={resetLoading}>Cancel</Button>
                <Button type="submit" variant="destructive" disabled={resetLoading || !resetCredentials.username || !resetCredentials.password}>{resetLoading && <Spinner className="mr-2 h-3.5 w-3.5" />}{resetLoading ? 'Resetting…' : 'Reset Database'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Branding header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo-without-text.png" alt="Logo" className="h-9 w-9 opacity-80" />
            <div>
              <p className="text-base font-bold tracking-tight leading-none">Guild Audit</p>
              <p className="text-xs text-muted-foreground mt-0.5">Setup Wizard</p>
            </div>
          </div>
          {isAuthenticated && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
              <Button variant="outline" size="sm" onClick={handleOpenResetDialog} className="text-destructive border-destructive/30 hover:bg-destructive/10">Reset DB</Button>
            </div>
          )}
        </div>

        {/* Step indicator */}
        <StepIndicator />

        {/* Status alerts */}
        {activeStep === 0 && isInstalled && !hasAdmin && (
          <Alert className="border-amber-500/30 bg-amber-500/5">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertTitle className="text-amber-400">Installation Incomplete</AlertTitle>
            <AlertDescription className="text-amber-400/80 text-sm">
              Settings were saved but no admin account was created. Update the settings below and continue.
            </AlertDescription>
          </Alert>
        )}

        {activeStep === 0 && isInstalled && hasAdmin && (
          <Alert className="border-amber-500/30 bg-amber-500/5">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertTitle className="text-amber-400">Already Installed</AlertTitle>
            <AlertDescription className="text-amber-400/80 text-sm">
              Settings already exist. Changes here will overwrite all current configuration including API keys.
            </AlertDescription>
          </Alert>
        )}

        <ErrorAlert error={error} errorDetails={errorDetails} />

        {success && (
          <Alert className="border-green-500/30 bg-green-500/5 text-green-500 relative">
            <CheckCircle2 className="h-4 w-4" />
            <Button variant="ghost" size="icon" className="absolute top-1.5 right-2 h-6 w-6" onClick={() => setSuccess('')}>&times;</Button>
            <AlertTitle className="font-semibold">{success}</AlertTitle>
          </Alert>
        )}

        {/* ── Step 0: App Settings ──────────────────────────────── */}
        {activeStep === 0 && (
          <form onSubmit={handleAppSettingsSubmit} className="space-y-5">

            <FormSection title="Battle.net API Access" description="Your Battle.net developer credentials — never shared or exposed publicly.">
              <Field label="Client ID" required span2 hint="Your Battle.net API Client ID">
                <Input type="password" value={appSettings.API_BATTLENET_KEY} onChange={(e) => handleAppSettingsChange('API_BATTLENET_KEY', e.target.value)} required placeholder="••••••••••••••••" />
              </Field>
              <Field label="Client Secret" required span2 hint="Your Battle.net API Client Secret">
                <Input type="password" value={appSettings.API_BATTLENET_SECRET} onChange={(e) => handleAppSettingsChange('API_BATTLENET_SECRET', e.target.value)} required placeholder="••••••••••••••••" />
              </Field>
            </FormSection>

            <FormSection title="Guild Identity" description="Which guild to track and what region it lives in.">
              <Field label="Guild Name" required hint="Lowercase slug, e.g. time-and-tide">
                <Input value={appSettings.GUILD_NAME} onChange={(e) => handleAppSettingsChange('GUILD_NAME', e.target.value)} required placeholder="time-and-tide" />
              </Field>
              <Field label="Realm" required hint="Realm slug, e.g. sylvanas">
                <Input value={appSettings.GUILD_REALM} onChange={(e) => handleAppSettingsChange('GUILD_REALM', e.target.value)} required placeholder="sylvanas" />
              </Field>
              <Field label="Region" required>
                <Select value={appSettings.REGION} onValueChange={(v) => handleAppSettingsChange('REGION', v)}>
                  <SelectTrigger><SelectValue placeholder="Select Region" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eu">Europe (EU)</SelectItem>
                    <SelectItem value="us">United States (US)</SelectItem>
                    <SelectItem value="kr">Korea (KR)</SelectItem>
                    <SelectItem value="tw">Taiwan (TW)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="API Parameters" required hint="namespace=profile-eu&locale=en_US">
                <Input value={appSettings.API_PARAM_REQUIREMENTGS} onChange={(e) => handleAppSettingsChange('API_PARAM_REQUIREMENTGS', e.target.value)} required />
              </Field>
            </FormSection>

            <FormSection title="Season &amp; Content" description="Current game season configuration for raids and Mythic+.">
              <Field label="Season Start Date" required>
                <Input type="date" value={appSettings.SEASON_START_DATE} onChange={(e) => handleAppSettingsChange('SEASON_START_DATE', e.target.value)} required />
              </Field>
              <Field label="Current Expansion" required hint="All raids in this expansion are tracked automatically">
                <Input value={appSettings.CURRENT_EXPANSION} onChange={(e) => handleAppSettingsChange('CURRENT_EXPANSION', e.target.value)} required placeholder="Midnight" />
              </Field>
              <Field label="M+ Season ID" required hint="Numeric ID for the current Mythic+ season">
                <Input type="number" value={appSettings.CURRENT_MPLUS_SEASON} onChange={(e) => handleAppSettingsChange('CURRENT_MPLUS_SEASON', parseInt(e.target.value) || 0)} required />
              </Field>
              <Field label="Current Season Tier Sets" required span2 hint="One set name per line — used to identify tier items on characters">
                <Textarea
                  rows={5}
                  value={Array.isArray(appSettings.CURRENT_SEASON_TIER_SETS) ? appSettings.CURRENT_SEASON_TIER_SETS.join('\n') : ''}
                  onChange={(e) => { const v = e.target.value.split(/[\n,]/).map(x => x.trim()).filter(Boolean); handleAppSettingsChange('CURRENT_SEASON_TIER_SETS', v); }}
                  required
                  placeholder={"Set name 1\nSet name 2"}
                />
              </Field>
            </FormSection>

            <FormSection title="Item Level Requirements" description="Thresholds used to flag characters as audit-ready.">
              <Field label="Level Requirement" required><Input type="number" value={appSettings.LEVEL_REQUIREMENT} onChange={(e) => handleAppSettingsChange('LEVEL_REQUIREMENT', parseInt(e.target.value) || 0)} required /></Field>
              <Field label="Item Level Requirement" required><Input type="number" value={appSettings.ITEM_LEVEL_REQUIREMENT} onChange={(e) => handleAppSettingsChange('ITEM_LEVEL_REQUIREMENT', parseInt(e.target.value) || 0)} required /></Field>
              <Field label="Min Audit Cap" required hint="Lower bound of the audit iLvL slider"><Input type="number" value={appSettings.MIN_CHECK_CAP} onChange={(e) => handleAppSettingsChange('MIN_CHECK_CAP', parseInt(e.target.value) || 0)} required /></Field>
              <Field label="Max Audit Cap" required hint="Upper bound of the audit iLvL slider"><Input type="number" value={appSettings.MAX_CHECK_CAP} onChange={(e) => handleAppSettingsChange('MAX_CHECK_CAP', parseInt(e.target.value) || 0)} required /></Field>
              <Field label="Min Tier Item Level" required hint="Minimum iLvL for a tier piece to count"><Input type="number" value={appSettings.MIN_TIER_ITEMLEVEL} onChange={(e) => handleAppSettingsChange('MIN_TIER_ITEMLEVEL', parseInt(e.target.value) || 0)} required /></Field>
            </FormSection>

            <FormSection title="Roles &amp; Gear Checks" description="Spec lists for role detection and slots that require enchants.">
              <Field label="Tank Specializations" required span2 hint="Comma-separated spec names, e.g. Blood, Guardian">
                <Input value={Array.isArray(appSettings.TANKS) ? appSettings.TANKS.join(', ') : ''} onChange={(e) => handleAppSettingsChange('TANKS', e.target.value.split(',').map(v => v.trim()).filter(Boolean))} required />
              </Field>
              <Field label="Healer Specializations" required span2 hint="Comma-separated spec names, e.g. Holy, Restoration">
                <Input value={Array.isArray(appSettings.HEALERS) ? appSettings.HEALERS.join(', ') : ''} onChange={(e) => handleAppSettingsChange('HEALERS', e.target.value.split(',').map(v => v.trim()).filter(Boolean))} required />
              </Field>
              <Field label="Enchantable Slots" required span2 hint="Slot names that are flagged as missing enchants, e.g. WRIST, CHEST">
                <Input value={Array.isArray(appSettings.ENCHANTABLE_PIECES) ? appSettings.ENCHANTABLE_PIECES.join(', ') : ''} onChange={(e) => handleAppSettingsChange('ENCHANTABLE_PIECES', e.target.value.split(',').map(v => v.trim()).filter(Boolean))} required />
              </Field>
              <Field label="Tracked Difficulties" required hint="Comma-separated, e.g. Mythic, Heroic, Normal">
                <Input value={Array.isArray(appSettings.DIFFICULTY) ? appSettings.DIFFICULTY.join(', ') : ''} onChange={(e) => handleAppSettingsChange('DIFFICULTY', e.target.value.split(',').map(v => v.trim()).filter(Boolean))} required />
              </Field>
            </FormSection>

            <FormSection title="Guild Ranks" description="Rank structure used to classify mains, alts, and role distribution.">
              <Field label="All Tracked Ranks" required hint="Comma-separated rank IDs, e.g. 0,1,2,3,4,5,6,7,8,9,10">
                <Input value={Array.isArray(appSettings.GUILD_RANK_REQUIREMENT) ? appSettings.GUILD_RANK_REQUIREMENT.join(',') : ''} onChange={(e) => handleAppSettingsChange('GUILD_RANK_REQUIREMENT', e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v)))} required />
              </Field>
              <Field label="Main Ranks" required hint="Rank IDs counted as mains, e.g. 0,1,2,3">
                <Input value={Array.isArray(appSettings.MAIN_RANKS) ? appSettings.MAIN_RANKS.join(',') : ''} onChange={(e) => handleAppSettingsChange('MAIN_RANKS', e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v)))} required />
              </Field>
              <Field label="Alt Ranks" required hint="Rank IDs counted as alts, e.g. 8,9,10">
                <Input value={Array.isArray(appSettings.ALT_RANKS) ? appSettings.ALT_RANKS.join(',') : ''} onChange={(e) => handleAppSettingsChange('ALT_RANKS', e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v)))} required />
              </Field>
              <div className="sm:col-span-2" />
              <Field label="Rank Names" required span2 hint="One name per line in ascending rank order (rank 0 first)">
                <Textarea
                  rows={5}
                  value={Array.isArray(appSettings.GUILLD_RANKS) ? appSettings.GUILLD_RANKS.join('\n') : ''}
                  onChange={(e) => handleAppSettingsChange('GUILLD_RANKS', e.target.value.split(/[\n,]/).map(v => v.trim()).filter(Boolean))}
                  required placeholder={"Guild Lead\nOfficer\nMember\nAlt"}
                />
              </Field>
            </FormSection>

            {validationResult?.isValid && (
              <Alert className="border-green-500/30 bg-green-500/5 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Validated — found {validationResult.guildMembers} eligible guild members</AlertTitle>
              </Alert>
            )}

            <div className="flex items-center justify-between pt-2">
              {isInstalled ? (
                <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => {
                  const base = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
                  fetch(`${base}/api/install`).then(r => r.json()).then(d => {
                    if (d.suggestedStep !== undefined) setActiveStep(d.suggestedStep);
                    else setActiveStep(d.hasGuildData ? 2 : 1);
                  }).catch(() => setActiveStep(1));
                }}>
                  Skip to next step →
                </Button>
              ) : <div />}
              <Button type="submit" disabled={loading} className="min-w-[180px]">
                {loading && <Spinner className="mr-2 h-4 w-4" />}
                {loading ? 'Validating…' : isInstalled ? 'Update & Validate' : 'Save & Validate'}
              </Button>
            </div>
          </form>
        )}

        {/* ── Step 1: Fetching Guild Data ───────────────────────── */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Fetching Guild Data</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {fetchingGuild ? 'Pulling data from the Battle.net API…' : 'Start the guild sync or skip to the next step.'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveStep(2)}>Skip</Button>
            </div>

            {error && activeStep === 1 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between pr-4">
                  <span>{error}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setActiveStep(0); setError(''); setErrorDetails(null); }}>← Fix Settings</Button>
                </AlertTitle>
                {errorDetails?.suggestion && <AlertDescription className="mt-1 text-sm">{errorDetails.suggestion}</AlertDescription>}
              </Alert>
            )}

            {hasGuildData && !fetchingGuild && !fetchProgress && (
              <Alert className="border-green-500/30 bg-green-500/5 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Guild data already exists. You can re-fetch to refresh it, or skip to the next step.</AlertDescription>
              </Alert>
            )}

            {!fetchingGuild && !fetchProgress && (
              <div className="rounded-xl border border-border/50 bg-card p-6 flex flex-col items-center gap-4 text-center shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <Spinner className="h-5 w-5 text-primary opacity-0" />
                </div>
                <div>
                  <p className="font-semibold">Ready to fetch guild data</p>
                  <p className="text-sm text-muted-foreground mt-1">This will pull profile, equipment, raid, M+, and PvP data for every eligible member.</p>
                </div>
                <Button onClick={fetchGuildData} disabled={loading} className="min-w-[160px]">
                  {loading && <Spinner className="mr-2 h-4 w-4" />}
                  Start Guild Sync
                </Button>
              </div>
            )}

            {(fetchingGuild || fetchProgress) && (
              <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate pr-4">{fetchProgress || 'Initialising…'}</p>
                    {totalMembers > 0 && (
                      <span className="text-sm font-bold tabular-nums text-primary shrink-0">{totalProcessed}/{totalMembers}</span>
                    )}
                  </div>
                  {totalMembers > 0 && (
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.round((totalProcessed / totalMembers) * 100)}%` }}
                      />
                    </div>
                  )}
                  {fetchProgress?.startsWith('Complete') && (
                    <p className="text-xs text-green-500 flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" />Advancing to admin setup…</p>
                  )}
                </div>

                {newCharacters.length > 0 && (
                  <div className="border-t border-border/40 p-5 space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recently Processed</p>
                    <div className="flex gap-3 overflow-hidden">
                      {newCharacters.slice(-5).map((character, i) => (
                        <CharacterCard key={`${character.name}-${character.server}-${i}`} character={character} index={i} total={Math.min(newCharacters.length, 5)} />
                      ))}
                      {newCharacters.length === 0 && (
                        <p className="text-sm text-muted-foreground">Characters will appear here as they are processed…</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Admin Account ─────────────────────────────── */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Create Admin Account</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Secure the application with an admin account. This is required to access settings and run upgrades.</p>
            </div>

            <ErrorAlert error={error} errorDetails={errorDetails} />
            {success && (
              <Alert className="border-green-500/30 bg-green-500/5 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>{success}</AlertTitle>
                <AlertDescription className="text-green-500/80 text-sm">Redirecting to the dashboard…</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleAdminSubmit}>
              <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 bg-muted/20">
                  <p className="text-sm font-semibold">Admin Credentials</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Minimum 12 characters with uppercase, lowercase, numbers, and special characters</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Username <span className="text-destructive">*</span></Label>
                    <Input value={adminSettings.username} onChange={(e) => handleAdminSettingsChange('username', e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Password <span className="text-destructive">*</span></Label>
                    <Input type="password" value={adminSettings.password} onChange={(e) => handleAdminSettingsChange('password', e.target.value)} required className={passwordErrors.length > 0 ? 'border-destructive' : ''} />
                    {passwordErrors.length > 0 && <p className="text-xs text-destructive">{passwordErrors[0]}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Confirm Password <span className="text-destructive">*</span></Label>
                    <Input type="password" value={adminSettings.confirmPassword} onChange={(e) => handleAdminSettingsChange('confirmPassword', e.target.value)} required className={adminSettings.password !== adminSettings.confirmPassword && adminSettings.confirmPassword.length > 0 ? 'border-destructive' : ''} />
                    {adminSettings.password !== adminSettings.confirmPassword && adminSettings.confirmPassword.length > 0 && (
                      <p className="text-xs text-destructive">Passwords do not match</p>
                    )}
                  </div>

                  {passwordErrors.length > 1 && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                      <p className="text-xs font-semibold text-destructive mb-1.5">Password requirements not met:</p>
                      <ul className="space-y-0.5">
                        {passwordErrors.map((e, i) => <li key={i} className="text-xs text-destructive/80">• {e}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-5">
                <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setActiveStep(0)}>← Back to Settings</Button>
                <Button type="submit" disabled={loading} className="min-w-[180px]">
                  {loading && <Spinner className="mr-2 h-4 w-4" />}
                  {loading ? 'Creating…' : 'Create Admin Account'}
                </Button>
              </div>
            </form>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground pb-6">
          &copy; 2025 Holybarryz (Scott Jones). All rights reserved.
        </p>
      </div>
    </div>
  );
}

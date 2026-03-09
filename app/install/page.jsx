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
    SEASON_START_DATE: '2025-08-01',
    CURRENT_RAID: 'Manaforge Omega',
    CURRENT_MPLUS_SEASON: 15,
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
      'Hollow Sentinel\'s Wake ',
      'Charhound\'s Vicious Hunt',
      'Ornaments of the Mother Eagle',
      'Spellweaver\'s Immaculate Design',
      'Midnight Herald\'s Pledge',
      'Augur\'s Ephemeral Plumage ',
      'Crash of Fallen Storms',
      'Vows of the Lucent Battalion',
      'Eulogy to a Dying Star ',
      'Shroud of the Sudden Eclipse',
      'Howls of Channeled Fury ',
      'Inquisitor\'s Feast of Madness',
      'Chains of the Living Weapon'
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

  if (checkingStatus) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      <div className="container max-w-5xl mx-auto py-8 relative z-10">
        <div className={`p-8 rounded-xl ${activeStep === 1 ? 'bg-transparent shadow-none' : 'bg-card text-card-foreground shadow-lg border border-border'}`}>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {hasAdmin && !isAuthenticated ? 'Admin Login' : 'Application Installation'}
          </h1>
          {hasAdmin && isAuthenticated && (
            <div className="flex gap-4">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
              <Button variant="destructive" size="sm" onClick={handleOpenResetDialog}>
                Reset Database
              </Button>
            </div>
          )}
        </div>
        
        <p className="text-muted-foreground text-center mb-8">
          {hasAdmin && !isAuthenticated 
            ? 'Please login with your admin credentials to access the installation page'
            : 'Configure your World of Warcraft guild audit application'}
        </p>

        {(!hasAdmin || isAuthenticated) && (
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 overflow-x-auto py-2">
            {steps.map((label, index) => (
              <div key={label} className="flex items-center shrink-0">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-bold ${activeStep === index ? 'border-primary bg-primary text-primary-foreground' : activeStep > index ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'}`}>
                  {activeStep > index ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${activeStep >= index ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-12 h-px mx-2 sm:mx-4 ${activeStep > index ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {(!hasAdmin || isAuthenticated) && isInstalled && activeStep === 0 && !hasAdmin && (
          <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="h-4 w-4 stroke-current" />
            <AlertTitle>⚠️ Installation Incomplete - You Can Update Settings</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Settings exist but the admin account was not created. This means installation was interrupted.</p>
              <p className="font-semibold text-green-600 dark:text-green-400">✓ You can update your settings below without any confirmation. Just click "Save Settings & Validate" to continue.</p>
            </AlertDescription>
          </Alert>
        )}

        {(!hasAdmin || isAuthenticated) && isInstalled && activeStep === 0 && hasAdmin && (
          <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 stroke-current mt-0.5 shrink-0" />
              <div>
                <AlertTitle className="text-base font-semibold">Application Already Installed</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">Settings already exist in the database. You can overwrite them with new values below. This will replace all existing configuration including API keys.</p>
                  <p className="font-semibold text-destructive">Need a fresh start? Click "Reset Database" to wipe all data collections and admin account while preserving your app settings.</p>
                </AlertDescription>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={handleOpenResetDialog} className="shrink-0">
              Reset Database
            </Button>
          </Alert>
        )}

        {(!hasAdmin || isAuthenticated) && error && (
          <Alert variant="destructive" className="mb-6 relative">
            <AlertCircle className="h-4 w-4" />
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-md hover:bg-destructive/20 text-destructive-foreground/80 hover:text-destructive-foreground"
              onClick={() => {
                setError('');
                setErrorDetails(null);
              }}
            >
              <span className="sr-only">Close</span>
              &times;
            </Button>
            <AlertTitle className="font-semibold">{error}</AlertTitle>
            {errorDetails && (
              <AlertDescription className="mt-2 space-y-3">
                {errorDetails.details && errorDetails.details !== error && (
                  <p className="opacity-90">{errorDetails.details}</p>
                )}
                {errorDetails.suggestion && (
                  <div className="p-3 bg-yellow-500/10 border-l-4 border-yellow-500 rounded-md">
                    <p className="font-semibold text-yellow-600 dark:text-yellow-400 mb-1">💡 Suggestion:</p>
                    <p className="opacity-90">{errorDetails.suggestion}</p>
                  </div>
                )}
                {errorDetails.error === 'GUILD_NOT_FOUND' && (
                  <div>
                    <p className="font-semibold mb-1">Common issues:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Guild name and realm name are case-sensitive</li>
                      <li>Use the guild name slug (lowercase, spaces replaced with hyphens)</li>
                      <li>Use the realm slug (lowercase, spaces replaced with hyphens)</li>
                      <li>Verify the guild exists on the specified realm and region</li>
                    </ul>
                  </div>
                )}
                {errorDetails.error === 'AUTH_ERROR' && (
                  <div>
                    <p className="font-semibold mb-1">How to fix:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Verify your Battle.net API Client ID is correct</li>
                      <li>Verify your Battle.net API Client Secret is correct</li>
                      <li>Check that your API key hasn't expired or been revoked</li>
                      <li>Ensure you copied the full Client ID and Secret without extra spaces</li>
                    </ul>
                  </div>
                )}
              </AlertDescription>
            )}
          </Alert>
        )}

        {(!hasAdmin || isAuthenticated) && success && (
          <Alert className="mb-6 border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 relative">
            <CheckCircle2 className="h-4 w-4 stroke-current" />
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-md hover:bg-green-500/20 text-green-700/80 hover:text-green-700 dark:text-green-400/80 dark:hover:text-green-400"
              onClick={() => setSuccess('')}
            >
              <span className="sr-only">Close</span>
              &times;
            </Button>
            <AlertTitle className="font-semibold">{success}</AlertTitle>
          </Alert>
        )}

        {/* Overwrite Confirmation Dialog */}
        <Dialog open={showOverwriteDialog} onOpenChange={setShowOverwriteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="text-yellow-500 h-5 w-5" />
                Overwrite Existing Settings?
              </DialogTitle>
              <DialogDescription className="pt-4 space-y-4">
                <p>The application has already been installed with existing settings. Overwriting will:</p>
                <ul className="list-disc pl-5 space-y-1 text-left">
                  <li>Replace all current configuration settings</li>
                  <li>Update Battle.net API credentials</li>
                  <li>Update guild information and requirements</li>
                  <li>Clear the configuration cache</li>
                </ul>
                <p className="font-semibold text-yellow-600 dark:text-yellow-500">This action cannot be undone. Are you sure you want to continue?</p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOverwriteDialog(false)}>Cancel</Button>
              <Button variant="destructive" className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={async () => {
                setShowOverwriteDialog(false);
                await submitAppSettings(true);
              }}>
                Overwrite Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Database Dialog */}
        <Dialog open={showResetDialog} onOpenChange={(open) => {
          if (!open && !resetLoading) {
            setShowResetDialog(false);
            setResetError('');
            setResetSuccess('');
            setResetCredentials({ username: '', password: '' });
          }
        }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Reset Database
              </DialogTitle>
              <DialogDescription asChild>
                <div className="pt-4 space-y-4 text-left">
                  <p className="font-semibold text-destructive">⚠️ DANGER: This action will permanently delete all data!</p>
                  <p>This will wipe all guild data, member information, season stats, and error logs from the database.</p>
                  
                  {resetInfo && (
                    <div className="p-4 bg-destructive/10 rounded-md border border-destructive/20">
                      <p className="font-semibold mb-2 text-foreground">Collections to be deleted:</p>
                      <ul className="list-disc pl-5 space-y-1 mb-4">
                        {resetInfo.collectionsToReset.map((collection) => (
                          <li key={collection}>
                            <span>{collection} ({resetInfo.counts[collection] || 0} documents)</span>
                          </li>
                        ))}
                      </ul>
                      <p className="font-semibold text-green-600 dark:text-green-500">✓ Preserved: {resetInfo.collectionsToPreserve.join(', ')}</p>
                    </div>
                  )}
                  
                  <p className="font-semibold text-green-600 dark:text-green-500">✓ Preserved: App Settings & Configuration</p>
                  <p className="font-semibold text-destructive">✗ Admin account will also be deleted</p>
                  <p className="text-muted-foreground">After reset, you will need to recreate your admin account and can then re-run the installation process to fetch fresh guild data.</p>
                </div>
              </DialogDescription>
            </DialogHeader>

            {resetError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{resetError}</AlertTitle>
              </Alert>
            )}

            {resetSuccess && (
              <Alert className="mt-4 border-green-500 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>{resetSuccess}</AlertTitle>
              </Alert>
            )}

            {!resetSuccess && (
              <form onSubmit={handleResetDatabase} className="space-y-4 mt-4">
                <p className="font-semibold text-destructive">Enter admin credentials to confirm:</p>
                <div className="space-y-2">
                  <Label>Admin Username <span className="text-destructive">*</span></Label>
                  <Input
                    value={resetCredentials.username}
                    onChange={(e) => setResetCredentials(prev => ({ ...prev, username: e.target.value }))}
                    required
                    disabled={resetLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Admin Password <span className="text-destructive">*</span></Label>
                  <Input
                    type="password"
                    value={resetCredentials.password}
                    onChange={(e) => setResetCredentials(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={resetLoading}
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowResetDialog(false);
                    setResetError('');
                    setResetCredentials({ username: '', password: '' });
                  }} disabled={resetLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive" disabled={resetLoading || !resetCredentials.username || !resetCredentials.password}>
                    {resetLoading && <Spinner className="mr-2" />}
                    {resetLoading ? 'Resetting...' : 'Reset Database'}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Login Form - Show when admin exists but user is not authenticated */}
        {hasAdmin && !isAuthenticated && (
          <div className="max-w-md mx-auto p-6 bg-card text-card-foreground rounded-lg shadow border border-border">
            <h2 className="text-xl font-semibold mb-2">Admin Login Required</h2>
            <p className="text-muted-foreground mb-6">This page is protected. Please enter your admin credentials to continue.</p>
            
            {loginError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{loginError}</AlertTitle>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Username <span className="text-destructive">*</span></Label>
                <Input
                  value={loginCredentials.username}
                  onChange={(e) => setLoginCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                  disabled={loginLoading}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label>Password <span className="text-destructive">*</span></Label>
                <Input
                  type="password"
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  disabled={loginLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginLoading || !loginCredentials.username || !loginCredentials.password}>
                {loginLoading && <Spinner className="mr-2" />}
                {loginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </div>
        )}

        {/* Installation Interface - Show only when no admin exists OR user is authenticated */}
        {(!hasAdmin || isAuthenticated) && activeStep === 0 && (
          <form onSubmit={handleAppSettingsSubmit}>
            <h2 className="text-xl font-semibold mt-4 mb-4">Battle.net API Configuration</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <Label>Battle.net API Key <span className="text-destructive">*</span></Label>
                <Input
                  type="password"
                  value={appSettings.API_BATTLENET_KEY}
                  onChange={(e) => handleAppSettingsChange('API_BATTLENET_KEY', e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Your Battle.net API Client ID</p>
              </div>
              
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <Label>Battle.net API Secret <span className="text-destructive">*</span></Label>
                <Input
                  type="password"
                  value={appSettings.API_BATTLENET_SECRET}
                  onChange={(e) => handleAppSettingsChange('API_BATTLENET_SECRET', e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Your Battle.net API Client Secret</p>
              </div>
              
              <div className="space-y-2">
                <Label>Guild Name <span className="text-destructive">*</span></Label>
                <Input
                  value={appSettings.GUILD_NAME}
                  onChange={(e) => handleAppSettingsChange('GUILD_NAME', e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Guild name slug (e.g., time-and-tide)</p>
              </div>
              
              <div className="space-y-2">
                <Label>Guild Realm <span className="text-destructive">*</span></Label>
                <Input
                  value={appSettings.GUILD_REALM}
                  onChange={(e) => handleAppSettingsChange('GUILD_REALM', e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Realm slug (e.g., ravencrest)</p>
              </div>
              
              <div className="space-y-2">
                <Label>Region <span className="text-destructive">*</span></Label>
                <Select
                  value={appSettings.REGION}
                  onValueChange={(value) => handleAppSettingsChange('REGION', value)}
                  required
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
                <Label>API Parameters <span className="text-destructive">*</span></Label>
                <Input
                  value={appSettings.API_PARAM_REQUIREMENTGS}
                  onChange={(e) => handleAppSettingsChange('API_PARAM_REQUIREMENTGS', e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">e.g., namespace=profile-eu&locale=en_US</p>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Guild Configuration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="space-y-2">
                <Label>Level Requirement <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  value={appSettings.LEVEL_REQUIREMENT}
                  onChange={(e) => handleAppSettingsChange('LEVEL_REQUIREMENT', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Item Level Requirement <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  value={appSettings.ITEM_LEVEL_REQUIREMENT}
                  onChange={(e) => handleAppSettingsChange('ITEM_LEVEL_REQUIREMENT', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Min Check Cap <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  value={appSettings.MIN_CHECK_CAP}
                  onChange={(e) => handleAppSettingsChange('MIN_CHECK_CAP', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Max Check Cap <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  value={appSettings.MAX_CHECK_CAP}
                  onChange={(e) => handleAppSettingsChange('MAX_CHECK_CAP', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Min Tier Item Level <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  value={appSettings.MIN_TIER_ITEMLEVEL}
                  onChange={(e) => handleAppSettingsChange('MIN_TIER_ITEMLEVEL', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Season Start Date <span className="text-destructive">*</span></Label>
                <Input
                  type="date"
                  value={appSettings.SEASON_START_DATE}
                  onChange={(e) => handleAppSettingsChange('SEASON_START_DATE', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Current Raid <span className="text-destructive">*</span></Label>
                <Input
                  value={appSettings.CURRENT_RAID}
                  onChange={(e) => handleAppSettingsChange('CURRENT_RAID', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Current M+ Season <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  value={appSettings.CURRENT_MPLUS_SEASON}
                  onChange={(e) => handleAppSettingsChange('CURRENT_MPLUS_SEASON', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Advanced Configuration</h2>
            <div className="grid grid-cols-1 gap-4 mb-8">
              <div className="space-y-2">
                <Label>Guild Rank Requirement <span className="text-destructive">*</span></Label>
                <Input
                  value={Array.isArray(appSettings.GUILD_RANK_REQUIREMENT) ? appSettings.GUILD_RANK_REQUIREMENT.join(',') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                    handleAppSettingsChange('GUILD_RANK_REQUIREMENT', values);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Comma-separated guild rank IDs (e.g., 0,1,2,3,4,5,6,7,8,9,10)</p>
              </div>
              
              <div className="space-y-2">
                <Label>Main Ranks <span className="text-destructive">*</span></Label>
                <Input
                  value={Array.isArray(appSettings.MAIN_RANKS) ? appSettings.MAIN_RANKS.join(',') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                    handleAppSettingsChange('MAIN_RANKS', values);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Comma-separated rank IDs considered as mains (e.g., 0,1,2,3,4,5,6,7)</p>
              </div>
              
              <div className="space-y-2">
                <Label>Alt Ranks <span className="text-destructive">*</span></Label>
                <Input
                  value={Array.isArray(appSettings.ALT_RANKS) ? appSettings.ALT_RANKS.join(',') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
                    handleAppSettingsChange('ALT_RANKS', values);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Comma-separated rank IDs considered as alts (e.g., 8,9,10)</p>
              </div>
              
              <div className="space-y-2">
                <Label>Tank Specializations <span className="text-destructive">*</span></Label>
                <Input
                  value={Array.isArray(appSettings.TANKS) ? appSettings.TANKS.join(', ') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('TANKS', values);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Comma-separated tank spec names (e.g., Blood, Vengeance, Guardian, Brewmaster, Protection)</p>
              </div>
              
              <div className="space-y-2">
                <Label>Healer Specializations <span className="text-destructive">*</span></Label>
                <Input
                  value={Array.isArray(appSettings.HEALERS) ? appSettings.HEALERS.join(', ') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('HEALERS', values);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Comma-separated healer spec names (e.g., Preservation, Mistweaver, Holy, Discipline, Restoration)</p>
              </div>
              
              <div className="space-y-2">
                <Label>Enchantable Pieces <span className="text-destructive">*</span></Label>
                <Input
                  value={Array.isArray(appSettings.ENCHANTABLE_PIECES) ? appSettings.ENCHANTABLE_PIECES.join(', ') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('ENCHANTABLE_PIECES', values);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Comma-separated slot names (e.g., WRIST, LEGS, FEET, CHEST, MAIN_HAND, FINGER_1, FINGER_2)</p>
              </div>
              
              <div className="space-y-2">
                <Label>Difficulty Modes <span className="text-destructive">*</span></Label>
                <Input
                  value={Array.isArray(appSettings.DIFFICULTY) ? appSettings.DIFFICULTY.join(', ') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('DIFFICULTY', values);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Comma-separated difficulty names (e.g., Mythic, Heroic, Normal)</p>
              </div>
              
              <div className="space-y-2">
                <Label>Guild Rank Names <span className="text-destructive">*</span></Label>
                <Textarea
                  rows={4}
                  value={Array.isArray(appSettings.GUILLD_RANKS) ? appSettings.GUILLD_RANKS.join(',\n') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(/[,\n]/).map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('GUILLD_RANKS', values);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">One rank name per line or comma-separated (e.g., Guild Lead, Officer, Member, Alt)</p>
              </div>
              
              <div className="space-y-2">
                <Label>Current Season Tier Sets <span className="text-destructive">*</span></Label>
                <Textarea
                  rows={6}
                  value={Array.isArray(appSettings.CURRENT_SEASON_TIER_SETS) ? appSettings.CURRENT_SEASON_TIER_SETS.join(',\n') : ''}
                  onChange={(e) => {
                    const values = e.target.value.split(/[,\n]/).map(v => v.trim()).filter(v => v);
                    handleAppSettingsChange('CURRENT_SEASON_TIER_SETS', values);
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">One tier set name per line or comma-separated</p>
              </div>
            </div>

            {validationResult && validationResult.isValid && (
              <Alert className="mb-6 border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4 stroke-current" />
                <AlertTitle className="mb-0 flex items-center">
                  API credentials validated successfully! Found {validationResult.guildMembers} guild members.
                </AlertTitle>
              </Alert>
            )}

            <div className="flex justify-end gap-4 mt-6">
              {isInstalled && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
                    fetch(`${API_BASE_URL}/api/install`)
                      .then(res => res.json())
                      .then(data => {
                        if (data.suggestedStep !== undefined) {
                          setActiveStep(data.suggestedStep);
                        } else if (data.hasGuildData && !data.hasAdmin) {
                          setActiveStep(2);
                        } else if (!data.hasGuildData) {
                          setActiveStep(1);
                        } else {
                          setActiveStep(2);
                        }
                      })
                      .catch(err => {
                        console.error('Error checking status:', err);
                        setActiveStep(1);
                      });
                  }}
                >
                  Skip to Next Step
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading && <Spinner className="mr-2" />}
                {loading ? 'Validating & Saving...' : isInstalled ? 'Update Settings & Validate' : 'Save Settings & Validate'}
              </Button>
            </div>
          </form>
        )}

        {activeStep === 1 && (
          <div>
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => setActiveStep(2)}
              >
                Skip Guild Fetch
              </Button>
            </div>
            
            <div className="flex flex-col gap-8 min-h-[70vh]">
              <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">
                Fetching Guild Data
              </h2>

              {error && activeStep === 1 && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-semibold flex items-center justify-between">
                    <span>{error}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        setActiveStep(0);
                        setError('');
                        setErrorDetails(null);
                      }}
                    >
                      Go Back to Fix
                    </Button>
                  </AlertTitle>
                  {errorDetails && errorDetails.suggestion && (
                    <AlertDescription className="mt-2">
                      {errorDetails.suggestion}
                    </AlertDescription>
                  )}
                </Alert>
              )}

              {!fetchingGuild && !fetchProgress && (
                <div className="mb-4">
                  {hasGuildData && (
                    <Alert className="mb-4 border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Guild data already exists in the database. You can skip this step or fetch fresh data.</AlertTitle>
                    </Alert>
                  )}
                  <Button onClick={fetchGuildData} disabled={loading} className="mb-4">
                    Start Guild Fetch
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {hasGuildData 
                      ? 'Guild data exists. Click to fetch fresh data, or skip to proceed to admin account creation.'
                      : 'Click the button above to start fetching guild data, or skip this step to proceed to admin account creation.'}
                  </p>
                </div>
              )}

              {(fetchingGuild || fetchProgress) && (
                <div className="w-full mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {fetchProgress || 'Initializing...'}
                    </h3>
                    {totalMembers > 0 && (
                      <span className="text-md font-semibold text-yellow-400">
                        {totalProcessed} / {totalMembers}
                      </span>
                    )}
                  </div>
                  
                  {totalMembers > 0 && (
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-yellow-400 transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                        style={{ width: `${(totalProcessed / totalMembers) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {(fetchingGuild || newCharacters.length > 0) && (
                <div className="w-full mt-4">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Recently Processed Characters
                  </h3>
                  
                  <div className="flex gap-4 w-full overflow-hidden">
                    {newCharacters.length > 0 ? (
                      newCharacters.slice(-10).map((character, index) => (
                        <CharacterCard
                          key={`${character.name}-${character.server}-${index}`}
                          character={character}
                          index={index}
                          total={newCharacters.slice(-10).length}
                        />
                      ))
                    ) : (
                      <div className="w-full flex items-center justify-center min-h-[200px] text-muted-foreground">
                        <p>Characters will appear here as they are processed...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {(!hasAdmin || isAuthenticated) && activeStep === 2 && (
          <form onSubmit={handleAdminSubmit}>
            <h2 className="text-xl font-semibold mt-4 mb-2">Create Admin Account</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Create an admin account to manage the application. Password must be at least 12 characters with uppercase, lowercase, numbers, and special characters.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Username <span className="text-destructive">*</span></Label>
                <Input
                  value={adminSettings.username}
                  onChange={(e) => handleAdminSettingsChange('username', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Password <span className="text-destructive">*</span></Label>
                <Input
                  type="password"
                  value={adminSettings.password}
                  onChange={(e) => handleAdminSettingsChange('password', e.target.value)}
                  required
                  className={passwordErrors.length > 0 ? 'border-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground">
                  {passwordErrors.length > 0 ? <span className="text-destructive">{passwordErrors[0]}</span> : 'Minimum 12 characters with uppercase, lowercase, numbers, and special characters'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Confirm Password <span className="text-destructive">*</span></Label>
                <Input
                  type="password"
                  value={adminSettings.confirmPassword}
                  onChange={(e) => handleAdminSettingsChange('confirmPassword', e.target.value)}
                  required
                  className={adminSettings.password !== adminSettings.confirmPassword && adminSettings.confirmPassword.length > 0 ? 'border-destructive' : ''}
                />
                {adminSettings.password !== adminSettings.confirmPassword && adminSettings.confirmPassword.length > 0 && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>

              {passwordErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Password requirements not met:</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {passwordErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-end gap-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveStep(0)}>
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Spinner className="mr-2" />}
                  {loading ? 'Creating...' : 'Create Admin Account'}
                </Button>
              </div>
            </div>
          </form>
        )}
        
        </div>
      </div>
    </div>
  );
}

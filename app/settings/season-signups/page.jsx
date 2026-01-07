'use client';

/**
 * @file Season Signups management page for admin
 * @module app/settings/season-signups/page
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

export default function SeasonSignupsPage() {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [signupToDelete, setSignupToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get Basic Auth header
  const getAuthHeader = () => {
    const username = sessionStorage.getItem('settings_username');
    const password = sessionStorage.getItem('settings_password');
    if (username && password) {
      return 'Basic ' + btoa(`${username}:${password}`);
    }
    return null;
  };

  // Fetch signups
  const fetchSignups = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/season-signups', {
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
          setError(data.message || data.error || 'Failed to load signups');
        }
        return;
      }

      setSignups(data.signups || []);
    } catch (error) {
      console.error('Error fetching signups:', error);
      setError('Failed to load signups. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem('settings_authenticated');
    if (authStatus === 'true') {
      fetchSignups();
    }
  }, []);

  // Handle delete
  const handleDeleteClick = (signup) => {
    setSignupToDelete(signup);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!signupToDelete) return;

    try {
      setDeleting(true);
      setError('');
      
      const response = await fetch(`/api/season-signups/${signupToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please login again.');
          sessionStorage.removeItem('settings_authenticated');
        } else {
          setError(data.message || data.error || 'Failed to delete signup');
        }
        return;
      }

      setSuccess('Signup deleted successfully!');
      setDeleteDialogOpen(false);
      setSignupToDelete(null);
      await fetchSignups();
    } catch (error) {
      console.error('Error deleting signup:', error);
      setError('Failed to delete signup. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter signups based on search term
  const filteredSignups = signups.filter(signup => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const seasonCharName = signup.seasonCharacterName || signup.season3CharacterName || ''
    const seasonGoal = signup.seasonGoal || signup.season3Goal || ''
    return (
      signup.currentCharacterName?.toLowerCase().includes(search) ||
      seasonCharName.toLowerCase().includes(search) ||
      signup.characterClass?.toLowerCase().includes(search) ||
      signup.mainSpec?.toLowerCase().includes(search) ||
      seasonGoal.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Season Signups Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchSignups}
          disabled={loading}
        >
          Refresh
        </Button>
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

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by character name, class, spec, or goal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Paper>

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Current Character</TableCell>
                <TableCell>Season Character</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Main Spec</TableCell>
                <TableCell>Season Goal</TableCell>
                <TableCell>Signed Up</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSignups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm ? 'No signups match your search.' : 'No signups found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSignups.map((signup) => (
                  <TableRow key={signup._id} hover>
                    <TableCell>{signup.currentCharacterName || '-'}</TableCell>
                    <TableCell>
                      {signup.seasonCharacterName || signup.season3CharacterName || '-'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={signup.characterClass || '-'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{signup.mainSpec || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={signup.seasonGoal || signup.season3Goal || '-'} 
                        size="small" 
                        color={
                          (signup.seasonGoal || signup.season3Goal) === 'CE' ? 'error' :
                          (signup.seasonGoal || signup.season3Goal) === 'AOTC' ? 'warning' :
                          'default'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {signup.timestamp 
                        ? new Date(signup.timestamp).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete signup">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(signup)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredSignups.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredSignups.length} of {signups.length} signup{signups.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          if (!deleting) {
            setDeleteDialogOpen(false);
            setSignupToDelete(null);
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Signup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the signup for{' '}
            <strong>{signupToDelete?.seasonCharacterName || signupToDelete?.season3CharacterName || signupToDelete?.currentCharacterName}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDeleteDialogOpen(false);
              setSignupToDelete(null);
            }}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


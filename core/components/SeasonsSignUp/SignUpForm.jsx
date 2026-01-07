'use client'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'
import { classSpecs, classColors, tankSpecs, healerSpecs } from '../SeasonsStats/constants'

const SignUpForm = ({ open, onClose, onSubmit, loading, error, guildData }) => {
    const [formData, setFormData] = useState({
        discordName: '',
        currentCharacterName: '',
        season3CharacterName: '',
        characterClass: '',
        mainSpec: '',
        offSpec: '',
        returningToRaid: false,
        season3Goal: '',
        wantToPushKeys: false
    })

    const [validationErrors, setValidationErrors] = useState({})
    const [searchResults, setSearchResults] = useState([])
    const [season3SearchResults, setSeason3SearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [isSeason3Searching, setIsSeason3Searching] = useState(false)
    const [selectedCharacter, setSelectedCharacter] = useState(null)
    const [selectedSeason3Character, setSelectedSeason3Character] = useState(null)
    const [searchTimeout, setSearchTimeout] = useState(null)
    const [season3SearchTimeout, setSeason3SearchTimeout] = useState(null)
    const [showSeason3Placeholder, setShowSeason3Placeholder] = useState(false)

    // Debounced search function for current character
    const debouncedSearch = (searchTerm) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }

        const timeout = setTimeout(() => {
            if (searchTerm.trim().length >= 2) {
                performSearch(searchTerm, 'current')
            } else {
                setSearchResults([])
                setSelectedCharacter(null)
            }
        }, 200)

        setSearchTimeout(timeout)
    }

    // Debounced search function for season 3 character
    const debouncedSeason3Search = (searchTerm) => {
        if (season3SearchTimeout) {
            clearTimeout(season3SearchTimeout)
        }

        const timeout = setTimeout(() => {
            if (searchTerm.trim().length >= 2) {
                performSearch(searchTerm, 'season3')
            } else {
                setSeason3SearchResults([])
                setSelectedSeason3Character(null)
                setShowSeason3Placeholder(false)
            }
        }, 200)

        setSeason3SearchTimeout(timeout)
    }

    // Perform character search
    const performSearch = (searchTerm, type) => {
        if (type === 'current') {
            setIsSearching(true)
        } else {
            setIsSeason3Searching(true)
        }
        
        const normalizedSearch = searchTerm.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim()
        
        // Special character name mappings
        const specialMappings = {
            'lickms': 'lickmapal',
            'lickmapal': 'lickms',
        }
        
        const results = guildData
            .filter(char => {
                const normalizedName = char.name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim()
                
                // Check for special mappings
                const specialMatch = specialMappings[normalizedSearch] === normalizedName || 
                                   specialMappings[normalizedName] === normalizedSearch
                
                // Multiple search strategies
                const exactMatch = normalizedName === normalizedSearch
                const startsWith = normalizedName.startsWith(normalizedSearch)
                const endsWith = normalizedName.endsWith(normalizedSearch)
                const containsMatch = normalizedName.includes(normalizedSearch)
                const searchContainsName = normalizedSearch.includes(normalizedName)
                
                // Handle common variations
                const nameWords = normalizedName.split(/[\s\-_]+/)
                const searchWords = normalizedSearch.split(/[\s\-_]+/)
                const wordMatch = nameWords.some(word => 
                    searchWords.some(searchWord => 
                        word.includes(searchWord) || searchWord.includes(word)
                    )
                )
                
                const isMatch = exactMatch || startsWith || endsWith || containsMatch || searchContainsName || wordMatch || specialMatch
                
                return isMatch
            })
            .sort((a, b) => {
                const aName = a.name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim()
                const bName = b.name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim()
                
                const aExact = aName === normalizedSearch
                const bExact = bName === normalizedSearch
                const aStartsWith = aName.startsWith(normalizedSearch)
                const bStartsWith = bName.startsWith(normalizedSearch)
                
                if (aExact && !bExact) return -1
                if (!aExact && bExact) return 1
                if (aStartsWith && !bStartsWith) return -1
                if (!aStartsWith && bStartsWith) return 1
                return aName.localeCompare(bName)
            })
            .slice(0, 5)
        
        if (type === 'current') {
            setSearchResults(results)
            setIsSearching(false)
        } else {
            setSeason3SearchResults(results)
            setIsSeason3Searching(false)
            setShowSeason3Placeholder(results.length === 0 && searchTerm.trim().length >= 2)
        }
    }

    // Handle character selection for current character
    const handleCharacterSelect = (character) => {
        setSelectedCharacter(character)
        setFormData(prev => ({
            ...prev,
            currentCharacterName: character.name,
            characterClass: character.class || '',
            mainSpec: '',
            offSpec: ''
        }))
        setSearchResults([])
    }

    // Handle character selection for season 3 character
    const handleSeason3CharacterSelect = (character) => {
        setSelectedSeason3Character(character)
        setFormData(prev => ({
            ...prev,
            season3CharacterName: character.name,
            characterClass: character.class || formData.characterClass,
            mainSpec: formData.mainSpec || '',
            offSpec: formData.offSpec || ''
        }))
        setSeason3SearchResults([])
        setShowSeason3Placeholder(false)
    }

    // Handle input change with search
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }

        if (field === 'currentCharacterName') {
            debouncedSearch(value)
        }

        if (field === 'currentCharacterName' && formData.season3CharacterName === formData.currentCharacterName) {
            setFormData(prev => ({
                ...prev,
                season3CharacterName: value
            }))
        }
    }

    // Handle season 3 character name change
    const handleSeason3NameChange = (value) => {
        setFormData(prev => ({
            ...prev,
            season3CharacterName: value
        }))

        if (validationErrors.season3CharacterName) {
            setValidationErrors(prev => ({
                ...prev,
                season3CharacterName: ''
            }))
        }

        debouncedSeason3Search(value)
    }

    // Check if character name is a test/demo character
    const isTestOrDemoCharacter = (name) => {
        if (!name) return false
        const normalizedName = name.toLowerCase().trim()
        const testPatterns = [
            'test', 'demo', 'example', 'sample', 'tester', 'testing',
            'dummy', 'fake', 'placeholder', 'temp', 'temporary'
        ]
        return testPatterns.some(pattern => normalizedName.includes(pattern))
    }

    const validateForm = () => {
        const errors = {}
        
        if (!formData.discordName.trim()) {
            errors.discordName = 'Discord name is required'
        }
        
        if (!formData.currentCharacterName.trim()) {
            errors.currentCharacterName = 'Current character name is required'
        } else if (isTestOrDemoCharacter(formData.currentCharacterName)) {
            errors.currentCharacterName = 'Test or demo characters are not allowed'
        }
        
        if (!formData.season3CharacterName.trim()) {
            errors.season3CharacterName = 'Season character name is required'
        } else if (isTestOrDemoCharacter(formData.season3CharacterName)) {
            errors.season3CharacterName = 'Test or demo characters are not allowed'
        }
        
        if (!formData.characterClass) {
            errors.characterClass = 'Character class is required'
        }
        
        if (!formData.mainSpec) {
            errors.mainSpec = 'Main spec is required'
        }
        
        if (!formData.season3Goal) {
            errors.season3Goal = 'Season goal is required'
        }
        
        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = () => {
        if (validateForm()) {
            // Normalize form data to use new field names (support both old and new)
            const normalizedFormData = {
                ...formData,
                seasonCharacterName: formData.seasonCharacterName || formData.season3CharacterName,
                seasonGoal: formData.seasonGoal || formData.season3Goal,
                // Keep old fields for backward compatibility with backend
                season3CharacterName: formData.season3CharacterName || formData.seasonCharacterName,
                season3Goal: formData.season3Goal || formData.seasonGoal,
            }
            onSubmit(normalizedFormData)
        }
    }

    const handleClose = () => {
        setFormData({
            discordName: '',
            currentCharacterName: '',
            season3CharacterName: '',
            characterClass: '',
            mainSpec: '',
            offSpec: '',
            returningToRaid: false,
            season3Goal: '',
            wantToPushKeys: false
        })
        setValidationErrors({})
        setSearchResults([])
        setSeason3SearchResults([])
        setSelectedCharacter(null)
        setSelectedSeason3Character(null)
        setIsSearching(false)
        setIsSeason3Searching(false)
        setShowSeason3Placeholder(false)
        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }
        if (season3SearchTimeout) {
            clearTimeout(season3SearchTimeout)
        }
        onClose()
    }

    const getAvailableSpecs = (characterClass) => {
        return classSpecs[characterClass] || []
    }

    const getRoleFromSpec = (spec) => {
        if (tankSpecs.includes(spec)) return 'Tank'
        if (healerSpecs.includes(spec)) return 'Healer'
        return 'DPS'
    }

    // Character preview component
    const CharacterPreview = ({ character, isSeason3 = false }) => {
        if (!character) return null

        return (
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {character.media?.assets?.length ? (
                        <img
                            src={character.media.assets[1].value}
                            alt={character.name}
                            style={{ 
                                width: 50, 
                                height: 50, 
                                borderRadius: '50%',
                                marginRight: '1rem',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: 50,
                                height: 50,
                                borderRadius: '50%',
                                marginRight: '1rem',
                                bgcolor: 'grey.300',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Typography variant="caption" color="text.secondary">
                                {character.name.charAt(0).toUpperCase()}
                            </Typography>
                        </Box>
                    )}

                    <Box>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                color: classColors[character.class] || '#ffffff',
                                textTransform: 'capitalize',
                                fontWeight: 'bold'
                            }}
                        >
                            {character.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {character.class} • Level {character.level || '80'} • Item Level {character.itemLevel || '??'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isSeason3 ? 'Season Character' : 'Current Character'}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        )
    }

    // Season 3 Placeholder Form Component
    const Season3PlaceholderForm = () => {
        if (!showSeason3Placeholder) return null

        return (
            <Paper sx={{ p: 3, mt: 2, mb: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'warning.main' }}>
                <Typography variant="subtitle1" color="warning.main" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Character not found in guild data. Please provide details manually:
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Character Class</InputLabel>
                            <Select
                                value={formData.characterClass}
                                onChange={(e) => handleInputChange('characterClass', e.target.value)}
                                label="Character Class"
                            >
                                {Object.keys(classSpecs).map((className) => (
                                    <MenuItem key={className} value={className}>
                                        {className}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Main Spec</InputLabel>
                            <Select
                                value={formData.mainSpec}
                                onChange={(e) => handleInputChange('mainSpec', e.target.value)}
                                label="Main Spec"
                                disabled={!formData.characterClass}
                            >
                                {getAvailableSpecs(formData.characterClass).map((spec) => (
                                    <MenuItem key={spec} value={spec}>
                                        {spec} ({getRoleFromSpec(spec)})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Off Spec (Optional)</InputLabel>
                            <Select
                                value={formData.offSpec}
                                onChange={(e) => handleInputChange('offSpec', e.target.value)}
                                label="Off Spec (Optional)"
                                disabled={!formData.characterClass}
                            >
                                <MenuItem value="">None</MenuItem>
                                {getAvailableSpecs(formData.characterClass).map((spec) => (
                                    <MenuItem key={spec} value={spec}>
                                        {spec} ({getRoleFromSpec(spec)})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
        )
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>Sign Up for Season</DialogTitle>
            <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {/* Discord Name */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                            Contact Information
                        </Typography>
                        <TextField
                            fullWidth
                            label="Discord Name"
                            value={formData.discordName}
                            onChange={(e) => handleInputChange('discordName', e.target.value)}
                            error={!!validationErrors.discordName}
                            helperText={validationErrors.discordName || "Enter your Discord username (e.g., username#1234 or username)"}
                            placeholder="username#1234"
                            sx={{ mb: 2 }}
                        />
                    </Grid>

                    {/* Current Character Search */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                            Current Character
                        </Typography>
                        <TextField
                            fullWidth
                            label="Current Character Name"
                            value={formData.currentCharacterName}
                            onChange={(e) => handleInputChange('currentCharacterName', e.target.value)}
                            error={!!validationErrors.currentCharacterName}
                            helperText={validationErrors.currentCharacterName || "Start typing to search for your character, then click on a character card to select"}
                            InputProps={{
                                endAdornment: isSearching && (
                                    <CircularProgress size={20} />
                                )
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <Paper sx={{ mt: 1, maxHeight: 200, overflow: 'auto', mb: 2 }}>
                                {searchResults.map((char) => (
                                    <Box
                                        key={char.name}
                                        sx={{
                                            p: 2,
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'action.hover' },
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                        onClick={() => handleCharacterSelect(char)}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {char.media?.assets?.length ? (
                                                <img
                                                    src={char.media.assets[1].value}
                                                    alt={char.name}
                                                    style={{ 
                                                        width: 40, 
                                                        height: 40, 
                                                        borderRadius: '50%',
                                                        marginRight: '1rem',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        marginRight: '1rem',
                                                        bgcolor: 'grey.300',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <Typography variant="caption" color="text.secondary">
                                                        {char.name.charAt(0).toUpperCase()}
                                                    </Typography>
                                                </Box>
                                            )}
                                            <Box>
                                                <Typography 
                                                    variant="body1" 
                                                    sx={{ 
                                                        color: classColors[char.class] || '#ffffff',
                                                        textTransform: 'capitalize',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {char.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {char.class} • Level {char.level || '80'} • Item Level {char.itemLevel || '??'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Paper>
                        )}

                        {/* Character Not Found Warning */}
                        {formData.currentCharacterName.trim().length >= 2 && 
                         searchResults.length === 0 && 
                         !isSearching && 
                         !selectedCharacter && (
                            <Alert severity="warning" sx={{ mt: 1, mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Character not found in guild data. You can still proceed with manual entry.
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Available characters: {guildData.slice(0, 10).map(c => c.name).join(', ')}
                                    {guildData.length > 10 && ` ... and ${guildData.length - 10} more`}
                                </Typography>
                            </Alert>
                        )}

                        {/* Selected Character Preview */}
                        {selectedCharacter && (
                            <CharacterPreview character={selectedCharacter} />
                        )}
                    </Grid>

                    {/* Season 3 Character Search */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                            Season 3 Character
                        </Typography>
                        <TextField
                            fullWidth
                            label="Season 3 Character Name"
                            value={formData.season3CharacterName}
                            onChange={(e) => handleSeason3NameChange(e.target.value)}
                            error={!!validationErrors.season3CharacterName}
                            helperText={validationErrors.season3CharacterName || "Start typing to search for your season character, then click on a character card to select"}
                            InputProps={{
                                endAdornment: isSeason3Searching && (
                                    <CircularProgress size={20} />
                                )
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        {/* Season 3 Search Results */}
                        {season3SearchResults.length > 0 && (
                            <Paper sx={{ mt: 1, maxHeight: 200, overflow: 'auto', mb: 2 }}>
                                {season3SearchResults.map((char) => (
                                    <Box
                                        key={char.name}
                                        sx={{
                                            p: 2,
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'action.hover' },
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                        onClick={() => handleSeason3CharacterSelect(char)}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {char.media?.assets?.length ? (
                                                <img
                                                    src={char.media.assets[1].value}
                                                    alt={char.name}
                                                    style={{ 
                                                        width: 40, 
                                                        height: 40, 
                                                        borderRadius: '50%',
                                                        marginRight: '1rem',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            ) : (
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        marginRight: '1rem',
                                                        bgcolor: 'grey.300',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <Typography variant="caption" color="text.secondary">
                                                        {char.name.charAt(0).toUpperCase()}
                                                    </Typography>
                                                </Box>
                                            )}
                                            <Box>
                                                <Typography 
                                                    variant="body1" 
                                                    sx={{ 
                                                        color: classColors[char.class] || '#ffffff',
                                                        textTransform: 'capitalize',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {char.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {char.class} • Level {char.level || '80'} • Item Level {char.itemLevel || '??'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Paper>
                        )}

                        {/* Season 3 Character Not Found - Show Placeholder Form */}
                        <Season3PlaceholderForm />
                        
                        {/* Selected Season 3 Character Preview */}
                        {selectedSeason3Character && (
                            <CharacterPreview character={selectedSeason3Character} isSeason3={true} />
                        )}
                    </Grid>

                    {/* Character Class - Only show if not in placeholder form */}
                    {!showSeason3Placeholder && (
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!validationErrors.characterClass}>
                                <InputLabel>Character Class</InputLabel>
                                <Select
                                    value={formData.characterClass}
                                    onChange={(e) => handleInputChange('characterClass', e.target.value)}
                                    label="Character Class"
                                >
                                    {Object.keys(classSpecs).map((className) => (
                                        <MenuItem key={className} value={className}>
                                            {className}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {validationErrors.characterClass && (
                                    <Typography variant="caption" color="error">
                                        {validationErrors.characterClass}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    )}

                    {/* Main Spec - Only show if not in placeholder form */}
                    {!showSeason3Placeholder && (
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!validationErrors.mainSpec}>
                                <InputLabel>Main Spec</InputLabel>
                                <Select
                                    value={formData.mainSpec}
                                    onChange={(e) => handleInputChange('mainSpec', e.target.value)}
                                    label="Main Spec"
                                    disabled={!formData.characterClass}
                                >
                                    {getAvailableSpecs(formData.characterClass).map((spec) => (
                                        <MenuItem key={spec} value={spec}>
                                            {spec} ({getRoleFromSpec(spec)})
                                        </MenuItem>
                                    ))}
                                </Select>
                                {validationErrors.mainSpec && (
                                    <Typography variant="caption" color="error">
                                        {validationErrors.mainSpec}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    )}

                    {/* Off Spec - Only show if not in placeholder form */}
                    {!showSeason3Placeholder && (
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Off Spec (Optional)</InputLabel>
                                <Select
                                    value={formData.offSpec}
                                    onChange={(e) => handleInputChange('offSpec', e.target.value)}
                                    label="Off Spec (Optional)"
                                    disabled={!formData.characterClass}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {getAvailableSpecs(formData.characterClass).map((spec) => (
                                        <MenuItem key={spec} value={spec}>
                                            {spec} ({getRoleFromSpec(spec)})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    {/* Season 3 Goal */}
                    <Grid item xs={12}>
                        <FormControl fullWidth error={!!validationErrors.season3Goal}>
                            <InputLabel>Season 3 Goal</InputLabel>
                            <Select
                                value={formData.season3Goal}
                                onChange={(e) => handleInputChange('season3Goal', e.target.value)}
                                label="Season 3 Goal"
                            >
                                <MenuItem value="AOTC">AOTC (Ahead of the Curve)</MenuItem>
                                <MenuItem value="CE">CE (Cutting Edge)</MenuItem>
                                <MenuItem value="Social">Social Raiding</MenuItem>
                            </Select>
                            {validationErrors.season3Goal && (
                                <Typography variant="caption" color="error">
                                    {validationErrors.season3Goal}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    {/* Switches */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.returningToRaid}
                                        onChange={(e) => handleInputChange('returningToRaid', e.target.checked)}
                                    />
                                }
                                label="Returning to raid in Season 3"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.wantToPushKeys}
                                        onChange={(e) => handleInputChange('wantToPushKeys', e.target.checked)}
                                    />
                                }
                                label="Want to push keys in Season 3"
                            />
                        </Box>
                    </Grid>
                </Grid>
                {error && (
                    <Alert severity="error" sx={{ mt: 3 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button 
                    onClick={handleClose} 
                    disabled={loading}
                    variant="contained"
                    color="secondary"
                    sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        borderRadius: 0.5,
                        textTransform: 'none',
                        backgroundColor: '#2a4a4f',
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#3a5a5f',
                            transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                    sx={{
                        px: 3,
                        py: 1.5,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        borderRadius: 0.5,
                        textTransform: 'none',
                        backgroundColor: '#153034',
                        color: '#ffffff',

                        '&:hover': {
                            backgroundColor: '#1a3d42',
                            transform: 'translateY(-1px)'
                        },
                        '&:disabled': {
                            backgroundColor: '#0f1f22',
                            color: '#a0a0a0',
                            transform: 'none'
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    {loading ? 'Submitting...' : 'Sign Up'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SignUpForm 
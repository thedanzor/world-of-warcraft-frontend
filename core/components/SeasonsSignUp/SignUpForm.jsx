'use client'
import React, { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { classSpecs, classColors, tankSpecs, healerSpecs } from '../SeasonsStats/constants'

// Helper function to capitalize character names
const capitalizeCharacterName = (name) => {
    if (!name) return name
    // Split by hyphen to handle "name-realm" format, capitalize each part
    return name.split('-').map(part => {
        if (!part) return part
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    }).join('-')
}

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
            <div className="p-4 mb-4 bg-card border border-border rounded-md">
                <div className="flex items-center">
                    {character.media?.assets?.length ? (
                        <img
                            src={character.media.assets[1].value}
                            alt={capitalizeCharacterName(character.name)}
                            className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full mr-4 bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                                {capitalizeCharacterName(character.name).charAt(0)}
                            </span>
                        </div>
                    )}

                    <div>
                        <h4 
                            className="text-base font-bold capitalize"
                            style={{ color: classColors[character.class] || '#ffffff' }}
                        >
                            {capitalizeCharacterName(character.name)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            {character.class} • Level {character.level || '80'} • Item Level {character.itemLevel || '??'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {isSeason3 ? 'Season Character' : 'Current Character'}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Season 3 Placeholder Form Component
    const Season3PlaceholderForm = () => {
        if (!showSeason3Placeholder) return null

        return (
            <div className="p-6 mt-4 mb-4 bg-card border border-amber-500/50 rounded-md">
                <h4 className="text-sm font-bold text-amber-500 mb-6">
                    Character not found in guild data. Please provide details manually:
                </h4>
                <div className="grid gap-6">
                    <div className="space-y-2">
                        <Label>Character Class</Label>
                        <Select
                            value={formData.characterClass}
                            onValueChange={(value) => handleInputChange('characterClass', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(classSpecs).map((className) => (
                                    <SelectItem key={className} value={className}>
                                        {className}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Main Spec</Label>
                        <Select
                            value={formData.mainSpec}
                            onValueChange={(value) => handleInputChange('mainSpec', value)}
                            disabled={!formData.characterClass}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select main spec" />
                            </SelectTrigger>
                            <SelectContent>
                                {getAvailableSpecs(formData.characterClass).map((spec) => (
                                    <SelectItem key={spec} value={spec}>
                                        {spec} ({getRoleFromSpec(spec)})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Off Spec (Optional)</Label>
                        <Select
                            value={formData.offSpec}
                            onValueChange={(value) => handleInputChange('offSpec', value)}
                            disabled={!formData.characterClass}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select off spec" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {getAvailableSpecs(formData.characterClass).map((spec) => (
                                    <SelectItem key={spec} value={spec}>
                                        {spec} ({getRoleFromSpec(spec)})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose() }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Sign Up for Season</DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                    {/* Discord Name */}
                    <div className="space-y-3">
                        <h3 className="text-md font-medium text-primary">Contact Information</h3>
                        <div className="space-y-2">
                            <Label htmlFor="discordName">Discord Name</Label>
                            <Input
                                id="discordName"
                                value={formData.discordName}
                                onChange={(e) => handleInputChange('discordName', e.target.value)}
                                placeholder="username#1234"
                                aria-invalid={!!validationErrors.discordName}
                            />
                            <p className={`text-xs ${validationErrors.discordName ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {validationErrors.discordName || "Enter your Discord username (e.g., username#1234 or username)"}
                            </p>
                        </div>
                    </div>

                    {/* Current Character Search */}
                    <div className="space-y-3">
                        <h3 className="text-md font-medium text-primary">Current Character</h3>
                        <div className="space-y-2 relative">
                            <Label htmlFor="currentCharacterName">Current Character Name</Label>
                            <div className="relative">
                                <Input
                                    id="currentCharacterName"
                                    value={formData.currentCharacterName}
                                    onChange={(e) => handleInputChange('currentCharacterName', e.target.value)}
                                    aria-invalid={!!validationErrors.currentCharacterName}
                                    className="pr-8"
                                />
                                {isSearching && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <Spinner className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            <p className={`text-xs ${validationErrors.currentCharacterName ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {validationErrors.currentCharacterName || "Start typing to search for your character, then click on a character card to select"}
                            </p>
                        </div>
                        
                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="mt-2 max-h-[200px] overflow-auto bg-card border border-border rounded-md mb-4">
                                {searchResults.map((char) => (
                                    <div
                                        key={char.name}
                                        className="p-4 cursor-pointer hover:bg-accent border-b border-border transition-colors last:border-0"
                                        onClick={() => handleCharacterSelect(char)}
                                    >
                                        <div className="flex items-center">
                                            {char.media?.assets?.length ? (
                                                <img
                                                    src={char.media.assets[1].value}
                                                    alt={char.name}
                                                    className="w-10 h-10 rounded-full mr-4 object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full mr-4 bg-muted flex items-center justify-center">
                                                    <span className="text-xs text-muted-foreground">
                                                        {char.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p 
                                                    className="text-sm font-bold capitalize"
                                                    style={{ color: classColors[char.class] || '#ffffff' }}
                                                >
                                                    {char.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {char.class} • Level {char.level || '80'} • Item Level {char.itemLevel || '??'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Character Not Found Warning */}
                        {formData.currentCharacterName.trim().length >= 2 && 
                         searchResults.length === 0 && 
                         !isSearching && 
                         !selectedCharacter && (
                            <Alert variant="default" className="mt-2 border-amber-500/50 text-amber-500">
                                <AlertDescription>
                                    <p className="mb-1 text-sm">Character not found in guild data. You can still proceed with manual entry.</p>
                                    <p className="text-xs opacity-80">
                                        Available characters: {guildData.slice(0, 10).map(c => c.name).join(', ')}
                                        {guildData.length > 10 && ` ... and ${guildData.length - 10} more`}
                                    </p>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Selected Character Preview */}
                        {selectedCharacter && (
                            <CharacterPreview character={selectedCharacter} />
                        )}
                    </div>

                    {/* Season 3 Character Search */}
                    <div className="space-y-3">
                        <h3 className="text-md font-medium text-primary">Season Character</h3>
                        <div className="space-y-2 relative">
                            <Label htmlFor="season3CharacterName">Season Character Name</Label>
                            <div className="relative">
                                <Input
                                    id="season3CharacterName"
                                    value={formData.season3CharacterName}
                                    onChange={(e) => handleSeason3NameChange(e.target.value)}
                                    aria-invalid={!!validationErrors.season3CharacterName}
                                    className="pr-8"
                                />
                                {isSeason3Searching && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                        <Spinner className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            <p className={`text-xs ${validationErrors.season3CharacterName ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {validationErrors.season3CharacterName || "Start typing to search for your season character, then click on a character card to select"}
                            </p>
                        </div>
                        
                        {/* Season 3 Search Results */}
                        {season3SearchResults.length > 0 && (
                            <div className="mt-2 max-h-[200px] overflow-auto bg-card border border-border rounded-md mb-4">
                                {season3SearchResults.map((char) => (
                                    <div
                                        key={char.name}
                                        className="p-4 cursor-pointer hover:bg-accent border-b border-border transition-colors last:border-0"
                                        onClick={() => handleSeason3CharacterSelect(char)}
                                    >
                                        <div className="flex items-center">
                                            {char.media?.assets?.length ? (
                                                <img
                                                    src={char.media.assets[1].value}
                                                    alt={char.name}
                                                    className="w-10 h-10 rounded-full mr-4 object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full mr-4 bg-muted flex items-center justify-center">
                                                    <span className="text-xs text-muted-foreground">
                                                        {char.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <p 
                                                    className="text-sm font-bold capitalize"
                                                    style={{ color: classColors[char.class] || '#ffffff' }}
                                                >
                                                    {char.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {char.class} • Level {char.level || '80'} • Item Level {char.itemLevel || '??'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Season 3 Character Not Found - Show Placeholder Form */}
                        <Season3PlaceholderForm />
                        
                        {/* Selected Season 3 Character Preview */}
                        {selectedSeason3Character && (
                            <CharacterPreview character={selectedSeason3Character} isSeason3={true} />
                        )}
                    </div>

                    {/* Character Class - Only show if not in placeholder form */}
                    {!showSeason3Placeholder && (
                        <div className="space-y-2">
                            <Label className={validationErrors.characterClass ? 'text-destructive' : ''}>
                                Character Class
                            </Label>
                            <Select
                                value={formData.characterClass}
                                onValueChange={(value) => handleInputChange('characterClass', value)}
                            >
                                <SelectTrigger aria-invalid={!!validationErrors.characterClass}>
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(classSpecs).map((className) => (
                                        <SelectItem key={className} value={className}>
                                            {className}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {validationErrors.characterClass && (
                                <p className="text-xs text-destructive">{validationErrors.characterClass}</p>
                            )}
                        </div>
                    )}

                    {/* Main Spec - Only show if not in placeholder form */}
                    {!showSeason3Placeholder && (
                        <div className="space-y-2">
                            <Label className={validationErrors.mainSpec ? 'text-destructive' : ''}>
                                Main Spec
                            </Label>
                            <Select
                                value={formData.mainSpec}
                                onValueChange={(value) => handleInputChange('mainSpec', value)}
                                disabled={!formData.characterClass}
                            >
                                <SelectTrigger aria-invalid={!!validationErrors.mainSpec}>
                                    <SelectValue placeholder="Select main spec" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getAvailableSpecs(formData.characterClass).map((spec) => (
                                        <SelectItem key={spec} value={spec}>
                                            {spec} ({getRoleFromSpec(spec)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {validationErrors.mainSpec && (
                                <p className="text-xs text-destructive">{validationErrors.mainSpec}</p>
                            )}
                        </div>
                    )}

                    {/* Off Spec - Only show if not in placeholder form */}
                    {!showSeason3Placeholder && (
                        <div className="space-y-2">
                            <Label>Off Spec (Optional)</Label>
                            <Select
                                value={formData.offSpec}
                                onValueChange={(value) => handleInputChange('offSpec', value)}
                                disabled={!formData.characterClass}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select off spec" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {getAvailableSpecs(formData.characterClass).map((spec) => (
                                        <SelectItem key={spec} value={spec}>
                                            {spec} ({getRoleFromSpec(spec)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Season 3 Goal */}
                    <div className="space-y-2">
                        <Label className={validationErrors.season3Goal ? 'text-destructive' : ''}>
                            Season Goal
                        </Label>
                        <Select
                            value={formData.season3Goal}
                            onValueChange={(value) => handleInputChange('season3Goal', value)}
                        >
                            <SelectTrigger aria-invalid={!!validationErrors.season3Goal}>
                                <SelectValue placeholder="Select goal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AOTC">AOTC (Ahead of the Curve)</SelectItem>
                                <SelectItem value="CE">CE (Cutting Edge)</SelectItem>
                                <SelectItem value="Social">Social Raiding</SelectItem>
                            </SelectContent>
                        </Select>
                        {validationErrors.season3Goal && (
                            <p className="text-xs text-destructive">{validationErrors.season3Goal}</p>
                        )}
                    </div>

                    {/* Switches */}
                    <div className="flex flex-col gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="returningToRaid"
                                checked={formData.returningToRaid}
                                onCheckedChange={(checked) => handleInputChange('returningToRaid', checked)}
                            />
                            <Label htmlFor="returningToRaid">Returning to raid in Season</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="wantToPushKeys"
                                checked={formData.wantToPushKeys}
                                onCheckedChange={(checked) => handleInputChange('wantToPushKeys', checked)}
                            />
                            <Label htmlFor="wantToPushKeys">Want to push keys in Season</Label>
                        </div>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <DialogFooter className="gap-2 sm:gap-0 mt-6">
                    <Button 
                        variant="outline" 
                        onClick={handleClose} 
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={loading}
                    >
                        {loading ? <Spinner className="mr-2 h-4 w-4" /> : <PlusIcon className="mr-2 h-4 w-4" />}
                        {loading ? 'Submitting...' : 'Sign Up'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SignUpForm 
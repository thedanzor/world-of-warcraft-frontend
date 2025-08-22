'use client'

// React and Next.js
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// Third-party libraries
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// Material-UI components
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Paper from '@mui/material/Paper'

// Internal utilities and config
import { calculateRaidBuffs } from '@/core/utils/raidBuffs'
import config from '@/app.config.js'

// Internal components
import CharacterCard from '@/core/components/CharacterCard'
import RoleSlot from '@/core/components/RoleSlot'
import BuffSummary from '@/core/components/BuffSummary'

// Styles
import '@/core/sections/scss/roster.scss'

/**
 * RosterPlanner - Drag-and-drop raid team composition builder
 * Manages roster assignments, persists state in URL, and calculates raid buffs
 */
const RosterPlanner = ({ guildData }) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Filter guild data to only include main characters
    const mains = useMemo(() => {
        if (!guildData?.data) return []
        
        return guildData.data.filter(char => 
            config.MAIN_RANKS.includes(char.guildRank)
        ).map(char => ({
            ...char,
            // Add role information based on spec
            primary_role: config.TANKS.includes(char.spec) ? 'tank' : 
                         config.HEALERS.includes(char.spec) ? 'healer' : 'dps',
            secondary_role: 'None'
        }))
    }, [guildData])

    // State for role assignments (tanks, healers, DPS, substitutes, social)
    const [assignments, setAssignments] = useState(() => {
        const rosterParam = searchParams.get('roster')
        const defaultRoster = {
            tanks: new Array(2).fill(null),
            healers: new Array(5).fill(null),
            dps: new Array(18).fill(null),
            substitutes: new Array(10).fill(null),
            social: new Array(10).fill(null)
        }

        if (rosterParam) {
            try {
                return JSON.parse(decodeURIComponent(rosterParam))
            } catch (e) {
                console.error('Failed to parse roster from URL')
                return defaultRoster
            }
        }
        return defaultRoster
    })

    
    // Update URL when assignments change
    useEffect(() => {
        const encodedAssignments = encodeURIComponent(JSON.stringify(assignments))
        const newUrl = `?roster=${encodedAssignments}`
        // Only update if the URL actually changed
        if (searchParams.get('roster') !== encodedAssignments) {
            router.push(newUrl, { shallow: true })
        }
    }, [assignments, router, searchParams])

    // Handle character assignment to a specific role and position
    const handleDrop = (characterId, roleType, index) => {
        setAssignments((prev) => {
            const newAssignments = { ...prev }
            const droppedChar = mains.find(char => char.name === characterId)
            if (!droppedChar) return prev

            // Remove character from previous position
            Object.keys(newAssignments).forEach((role) => {
                const roleArray = [...newAssignments[role]]
                const prevIndex = roleArray.findIndex(name => name === characterId)
                if (prevIndex !== -1) {
                    roleArray[prevIndex] = null
                }
                newAssignments[role] = roleArray
            })

            // Assign to new position
            newAssignments[roleType][index] = characterId
            return newAssignments
        })
    }

    // Get list of currently assigned characters
    const assignedCharacters = Object.entries(assignments)
        .flatMap(([roleType, chars]) =>
            chars
                .map((charId, index) => {
                    if (!charId) return null
                    const char = mains.find((c) => c.name === charId)
                    if (!char) return null
                    
                    return {
                        ...char,
                        primary_role: roleType === 'tanks' 
                            ? 'tank' 
                            : roleType === 'healers' 
                                ? 'healer' 
                                : 'dps'
                    }
                })
                .filter(Boolean)
        )

    // Calculate current raid buffs based on team composition
    const raidBuffs = calculateRaidBuffs(assignedCharacters)

    // Reset roster to empty state
    const handleReset = () => {
        setAssignments({
            tanks: new Array(2).fill(null),
            healers: new Array(5).fill(null),
            dps: new Array(18).fill(null),
            substitutes: new Array(10).fill(null),
            social: new Array(10).fill(null),
        })
    }

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <div
                    className="roster-planner"
                    style={{ paddingBottom: '4rem' }}
                >
                    <section>
                        <div
                            className="logoHolder"
                            style={{ marginTop: '40px', padding: '0 0px' }}
                        >
                            <Typography
                                variant="h2"
                                component="h2"
                                sx={{
                                    textTransform: 'capitalize !important',
                                    textAlign: 'left',
                                }}
                            >
                                Roster Builder
                            </Typography>
                            <Typography
                                variant="p"
                                component="p"
                                color="text.secondary"
                                sx={{ mb: 4 }}
                            >
                                <strong> NOTICE: </strong> This tool allows you to build your own roster based on main characters from the guild.
                            </Typography>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleReset}
                                sx={{ mb: 2 }}
                            >
                                Reset Roster
                            </Button>
                        </div>
                    </section>

                    {/* Character Pool Section */}
                    <section
                        className="character-pool"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault()
                            const characterId = e.dataTransfer.getData('character')
                            setAssignments((prev) => {
                                const newAssignments = { ...prev }
                                Object.keys(newAssignments).forEach((role) => {
                                    newAssignments[role] = newAssignments[
                                        role
                                    ].map((id) =>
                                        id === characterId ? null : id
                                    )
                                })
                                return newAssignments
                            })
                        }}
                    >
                        {mains.filter(
                            (character) =>
                                !Object.values(assignments)
                                    .flat()
                                    .some(assigned => assigned === character.name)
                        ).length === 0 ? (
                            <Paper sx={{ p: 3, mb: 4 }}>
                                <Typography>
                                    Notice: All main characters have been assigned. You can drag characters from slots back to the pool or use the reset button to clear all assignments.
                                </Typography>
                            </Paper>
                        ) : (
                            <div
                                className="character-grid"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: '1rem',
                                    padding: '1rem 0px 4rem 0px',
                                }}
                            >
                                {mains
                                    .filter(
                                        (character) =>
                                            !Object.values(assignments)
                                                .flat()
                                                .some(assigned => assigned === character.name)
                                    )
                                    .map((character) => (
                                        <CharacterCard
                                            key={character.name}
                                            character={character}
                                            isDraggable={true}
                                            layout="horizontal"
                                        />
                                    ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <div
                            className="logoHolder"
                            style={{ marginTop: '40px', padding: '0 0px' }}
                        >
                            <Typography
                                variant="h2"
                                component="h2"
                                sx={{
                                    textTransform: 'capitalize !important',
                                    textAlign: 'left',
                                }}
                            >
                                Built Roster
                            </Typography>
                            <Typography
                                variant="p"
                                component="p"
                                color="text.secondary"
                                sx={{ mb: 4 }}
                            >
                                Scroll down to see the utilities and buffs for the built roster.
                            </Typography>
                        </div>
                    </section>

                    {/* Role Sections */}
                    <section className="role-sections">
                        {/* Tanks */}
                        <div className="role-group tanks">
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold' }}
                            >
                                Tanks (
                                {assignments.tanks.filter(Boolean).length}/2)
                            </Typography>
                            <div className="slot-container">
                                {assignments.tanks.map((charId, index) => (
                                    <RoleSlot
                                        key={`tank-${index}`}
                                        roleType="tanks"
                                        index={index}
                                        character={mains.find(
                                            (char) => char.name === charId
                                        )}
                                        onDrop={handleDrop}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Healers */}
                        <div className="role-group healers">
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold' }}
                            >
                                Healers (
                                {assignments.healers.filter(Boolean).length}/5)
                            </Typography>
                            <div className="slot-container">
                                {assignments.healers.map((charId, index) => (
                                    <RoleSlot
                                        key={`healer-${index}`}
                                        roleType="healers"
                                        index={index}
                                        character={mains.find(
                                            (char) => char.name === charId
                                        )}
                                        onDrop={handleDrop}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* DPS */}
                        <div className="role-group dps">
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold' }}
                            >
                                DPS ({assignments.dps.filter(Boolean).length}
                                /18)
                            </Typography>
                            <div className="slot-container">
                                {assignments.dps.map((charId, index) => (
                                    <RoleSlot
                                        key={`dps-${index}`}
                                        roleType="dps"
                                        index={index}
                                        character={mains.find(
                                            (char) => char.name === charId
                                        )}
                                        onDrop={handleDrop}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Substitutes */}
                        <div className="role-group substitutes">
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold' }}
                            >
                                Substitutes ({assignments.substitutes.filter(Boolean).length}
                                /10)
                            </Typography>
                            <div className="slot-container">
                                {assignments.substitutes.map((charId, index) => (
                                    <RoleSlot
                                        key={`substitute-${index}`}
                                        roleType="substitutes"
                                        index={index}
                                        character={mains.find(
                                            (char) => char.name === charId
                                        )}
                                        onDrop={handleDrop}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Social */}
                        <div className="role-group social">
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold' }}
                            >
                                Social ({assignments.social.filter(Boolean).length}
                                /10)
                            </Typography>
                            <div className="slot-container">
                                {assignments.social.map((charId, index) => (
                                    <RoleSlot
                                        key={`social-${index}`}
                                        roleType="social"
                                        index={index}
                                        character={mains.find(
                                            (char) => char.name === charId
                                        )}
                                        onDrop={handleDrop}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Create a separate component for the trash zone */}
                    <TrashZone setAssignments={setAssignments} />

                    {/* Buff Summary */}
                    <section>
                        <BuffSummary buffs={raidBuffs} />
                    </section>
                </div>
            </DndProvider>
        </>
    )
}

/**
 * TrashZone - Drop zone for removing characters from the roster
 */
const TrashZone = ({ setAssignments }) => {
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: 'CHARACTER',
            drop: (item) => {
                if (!item || !item.id) return

                setAssignments((prev) => {
                    const newAssignments = { ...prev }

                    Object.keys(newAssignments).forEach((role) => {
                        newAssignments[role] = newAssignments[role].map((id) =>
                            id === item.id ? null : id
                        )
                    })

                    return newAssignments
                })
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        [setAssignments]
    )

    return (
        <section>
            <div
                ref={drop}
                className="trash-zone"
                style={{
                    padding: '1rem',
                    border: `2px dashed ${isOver ? '#ff0000' : '#ccc'}`,
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    minHeight: '100px',
                    backgroundColor: isOver
                        ? 'rgba(255,0,0,0.1)'
                        : 'transparent',
                }}
            >
                <DeleteOutlineIcon sx={{ fontSize: 40, color: '#666' }} />
                <Typography variant="body1" sx={{ ml: 1 }}>
                    Drag here to remove
                </Typography>
            </div>
        </section>
    )
}

export default RosterPlanner

/**
 * ROSTER BUILDER SCREEN
 * 
 * This is a drag-and-drop raid team composition builder that allows guild officers
 * to plan and organize raid rosters with visual feedback and automatic buff calculations.
 * 
 * WHAT THIS DOES:
 * - Provides drag-and-drop interface for building raid teams
 * - Automatically calculates and displays raid buffs based on composition
 * - Persists roster state in URL for sharing and bookmarking
 * - Shows role distribution and team balance
 * - Filters guild data to show only main characters
 * - Manages tank, healer, DPS, substitute, and social assignments
 * 
 * KEY FEATURES:
 * - Visual drag-and-drop roster building
 * - Real-time buff calculation and display
 * - URL persistence for roster sharing
 * - Role-based slot management
 * - Character card system with detailed information
 * - Automatic role detection based on specialization
 * 
 * ROSTER STRUCTURE:
 * - Tanks: 2 slots (typically 2 tanks for most raids)
 * - Healers: 5 slots (flexible healer composition)
 * - DPS: 18 slots (main damage dealers)
 * - Substitutes: 10 slots (backup players)
 * - Social: 10 slots (non-raiding members)
 * 
 * DRAG AND DROP:
 * - Uses react-dnd for smooth drag-and-drop functionality
 * - Characters can be moved between different role sections
 * - Automatic removal from previous positions
 * - Visual feedback during drag operations
 * 
 * BUFF CALCULATIONS:
 * - Integrates with raidBuffs utility for automatic calculations
 * - Shows buff coverage and gaps
 * - Helps optimize team composition
 * - Displays buff summary for the entire roster
 * 
 * URL PERSISTENCE:
 * - Roster state is encoded in URL parameters
 * - Allows sharing specific roster configurations
 * - Maintains state across page refreshes
 * - Supports bookmarking different roster setups
 * 
 * USAGE:
 * Primary tool for raid leaders to plan team compositions.
 * Essential for raid preparation and team optimization.
 * 
 * MODIFICATION NOTES:
 * - Test drag-and-drop functionality thoroughly
 * - Ensure buff calculations remain accurate
 * - Consider adding roster templates and presets
 * - Test URL encoding/decoding with various character names
 */

'use client'

// React and Next.js
import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// Third-party libraries
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// Shadcn components & Lucide
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

// Internal utilities and config
import { calculateRaidBuffs } from '@/core/utils/raidBuffs'
import config from '@/app.config.js'

// Internal components
import CharacterCard from '@/core/components/CharacterCard'
import RoleSlot from '@/core/components/RoleSlot'
import BuffSummary from '@/core/components/BuffSummary'

// Styles

/**
 * RosterPlannerContent - The main roster planner component that uses useSearchParams
 * This component is wrapped in Suspense to handle the useSearchParams hook properly
 */
const RosterPlannerContent = ({ guildData }) => {
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
                            className="logoHolder mt-10 px-0"
                        >
                            <h2 className="text-3xl capitalize text-left mb-2 font-semibold">
                                Roster Builder
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                <strong> NOTICE: </strong> This tool allows you to build your own roster based on main characters from the guild.
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="mb-4"
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
                            <div className="p-6 mb-8 rounded-lg shadow-sm bg-[#111111]/80 backdrop-blur-md border border-white/10">
                                <p>
                                    Notice: All main characters have been assigned. You can drag characters from slots back to the pool or use the reset button to clear all assignments.
                                </p>
                            </div>
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
                            className="logoHolder mt-10 px-0"
                        >
                            <h2 className="text-3xl capitalize text-left mb-2 font-semibold">
                                Built Roster
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Scroll down to see the utilities and buffs for the built roster.
                            </p>
                        </div>
                    </section>

                    {/* Role Sections */}
                    <section className="role-sections">
                        {/* Tanks */}
                        <div className="role-group tanks">
                            <h6 className="text-md font-bold mb-2">
                                Tanks (
                                {assignments.tanks.filter(Boolean).length}/2)
                            </h6>
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
                            <h6 className="text-md font-bold mb-2">
                                Healers (
                                {assignments.healers.filter(Boolean).length}/5)
                            </h6>
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
                            <h6 className="text-md font-bold mb-2">
                                DPS ({assignments.dps.filter(Boolean).length}
                                /18)
                            </h6>
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
                            <h6 className="text-md font-bold mb-2">
                                Substitutes ({assignments.substitutes.filter(Boolean).length}
                                /10)
                            </h6>
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
                            <h6 className="text-md font-bold mb-2">
                                Social ({assignments.social.filter(Boolean).length}
                                /10)
                            </h6>
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
                <Trash2 className="text-[#666] w-10 h-10" />
                <p className="ml-2 text-base">
                    Drag here to remove
                </p>
            </div>
        </section>
    )
}

/**
 * RosterPlanner - Main component wrapper with Suspense boundary
 * This handles the useSearchParams hook properly for Next.js
 */
const RosterPlanner = ({ guildData }) => {
    return (
        <Suspense fallback={
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '50vh',
                fontSize: '1.2rem',
                color: '#666'
            }}>
                
            </div>
        }>
            <RosterPlannerContent guildData={guildData} />
        </Suspense>
    )
}

export default RosterPlanner

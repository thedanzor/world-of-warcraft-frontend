import { useDrag } from 'react-dnd'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import config from '@/app.config.js'

// Helper function to capitalize character names
const capitalizeCharacterName = (name) => {
    if (!name) return name
    // Split by hyphen to handle "name-realm" format, capitalize each part
    return name.split('-').map(part => {
        if (!part) return part
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    }).join('-')
}

// Base character card component without drag functionality
const CharacterCardBase = ({ character, layout = 'horizontal', dragRef = null, isDragging = false }) => {
    // Get role information
    const getRoleDisplay = () => {
        if (character.primary_role) {
            return character.primary_role
        }
        // Fallback to spec-based role detection
        return character.spec || 'Unknown'
    }

    // Get guild rank name
    const getRankName = () => {
        return config.GUILLD_RANKS[character.guildRank] || 'Unknown Rank'
    }

    const capitalizedName = capitalizeCharacterName(character.name)

    return (
        <div
            ref={dragRef}
            className={`character-card ${layout} ${isDragging ? 'dragging' : ''} ${character.class}`}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: dragRef ? 'grab' : 'default',
            }}
        >
            {character?.media?.assets?.length ? (
                <img
                    className="character-avatar"
                    src={character.media.assets[0]?.value || character.media.assets[1]?.value}
                    alt={capitalizedName}
                />
            ) : (
                <img
                    className="character-avatar"
                    src="/images/logo-without-text.png"
                    alt={capitalizedName}
                    style={{ opacity: 0.4 }}
                />
            )}
            <div className="character-info">
                <div className={`character-name ${character.class} `}>
                    {capitalizedName}
                </div>
                <div className="character-spec">
                    {character.class}
                </div>
            </div>
        </div>
    )
}

// Draggable version - uses useDrag hook (requires DndProvider)
const CharacterCardDraggable = ({ character, layout = 'horizontal' }) => {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: 'CHARACTER',
            item: () => ({
                id: character.name,
                name: character.name,
            }),
            canDrag: true,
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [character.name]
    )

    return <CharacterCardBase 
        character={character} 
        layout={layout} 
        dragRef={drag} 
        isDragging={isDragging} 
    />
}

// Main component - conditionally renders draggable or non-draggable version
const CharacterCard = ({ character, isDraggable = false, layout = 'horizontal' }) => {
    // If draggable, use the draggable version (requires DndProvider)
    // Otherwise, use the base non-draggable version
    if (isDraggable) {
        return <CharacterCardDraggable character={character} layout={layout} />
    }
    
    // Non-draggable version - no DndProvider needed
    return <CharacterCardBase character={character} layout={layout} />
}

export default CharacterCard

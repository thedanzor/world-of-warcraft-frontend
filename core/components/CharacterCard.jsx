import { useDrag } from 'react-dnd'
import config from '@/app.config.js'

const capitalizeCharacterName = (name) => {
    if (!name) return name
    return name.split('-').map(part => {
        if (!part) return part
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    }).join('-')
}

const CharacterCardBase = ({ character, layout = 'horizontal', dragRef = null, isDragging = false }) => {
    const capitalizedName = capitalizeCharacterName(character.name)
    const sanitizedClass = character.class ? character.class.toLowerCase().replace(/\s+/g, '') : ''

    return (
        <div
            ref={dragRef}
            className={`group flex items-center gap-3 p-3 bg-card border border-border/50 rounded-lg shadow-sm hover:border-border hover:shadow-md transition-all duration-150 ${isDragging ? 'opacity-40 scale-95' : ''}`}
            style={{ cursor: dragRef ? 'grab' : 'default' }}
        >
            {character?.media?.assets?.length ? (
                <img
                    className="w-10 h-10 rounded-full object-cover border border-border/50 shrink-0"
                    src={character.media.assets[0]?.value || character.media.assets[1]?.value}
                    alt={capitalizedName}
                />
            ) : (
                <img
                    className="w-10 h-10 rounded-full object-cover border border-border/50 opacity-30 shrink-0"
                    src="/images/logo-without-text.png"
                    alt={capitalizedName}
                />
            )}
            <div className="flex flex-col min-w-0">
                <span className={`font-bold text-sm truncate text-${sanitizedClass}`}>
                    {capitalizedName}
                </span>
                <span className="text-xs text-muted-foreground font-medium truncate">
                    {character.spec ? `${character.spec} ` : ''}{character.class}
                </span>
            </div>
        </div>
    )
}

const CharacterCardDraggable = ({ character, layout = 'horizontal' }) => {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: 'CHARACTER',
            item: () => ({ id: character.name, name: character.name }),
            canDrag: true,
            collect: (monitor) => ({ isDragging: monitor.isDragging() }),
        }),
        [character.name]
    )

    return <CharacterCardBase character={character} layout={layout} dragRef={drag} isDragging={isDragging} />
}

const CharacterCard = ({ character, isDraggable = false, layout = 'horizontal' }) => {
    if (isDraggable) return <CharacterCardDraggable character={character} layout={layout} />
    return <CharacterCardBase character={character} layout={layout} />
}

export default CharacterCard

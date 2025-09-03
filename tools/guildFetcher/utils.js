import config from '@/app.config.js'

const {
    API_PARAM_REQUIREMENTGS,
    DIFFICULTY,
    TANKS,
    HEALERS,
    MAIN_RANKS,
    ALT_RANKS,
    GUILLD_RANKS
} = config

//
// Builds API urls and standardizes character and server names
const getCharacterInformation = (member, token) => {
    const characterName = member.name || member.character.name.toLowerCase()
    const server = member.server || member.character.realm.slug.toLowerCase()

    return {
        characterName,
        server,
        mediaUrl: `/profile/wow/character/${server}/${characterName}/character-media?${API_PARAM_REQUIREMENTGS}&access_token=${token}`,
        profileUrl: `/profile/wow/character/${server}/${characterName}?${API_PARAM_REQUIREMENTGS}&access_token=${token}`,
        raidProgressUrl: `/profile/wow/character/${server}/${characterName}/encounters/raids?${API_PARAM_REQUIREMENTGS}&access_token=${token}`,
        equipmentUrl: `/profile/wow/character/${server}/${characterName}/equipment?${API_PARAM_REQUIREMENTGS}&access_token=${token}`,
        pvpProgressUrl: `/profile/wow/character/${server}/${characterName}/pvp-summary?${API_PARAM_REQUIREMENTGS}&access_token=${token}`,
        bracketProgressUrl: (bracket) =>
            `/profile/wow/character/${server}/${characterName}/pvp-bracket/${bracket}?${API_PARAM_REQUIREMENTGS}&access_token=${token}`,
        mythicProgressUrl: `/profile/wow/character/${server}/${characterName}/mythic-keystone-profile?${API_PARAM_REQUIREMENTGS}&access_token=${token}`,
    }
}

//
// Helps with getting specific nested data items
// @TODO - Some pieces may have exceptions down the line, so we can add those here
const needsEnchant = (ENCHANTABLE_PIECES, item) => {
    return ENCHANTABLE_PIECES.indexOf(item.slot.type) > -1
}

//
// @TODO - this can lead to false positives, some items can have multiple 'enchantments' E.G - Crafted gear
const hasEnchant = (item) => {
    return item?.enchantments?.length
}

//
// @TODO - Need to add a sanity check here, to make sure it's CURRENT tier
const isTierItem = (item) => {
    return item?.set?.items.length >= 4
}

//
// Updated for new compressed data format
// Builds isLocked for the new lockStatus structure
const isPersonLocked = (lockStatus) => {
    if (!lockStatus || !lockStatus.lockedTo) {
        return {
            isLocked: false,
            lockedTo: {
                Normal: [],
                Heroic: [],
                Mythic: [],
                'Raid Finder': [],
            },
            lockedToString: '',
            lockedTooltipString: '',
        }
    }

    const lockedTo = lockStatus.lockedTo
    let isLocked = false

    // Check if any difficulty has lockouts
    Object.keys(lockedTo).forEach(difficulty => {
        if (lockedTo[difficulty] && lockedTo[difficulty].completed > 0) {
            isLocked = true
        }
    })

    // Build display strings
    const lockedDifficulties = Object.keys(lockedTo).filter(difficulty => 
        lockedTo[difficulty] && lockedTo[difficulty].completed > 0
    )

    const lockedToString = lockedDifficulties.join(', ')
    
    const lockedTooltipString = lockedDifficulties.map(difficulty => {
        const status = lockedTo[difficulty]
        return `${difficulty.toUpperCase()}: ${status.completed}/${status.total}\nBosses:\n${status.encounters.map(boss => `• ${boss}`).join('\n')}`
    }).join('\n\n')

    return {
        isLocked,
        lockedTo,
        lockedToString,
        lockedTooltipString,
    }
}

//
// Updated for new compressed data format
// Where to search to / from
const filterSearch = (
    character,
    query,
    classFilter,
    specFilter,
    rank,
    ilevelFilter
) => {
    // Make everything case sensitive
    const handleQuery = query.toLowerCase()
    const handledName = character.name.toLowerCase()

    // Use the role from metaData if available, otherwise determine from spec
    const role = character.metaData?.role || (() => {
        const isTank = TANKS.indexOf(character.spec) > -1
        const isHealer = HEALERS.indexOf(character.spec) > -1
        return isTank ? 'tank' : isHealer ? 'healer' : 'dps'
    })()

    // List of scenarios to check for
    const guildRankIndex = character.guildRank // guildRank is already the index
    const matchesRank =
        rank === 'all' ||
        (rank === 'alts' && ALT_RANKS.includes(guildRankIndex)) ||
        (rank === 'mains' && MAIN_RANKS.includes(guildRankIndex))
    const matchesNameQuery =
        !query.length || (query.length && handledName.includes(handleQuery))
    const matchesClassQuery =
        !classFilter.length ||
        (classFilter.length && classFilter.indexOf(character.class) >= 0)
    const matchesSpecQuery =
        specFilter === 'all' ||
        (specFilter === 'tanks' && role === 'tank') ||
        (specFilter === 'healers' && role === 'healer') ||
        (specFilter === 'dps' && role === 'dps')
    const matchesItemLevel = character.itemLevel >= ilevelFilter

    // Return if any paramaters match
    return (
        matchesRank &&
        matchesNameQuery &&
        matchesSpecQuery &&
        matchesClassQuery &&
        matchesItemLevel
    )
}

//
// Updated for new compressed data format
// Generates a dynamic list of classes
const buildInitialClassList = (data) => {
    const classes = []

    data.forEach((character) => {
        if (classes.indexOf(character.class) === -1) {
            classes.push(character.class)
        }
    })

    return classes.sort()
}

//
// Updated for new compressed data format
// Generate locked metadata for the new structure
const generateLockedMetaData = (data) => {
    return data.map((character) => {
        const lockedCheck = isPersonLocked(character.lockStatus)
        
        return {
            ...character,
            isLocked: lockedCheck.isLocked,
            lockedTo: lockedCheck.lockedTo,
            lockedToString: lockedCheck.lockedToString,
            lockedTooltipString: lockedCheck.lockedTooltipString,
        }
    })
}

module.exports = {
    needsEnchant,
    hasEnchant,
    isTierItem,
    generateLockedMetaData,
    buildInitialClassList,
    filterSearch,
    isPersonLocked,
    getCharacterInformation,
}

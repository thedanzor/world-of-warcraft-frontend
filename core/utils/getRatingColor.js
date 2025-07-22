const getRatingColor = (rating, type) => {
    if (type === 'mplus') {
        if (rating >= 2900) return '#ff5722'
        if (rating >= 2700) return 'orange'
        if (rating >= 2200) return '#a020f0'
        if (rating >= 1400) return '#3498db'
        if (rating >= 1000) return '#2ecc71'
        return '#808080'
    } else if (type === 'pvp') {
        if (rating >= 2400) return '#ff5722' // Elite
        if (rating >= 2100) return '#a020f0' // Duelist
        if (rating >= 1800) return '#3498db' // Rival
        if (rating >= 1400) return '#2ecc71' // Challenger
        return '#808080' // Unranked
    }
    return '#808080' // Default fallback
}

export default getRatingColor

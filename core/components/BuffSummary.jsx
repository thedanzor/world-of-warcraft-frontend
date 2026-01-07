import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {
    LocalFireDepartment as MageIcon,
    Pets as HunterIcon,
    Shield as WarriorIcon,
    Healing as PriestIcon,
    Psychology as WarlockIcon,
    AutoFixHigh as DruidIcon,
    Bolt as ShamanIcon,
    ContentCut as RogueIcon,
    SelfImprovement as MonkIcon,
    GppMaybe as DeathKnightIcon,
    ColorLens as DemonHunterIcon,
    Flare as EvokerIcon,
} from '@mui/icons-material'

const BuffSummary = ({ buffs }) => {
    const buffIcons = {
        intellect: MageIcon,
        attackPower: WarriorIcon,
        stamina: PriestIcon,
        bloodlust: ShamanIcon,
        combatRes: DruidIcon,
        magicDamage: DemonHunterIcon,
        physicalDamage: MonkIcon,
        versatility: DruidIcon,
        movementSpeed: DruidIcon,
        devotionAura: WarriorIcon,
        darkness: DemonHunterIcon,
        rallyingCry: WarriorIcon,
        innervate: DruidIcon,
        powerInfusion: PriestIcon,
        windfury: ShamanIcon,
        mysticTouch: MonkIcon,
        chaosBrand: DemonHunterIcon,
    }

    return (
        <Box className="buff-summary">
            <Typography variant="h6" sx={{ fontSize: '1.15rem' }}>
                Buffs and Utilities
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Shows how many characters provide each buff. Missing buffs are highlighted in red.
            </Typography>
            <div className="buff-grid">
                {Object.entries(buffs).map(([buffName, count]) => {
                    const Icon = buffIcons[buffName] || MageIcon
                    const hasBuff = count > 0
                    return (
                        <div
                            key={buffName}
                            className={`buff-item ${hasBuff ? 'active' : ''}`}
                            style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Icon className="icon" />
                                <Typography className="name">
                                    {buffName.replace(/([A-Z])/g, ' $1').trim()}
                                </Typography>
                            </Box>
                            {hasBuff ? (
                                <Typography variant="caption" sx={{ 
                                    fontSize: '0.875rem', 
                                    fontWeight: 'bold',
                                    color: '#10B981',
                                }}>
                                    {count} {count === 1 ? 'character' : 'characters'}
                                </Typography>
                            ) : (
                                <Typography variant="caption" sx={{ 
                                    fontSize: '0.75rem', 
                                    color: 'text.secondary',
                                }}>
                                    Missing
                                </Typography>
                            )}
                        </div>
                    )
                })}
            </div>
        </Box>
    )
}

export default BuffSummary

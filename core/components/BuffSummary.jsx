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
                Characters with buffs are highlighted in green.
            </Typography>
            <div className="buff-grid">
                {Object.entries(buffs).map(([buffName, hasBuff]) => {
                    const Icon = buffIcons[buffName] || MageIcon
                    return (
                        <div
                            key={buffName}
                            className={`buff-item ${hasBuff ? 'active' : ''}`}
                        >
                            <Icon className="icon" />
                            <Typography className="name">
                                {buffName.replace(/([A-Z])/g, ' $1').trim()}
                            </Typography>
                        </div>
                    )
                })}
            </div>
        </Box>
    )
}

export default BuffSummary

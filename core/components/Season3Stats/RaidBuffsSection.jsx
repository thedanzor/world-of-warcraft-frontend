import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import ShieldIcon from '@mui/icons-material/Shield'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import HealingIcon from '@mui/icons-material/Healing'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import BoltIcon from '@mui/icons-material/Bolt'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'
import PsychologyIcon from '@mui/icons-material/Psychology'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import RoleStatCard from './RoleStatCard'

const RaidBuffsSection = ({ stats }) => {
    // Check if raidBuffs exists, if not, don't render this section
    if (!stats.raidBuffs) {
        return null;
    }

    // Helper function to get the appropriate icon for each buff
    const getBuffIcon = (buff) => {
        const buffIconMap = {
            intellect: LocalFireDepartmentIcon,
            attackPower: ShieldIcon,
            physicalDamage: ContentCutIcon,
            stamina: HealingIcon,
            devotionAura: ShieldIcon,
            magicDamage: ColorLensIcon,
            versatility: AutoFixHighIcon,
            bloodlust: BoltIcon,
            combatRes: GppMaybeIcon,
            movementSpeed: SelfImprovementIcon,
            portalAndCookies: PsychologyIcon,
            massDispel: HealingIcon,
            innervate: AutoFixHighIcon,
            deathGrip: GppMaybeIcon,
            blessings: ShieldIcon,
            rallyingCry: ShieldIcon,
            darkness: ColorLensIcon,
            skyfuryWindfury: BoltIcon,
            bossDamageReduction: ContentCutIcon,
            spellwarding: ShieldIcon,
        }
        return buffIconMap[buff] || HelpOutlineIcon
    }

    // Helper function to format buff names for display
    const formatBuffName = (buff) => {
        return buff
            .split(/(?=[A-Z])/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    return (
        <>
            <Typography variant="h2" sx={{ fontSize: '1.5rem', my: 3 }}>
                Raid Buffs & Utilities
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {Object.entries(stats.raidBuffs).map(([buff, count]) => (
                    <Grid item xs={12} sm={6} md={3} key={buff}>
                        <RoleStatCard
                            title={formatBuffName(buff)}
                            count={count || 0}
                            description={count > 0 ? '(Has buff)' : 'Missing'}
                            icon={getBuffIcon(buff)}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default RaidBuffsSection 
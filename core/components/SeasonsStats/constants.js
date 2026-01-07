// Icons for WoW classes
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment' // Mage
import PetsIcon from '@mui/icons-material/Pets' // Hunter
import ShieldIcon from '@mui/icons-material/Shield' // Warrior/Paladin
import HealingIcon from '@mui/icons-material/Healing' // Priest
import PsychologyIcon from '@mui/icons-material/Psychology' // Warlock
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh' // Druid
import BoltIcon from '@mui/icons-material/Bolt' // Shaman
import ContentCutIcon from '@mui/icons-material/ContentCut' // Rogue
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement' // Monk
import GppMaybeIcon from '@mui/icons-material/GppMaybe' // Death Knight
import ColorLensIcon from '@mui/icons-material/ColorLens' // Demon Hunter
import FlareIcon from '@mui/icons-material/Flare' // Evoker

export const classIcons = {
    Warrior: ShieldIcon,
    Paladin: ShieldIcon,
    Hunter: PetsIcon,
    Rogue: ContentCutIcon,
    Priest: HealingIcon,
    'Death Knight': GppMaybeIcon,
    Shaman: BoltIcon,
    Mage: LocalFireDepartmentIcon,
    Warlock: PsychologyIcon,
    Monk: SelfImprovementIcon,
    Druid: AutoFixHighIcon,
    'Demon Hunter': ColorLensIcon,
    Evoker: FlareIcon,
}

export const classColors = {
    Warrior: '#C79C6E',
    Paladin: '#F58CBA',
    Hunter: '#ABD473',
    Rogue: '#FFF569',
    Priest: '#FFFFFF',
    'Death Knight': '#C41E3A',
    Shaman: '#0070DE',
    Mage: '#69CCF0',
    Warlock: '#9482C9',
    Monk: '#00FF96',
    Druid: '#FF7D0A',
    'Demon Hunter': '#A330C9',
    Evoker: '#33937F',
}

// Class specifications mapping
export const classSpecs = {
    Warrior: ['Arms', 'Fury', 'Protection'],
    Paladin: ['Holy', 'Protection', 'Retribution'],
    Hunter: ['Beast Mastery', 'Marksmanship', 'Survival'],
    Rogue: ['Assassination', 'Outlaw', 'Subtlety'],
    Priest: ['Discipline', 'Holy', 'Shadow'],
    'Death Knight': ['Blood', 'Frost', 'Unholy'],
    Shaman: ['Elemental', 'Enhancement', 'Restoration'],
    Mage: ['Arcane', 'Fire', 'Frost'],
    Warlock: ['Affliction', 'Demonology', 'Destruction'],
    Monk: ['Brewmaster', 'Mistweaver', 'Windwalker'],
    Druid: ['Balance', 'Feral', 'Guardian', 'Restoration'],
    'Demon Hunter': ['Havoc', 'Vengeance'],
    Evoker: ['Devastation', 'Preservation', 'Augmentation'],
}

// Tank specs
export const tankSpecs = ['Protection', 'Blood', 'Guardian', 'Brewmaster', 'Vengeance']

// Healer specs
export const healerSpecs = ['Holy', 'Discipline', 'Restoration', 'Mistweaver', 'Preservation'] 
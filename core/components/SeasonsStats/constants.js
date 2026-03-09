// Icons for WoW classes
import {
    Flame,
    PawPrint,
    Shield,
    Cross,
    Brain,
    Wand2,
    Zap,
    Scissors,
    User,
    Skull,
    Eye,
    Sparkles
} from 'lucide-react'

export const classIcons = {
    Warrior: Shield,
    Paladin: Shield,
    Hunter: PawPrint,
    Rogue: Scissors,
    Priest: Cross,
    'Death Knight': Skull,
    Shaman: Zap,
    Mage: Flame,
    Warlock: Brain,
    Monk: User,
    Druid: Wand2,
    'Demon Hunter': Eye,
    Evoker: Sparkles,
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

import {
    Flame as MageIcon,
    PawPrint as HunterIcon,
    Shield as WarriorIcon,
    HeartPulse as PriestIcon,
    Ghost as WarlockIcon,
    Wand2 as DruidIcon,
    Zap as ShamanIcon,
    Scissors as RogueIcon,
    PersonStanding as MonkIcon,
    ShieldAlert as DeathKnightIcon,
    Eye as DemonHunterIcon,
    Sun as EvokerIcon,
} from 'lucide-react'

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
        <div className="buff-summary">
            <h6 className="text-[1.15rem] font-medium mb-1">
                Buffs and Utilities
            </h6>
            <p className="text-sm text-muted-foreground mb-4">
                Shows how many characters provide each buff. Missing buffs are highlighted in red.
            </p>
            <div className="buff-grid">
                {Object.entries(buffs).map(([buffName, count]) => {
                    const Icon = buffIcons[buffName] || MageIcon
                    const hasBuff = count > 0
                    return (
                        <div
                            key={buffName}
                            className={`buff-item ${hasBuff ? 'active' : ''} flex flex-col items-center text-center`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Icon className="icon w-5 h-5" />
                                <span className="name">
                                    {buffName.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            </div>
                            {hasBuff ? (
                                <span className="text-sm font-bold text-[#10B981]">
                                    {count} {count === 1 ? 'character' : 'characters'}
                                </span>
                            ) : (
                                <span className="text-xs text-muted-foreground">
                                    Missing
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default BuffSummary

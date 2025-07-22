export const calculateRaidBuffs = (characters) => {
    // Initialize all buffs with 0 instead of false
    const buffs = {
        intellect: 0,
        attackPower: 0,
        stamina: 0,
        bloodlust: 0,
        combatRes: 0,
        magicDamage: 0,
        physicalDamage: 0,
        versatility: 0,
        movementSpeed: 0,
        devotionAura: 0,
        darkness: 0,
        rallyingCry: 0,
        innervate: 0,
        portalAndCookies: 0,
        massDispel: 0,
        deathGrip: 0,
        blessings: 0,
        skyfuryWindfury: 0,
        bossDamageReduction: 0,
        spellwarding: 0,
    }

    characters.forEach((char) => {
        const charClass = char.metaData?.class
        const isPrimaryHealer =
            char.metaData?.primary_role?.toLowerCase() === 'healer'
        const isPrimaryTank =
            char.metaData?.primary_role?.toLowerCase() === 'tank'

        switch (charClass) {
            case 'Mage':
                buffs.intellect++
                buffs.bloodlust++
                break
            case 'Warrior':
                buffs.attackPower++
                buffs.rallyingCry++
                break
            case 'Priest':
                buffs.stamina++
                if (isPrimaryHealer) {
                    buffs.massDispel++
                }
                break
            case 'Shaman':
                buffs.bloodlust++
                buffs.skyfuryWindfury++
                buffs.movementSpeed++
                break
            case 'Druid':
                buffs.versatility++
                buffs.combatRes++
                buffs.innervate++
                buffs.movementSpeed++
                break
            case 'Monk':
                buffs.physicalDamage++
                break
            case 'Demon Hunter':
                buffs.magicDamage++
                buffs.darkness++
                break
            case 'Paladin':
                buffs.blessings++
                if (isPrimaryHealer) {
                    buffs.devotionAura++
                }
                if (isPrimaryTank) {
                    buffs.spellwarding++
                }
                buffs.combatRes++
                break
            case 'Death Knight':
                buffs.combatRes++
                buffs.deathGrip++
                break
            case 'Warlock':
                buffs.combatRes++
                buffs.portalAndCookies++
                break
            case 'Hunter':
                buffs.bloodlust++
                break
            case 'Evoker':
                buffs.bloodlust++
                break
            case 'Rogue':
                buffs.bossDamageReduction++
                break
        }
    })

    return buffs
}

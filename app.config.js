const data = {
    "GUILD_NAME": process.env.NEXT_PUBLIC_GUILD_NAME || "GUILD_NAME",
    "GUILD_REALM": process.env.NEXT_PUBLIC_GUILD_REALM || "GUILD_REALM",
    "REGION": "eu",
    "API_PARAM_REQUIREMENTGS": "namespace=profile-eu&locale=en_US",
    "THEME": "default",

    "LEVEL_REQUIREMENT": 80,
    "GUILD_RANK_REQUIREMENT": [0,1,2,3,4,5,6, 7,8,9,10],
    "ITEM_LEVEL_REQUIREMENT": 170,
    "MIN_CHECK_CAP": 170,
    "MAX_CHECK_CAP": 270,
    "MIN_TIER_ITEMLEVEL": 240,
    "ENCHANTABLE_PIECES": ["WRIST", "LEGS", "FEET", "CHEST", "MAIN_HAND", "FINGER_1", "FINGER_2"],
    "MAIN_RANKS": [0,1,3,4,5,6,7],
    "ALT_RANKS": [2,8,9,10],
    "TANKS": ["Blood", "Vengeance", "Guardian", "Brewmaster", "Protection"],
    "HEALERS": ["Preservation", "Mistweaver", "Holy", "Discipline", "Restoration"],
    "DIFFICULTY": ["Mythic", "Heroic", "Normal"],
    "_DRAFT_DIFFICULTY": ["LFR", "Raid Finder", "Mythic", "Heroic", "Normal"],
    "SEASON_START_DATE": "2026-02-25",
    "CURRENT_EXPANSION": "Midnight",
    "CURRENT_MPLUS_SEASON": 17,
    "CURRENT_SEASON_TIER_SETS": [
        "Relentless Rider's Lament",
        "Devouring Reaver's Sheathe",
        "Sprouts of the Luminous Bloom",
        "Livery of the Black Talon",
        "Primal Sentry's Camouflage",
        "Voidbreaker's Accordance",
        "Way of Ra-den's Chosen",
        "Luminating Verdict's Vestments",
        "Blind Oath's Burden",
        "Motley of the Grim Jest",
        "Mantle of the Primal Core",
        "Reign of the Abyssal Immolator",
        "Rage of the Night Ender"
    ],
    "INITIAL_FILTERS": {
        "rankFilter": "all",
        "activeTab": "all",
        "specFilter": "all",
        "instanceIndex": 0,
        "defaultItemLevel": 180
    },
    "GUILLD_RANKS": [
        "Guild Lead",
        "Unknown",
        "Unknown",
        "Unknown",
        "Unknown",
        "Unknown",
        "Unknown",
        "Unknown",
        "Unknown",
        "Unknown",
        "Recruit"
    ],
    "SITE_NAME": "WoW Guild Audit Tool",
    "SITE_SHORT_NAME": "WoW Guild Audit",
    "SITE_DESCRIPTION": "Audit your World of Warcraft guild for raid readiness — track missing enchants, lockouts, Mythic+ rankings, and PvP standings. Integrates Battle.net, Raider.io, and Warcraft Logs.",
    "SITE_KEYWORDS": "World of Warcraft, WoW, guild audit, raid readiness, missing enchants, mythic plus, Raider.io, Warcraft Logs, guild roster",
    "OG_IMAGE_URL": "/images/og-image.jpg",
    "TWITTER_IMAGE_URL": "/images/twitter-image.jpg",
    "RESULTS_PAGINATION": {
        "MAX_ITEMS": 20
    },
    "rioBase": "https://raider.io/api/v1",
    "mplus": {
        "maxRatingForScore": 3700
    },
    "warcraftLogs": {
        "zones": [
            {
                "id": 46,
                "name": "VS / DR / MQD",
                "patch": "12.0.0",
                "partition": 1,
                "difficulty": 4,
                "bossCount": 9
            },
            {
                "id": 46,
                "name": "VS / DR / MQD",
                "patch": "12.0.5",
                "partition": 2,
                "difficulty": 4,
                "bossCount": 9
            }
        ]
    }
}
export default data;
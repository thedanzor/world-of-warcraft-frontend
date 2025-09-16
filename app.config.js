const data = {
    "GUILD_NAME": process.env.NEXT_PUBLIC_GUILD_NAME || "GUILD_NAME",
    "GUILD_REALM": process.env.NEXT_PUBLIC_GUILD_REALM || "GUILD_REALM",
    "REGION": "eu",
    "API_PARAM_REQUIREMENTGS": "namespace=profile-eu&locale=en_US",
    "THEME": "default",

    "LEVEL_REQUIREMENT": 80,
    "GUILD_RANK_REQUIREMENT": [0,1,2,3,4,5,6, 7,8,9,10],
    "ITEM_LEVEL_REQUIREMENT": 450,
    "MIN_CHECK_CAP": 450,
    "MAX_CHECK_CAP": 720,
    "MIN_TIER_ITEMLEVEL": 640,
    "ENCHANTABLE_PIECES": ["WRIST", "LEGS", "FEET", "CHEST", "MAIN_HAND", "FINGER_1", "FINGER_2"],
    "MAIN_RANKS": [0,1,3,4,5,6,7],
    "ALT_RANKS": [2,8,9,10],
    "TANKS": ["Blood", "Vengeance", "Guardian", "Brewmaster", "Protection"],
    "HEALERS": ["Preservation", "Mistweaver", "Holy", "Discipline", "Restoration"],
    "DIFFICULTY": ["Mythic", "Heroic", "Normal"],
    "_DRAFT_DIFFICULTY": ["LFR", "Raid Finder", "Mythic", "Heroic", "Normal"],
    "SEASON_START_DATE": "2025-02-25",
    "INITIAL_FILTERS": {
        "rankFilter": "all",
        "activeTab": "all",
        "specFilter": "all",
        "instanceIndex": 0,
        "defaultItemLevel": 645
    },
    "GUILLD_RANKS": [
        "Guild Lead",
        "Officer",
        "Officer Alt",
        "Cunt",
        "Muppet",
        "Raider",
        "Trial Raider",
        "Member",
        "Alt",
        "New Recruit"
    ],
    "RESULTS_PAGINATION": {
        "MAX_ITEMS": 20
    },
    "NAVIGATION": {
        "OVERVIEW": {
            "label": "OVERVIEW",
            "items": [
                {
                    "label": "DASHBOARD",
                    "path": "/",
                    "icon": "DashboardIcon"
                },
                {
                    "label": "RECRUITMENT",
                    "path": "/join",
                    "icon": "HowToRegIcon"
                },
                {
                    "label": "AUDIT",
                    "path": "/audit",
                    "icon": "AssessmentIcon"
                },
                // {
                //     "label": "ERRORS",
                //     "path": "/errors",
                //     "icon": "BugReportIcon"
                // }
            ]
        },
        "SEASON3": {
            "label": "SEASON 3",
            "items": [
                {
                    "label": "MYTHIC PLUS",
                    "path": "/mythic-plus",
                    "icon": "StarIcon"
                },
                {
                    "label": "PVP",
                    "path": "/rated-pvp",
                    "icon": "EmojiEventsIcon"
                },
                {
                    "label": "SIGN UP",
                    "path": "/season3",
                    "icon": "HowToRegIcon"
                }
            ]
        },
        "TOOLS": {
            "label": "TOOLS",
            "items": [
                {
                    "label": "ROSTER BUILDER",
                    "path": "/roster",
                    "icon": "GroupAddIcon"
                }
            ]
        }
    }
}
export default data;
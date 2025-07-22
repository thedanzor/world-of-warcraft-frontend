# Season 3 Stats Components

This directory contains reusable components for displaying Season 3 statistics and data.

## Components

### Core Components
- **ClassStatCard** - Displays class statistics with signed/total counts
- **RoleStatCard** - Displays role statistics with counts and descriptions
- **RosterTable** - Displays roster data in a table format

### Section Components
- **Season3GoalsSection** - Shows Season 3 goal distribution (AOTC, CE, Social)
- **MythicPlusSection** - Shows Mythic+ participation statistics
- **RoleDistributionSection** - Shows tank/healer/DPS distribution
- **ClassDistributionSection** - Shows class distribution across the roster
- **RaidBuffsSection** - Shows raid buffs and utilities availability
- **RaidingEnvironmentSection** - Shows raiding environment preferences

### Container Components
- **TabPanel** - Combines all sections for display in tabs

## Constants

The `constants.js` file contains shared data:
- `classIcons` - Material-UI icons for each WoW class
- `classColors` - Color codes for each WoW class
- `classSpecs` - Available specializations for each class
- `tankSpecs` - List of tank specializations
- `healerSpecs` - List of healer specializations

## Usage

```jsx
import { 
    TabPanel, 
    classIcons, 
    classColors 
} from '@/core/components/Season3Stats'

// Use in your component
<TabPanel
    data={rosterData}
    stats={activeStats}
    totalClassCounts={classCounts}
    headCells={headCells}
    title="Priority Candidates"
    description="Description here"
    classIcons={classIcons}
/>
```

## Props

### TabPanel Props
- `data` - Array of roster data
- `stats` - Object containing calculated statistics
- `totalClassCounts` - Array of class counts from guild data
- `headCells` - Array defining table columns
- `title` - Section title
- `description` - Section description
- `classIcons` - Object mapping class names to icons

### Stats Object Structure
```javascript
{
    roleCounts: { tanks: number, healers: number, dps: number },
    backupRoleCounts: { tanks: number, healers: number, dps: number },
    classCounts: Array<{name: string, count: number}>,
    raidBuffs: Object,
    season3GoalCounts: Object,
    wantToPushKeysCount: number,
    notWantToPushKeysCount: number,
    raidingEnvCounts?: Object // Optional
}
``` 
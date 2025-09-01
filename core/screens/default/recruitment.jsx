/**
 * GUILD RECRUITMENT SCREEN
 * 
 * This screen displays comprehensive guild recruitment information, requirements,
 * and application details for potential new members. It serves as the main
 * recruitment landing page for the guild.
 * 
 * WHAT THIS DOES:
 * - Displays guild recruitment information and requirements
 * - Shows guild benefits and what makes the guild unique
 * - Lists specific requirements for different content types
 * - Provides application process and contact information
 * - Uses engaging visual design to attract potential recruits
 * 
 * KEY FEATURES:
 * - Multi-color heading with guild branding
 * - Detailed requirements breakdown by content type
 * - Guild benefits and culture information
 * - Application process and criteria
 * - Responsive grid layout for organized information
 * - Visual elements and icons for better engagement
 * 
 * CONTENT SECTIONS:
 * - Guild overview and location information
 * - Mythic raiding requirements and criteria
 * - Guild culture and player expectations
 * - Application process and contact details
 * - Benefits of joining the guild
 * 
 * REQUIREMENTS DISPLAY:
 * - Item level requirements (628+ for Season 2)
 * - Raid experience requirements (8/8 Heroic)
 * - Performance expectations (logs, mechanical skill)
 * - Preparation and communication requirements
 * - Class and role-specific needs
 * 
 * DESIGN ELEMENTS:
 * - Material-UI components for consistent styling
 * - Custom typography components for branding
 * - Accordion sections for organized information
 * - Visual icons and dividers for better readability
 * - Responsive design for all device sizes
 * 
 * USAGE:
 * Primary recruitment tool for attracting new guild members.
 * Essential for guild growth and roster building.
 * 
 * MODIFICATION NOTES:
 * - Keep requirements up to date with current content
 * - Ensure contact information is current
 * - Test responsive design on various devices
 * - Consider adding application form integration
 * - Update content for new seasons and content
 */

'use client'

// Next.js
import Link from 'next/link'

// Material-UI components
import { Box, Paper, Grid, Divider, Typography } from '@mui/material'

// Internal components
import ContentWrapper from '@/core/components/content'
import { MultiColorHeadingH1, P, H3, H4 } from '@/core/components/typography'

// Styles
import '@/core/screens/default/scss/recruitment.scss'

/**
 * Recruitment - Guild recruitment and information page
 * Displays guild requirements, benefits, and application process
 */
const Recruitment = () => {
    return (
        <section className="recruitment">
            <ContentWrapper>
                <Box sx={{ pt: 5, pb: 8 }}>
                    <div>
                        <Box sx={{ mb: 2 }}>
                            <MultiColorHeadingH1
                                floatingText="War Within Season 3"
                                highlightText="GUILD NAME"
                            >
                                is recruiting
                            </MultiColorHeadingH1>
                            
                            <Typography variant="body1" sx={{ mt: 3,}}>
                                GUILD NAME is semi-hardcore guild located on the
                                retail EU-Ravencrest Realm.
                                <br /> We&apos;re looking for players who can
                                strengthen our roster and help us progress Mythic as
                                far as possible.
                                <br /> <br /> The guild is welcoming and open to
                                everyone. <br /> Our players are from across the
                                globe, but unite under our banner to enjoy all
                                aspects of the game.
                                <br />
                                <br />
                                <Typography component="span" sx={{ fontWeight: 'bold' }}>
                                    All social applicants and classes are welcome,
                                    for Mythic Raiding we have the following
                                    criteria and requirements <br /> - Exceptions
                                    are possible for exceptional applicants.
                                </Typography>
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Box>
                                    <H3>What we&apos;re looking for:</H3>
                                    <Paper 
                                        sx={{ 
                                            p: 3, 
                                            bgcolor: 'background.default',
                                            borderLeft: '4px solid',
                                            borderColor: 'primary.main',
                                            mt: 2
                                        }}
                                        elevation={3}
                                    >
                                        <Box component="ul" sx={{ pl: 2 }}>
                                            <li>
                                                1) For <strong>Season 2</strong> progression
                                                we&apos;re looking for <strong>628+</strong> itemlevel
                                            </li>
                                            <li>
                                                2) <strong>8/8</strong> Heroic Experience or
                                                greater
                                            </li>
                                            <li>
                                                3) Good logs showing both{' '}
                                                <strong>Output and Mechanical</strong>{' '}
                                                performance
                                            </li>
                                            <li>
                                                4) <strong>Being prepared</strong> in
                                                analyzing your own logs, class and spec, as
                                                well as reading into raid mechanics
                                            </li>
                                            <li>
                                                5){' '}
                                                <strong>Good Communication Skills</strong>{' '}
                                                and <strong>Teamwork</strong>
                                            </li>
                                            <li>
                                                6) Can take{' '}
                                                <strong>Constructive Critism</strong> inline
                                            </li>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box>
                                    <H3>Guild Benefits:</H3>
                                    <Paper 
                                        sx={{ 
                                            p: 3, 
                                            bgcolor: 'background.default',
                                            borderLeft: '4px solid',
                                            borderColor: 'success.main',
                                            mt: 2
                                        }}
                                        elevation={3}
                                    >
                                        <Box component="ul" sx={{ pl: 2 }}>
                                            <li>
                                                <strong>Organized Raid Schedule:</strong> Consistent raid times with clear communication
                                            </li>
                                            <li>
                                                <strong>Progression Focus:</strong> Dedicated to pushing Mythic content as far as possible
                                            </li>
                                            <li>
                                                <strong>Community:</strong> Active Discord server with friendly, helpful members
                                            </li>
                                            <li>
                                                <strong>Guild Bank:</strong> Access to consumables and materials for progression
                                            </li>
                                            <li>
                                                <strong>Mythic+ Groups:</strong> Regular dungeon runs for gear and practice
                                            </li>
                                            <li>
                                                <strong>PvP Activities:</strong> Rated battlegrounds and arena teams
                                            </li>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Box>
                                    <H3>Application Process:</H3>
                                    <Paper 
                                        sx={{ 
                                            p: 3, 
                                            bgcolor: 'background.default',
                                            borderLeft: '4px solid',
                                            borderColor: 'warning.main',
                                            mt: 2
                                        }}
                                        elevation={3}
                                    >
                                        <Box component="ol" sx={{ pl: 2 }}>
                                            <li>
                                                <strong>Submit Application:</strong> Fill out our recruitment form with your details
                                            </li>
                                            <li>
                                                <strong>Character Review:</strong> Officers will review your logs, gear, and experience
                                            </li>
                                            <li>
                                                <strong>Trial Period:</strong> Join us for a few raids to see if we&apos;re a good fit
                                            </li>
                                            <li>
                                                <strong>Guild Membership:</strong> Full access to guild benefits and progression
                                            </li>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box>
                                    <H3>Current Needs:</H3>
                                    <Paper 
                                        sx={{ 
                                            p: 3, 
                                            bgcolor: 'background.default',
                                            borderLeft: '4px solid',
                                            borderColor: 'info.main',
                                            mt: 2
                                        }}
                                        elevation={3}
                                    >
                                        <Box component="ul" sx={{ pl: 2 }}>
                                            <li>
                                                <strong>Healers:</strong> All healing specializations welcome
                                            </li>
                                            <li>
                                                <strong>Tanks:</strong> Experienced tank players for progression
                                            </li>
                                            <li>
                                                <strong>DPS:</strong> High-performing damage dealers
                                            </li>
                                            <li>
                                                <strong>Social Members:</strong> Casual players welcome to join our community
                                            </li>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                    </div>
                </Box>
            </ContentWrapper>
        </section>
    )
}

export default Recruitment

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
import { Box, Paper, Grid, Divider, Typography, Chip } from '@mui/material'
import { 
    Group as GroupIcon,
    Schedule as ScheduleIcon,
    Star as StarIcon,
    School as SchoolIcon,
    Work as WorkIcon,
    ContactSupport as ContactIcon,
    Chat as ChatIcon,
    Email as EmailIcon
} from '@mui/icons-material'

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
                        <Box sx={{ mb: 4 }}>
                            <MultiColorHeadingH1
                                floatingText="War Within Season 3"
                                highlightText="GUILD NAME"
                            >
                                is recruiting
                            </MultiColorHeadingH1>
                            
                            <Typography variant="body1" sx={{ mt: 3, mb: 2 }}>
                                GUILD NAME is a semi-hardcore guild located on the
                                retail EU-Ravencrest Realm.
                                <br /> We&apos;re looking for players who can
                                strengthen our roster and help us progress Mythic as
                                far as possible.
                            </Typography>
                            
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                The guild is welcoming and open to
                                everyone. Our players are from across the
                                globe, but unite under our banner to enjoy all
                                aspects of the game.
                            </Typography>
                            
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#B08D5A' }}>
                                All social applicants and classes are welcome.
                                For Mythic Raiding we have the following
                                criteria and requirements - exceptions
                                are possible for exceptional applicants.
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* Requirements Section */}
                        <div className="recruitment-section">
                            <div className="section-header">
                                <H3>
                                    <WorkIcon className="section-icon" />
                                    What we&apos;re looking for
                                </H3>
                            </div>
                            
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Paper className="recruitment-card requirements">
                                        <H4>Mythic Raiding Requirements</H4>
                                        <Box component="ul">
                                            <li>
                                                <strong>Item Level:</strong> 628+ for Season 3 progression
                                            </li>
                                            <li>
                                                <strong>Raid Experience:</strong> 8/8 Heroic experience or greater
                                            </li>
                                            <li>
                                                <strong>Performance:</strong> Good logs showing both Output and Mechanical performance
                                            </li>
                                            <li>
                                                <strong>Preparation:</strong> Being prepared in analyzing your own logs, class and spec, as well as reading into raid mechanics
                                            </li>
                                            <li>
                                                <strong>Communication:</strong> Good Communication Skills and Teamwork
                                            </li>
                                            <li>
                                                <strong>Attitude:</strong> Can take Constructive Criticism in stride
                                            </li>
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper className="recruitment-card benefits">
                                        <H4>Guild Benefits</H4>
                                        <Box component="ul">
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
                                </Grid>
                            </Grid>
                        </div>

                        <Divider sx={{ my: 4 }} />

                        {/* Application Process & Current Needs */}
                        <div className="recruitment-section">
                            <div className="section-header">
                                <H3>
                                    <SchoolIcon className="section-icon" />
                                    Application Process & Current Needs
                                </H3>
                            </div>
                            
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Paper className="recruitment-card process">
                                        <H4>Application Process</H4>
                                        <Box component="ol">
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
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper className="recruitment-card needs">
                                        <H4>Current Needs</H4>
                                        <Box component="ul">
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
                                </Grid>
                            </Grid>
                        </div>

                        <Divider sx={{ my: 4 }} />

                        {/* Raid Schedule */}
                        <div className="recruitment-section">
                            <div className="section-header">
                                <H3>
                                    <ScheduleIcon className="section-icon" />
                                    Raid Schedule
                                </H3>
                            </div>
                            
                            <Paper className="recruitment-card schedule">
                                <div className="schedule-grid">
                                    <div className="schedule-item">
                                        <div className="schedule-day">Tuesday</div>
                                        <div className="schedule-time">20:00 - 23:00 CET</div>
                                        <div className="schedule-activity">Mythic Progression</div>
                                    </div>
                                    <div className="schedule-item">
                                        <div className="schedule-day">Thursday</div>
                                        <div className="schedule-time">20:00 - 23:00 CET</div>
                                        <div className="schedule-activity">Mythic Progression</div>
                                    </div>
                                    <div className="schedule-item">
                                        <div className="schedule-day">Sunday</div>
                                        <div className="schedule-time">19:00 - 22:00 CET</div>
                                        <div className="schedule-activity">Heroic Farm / Alt Runs</div>
                                    </div>
                                </div>
                            </Paper>
                        </div>

                        <Divider sx={{ my: 4 }} />

                        {/* Guild Culture */}
                        <div className="recruitment-section">
                            <div className="section-header">
                                <H3>
                                    <GroupIcon className="section-icon" />
                                    Guild Culture & Expectations
                                </H3>
                            </div>
                            
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Paper className="recruitment-card">
                                        <H4>What We Expect</H4>
                                        <Box component="ul">
                                            <li>
                                                <strong>Attendance:</strong> 80% raid attendance for core raiders
                                            </li>
                                            <li>
                                                <strong>Preparation:</strong> Come prepared with consumables and knowledge
                                            </li>
                                            <li>
                                                <strong>Communication:</strong> Active participation in Discord during raids
                                            </li>
                                            <li>
                                                <strong>Improvement:</strong> Willingness to learn and improve
                                            </li>
                                            <li>
                                                <strong>Respect:</strong> Treat all members with respect and dignity
                                            </li>
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper className="recruitment-card">
                                        <H4>What You Can Expect</H4>
                                        <Box component="ul">
                                            <li>
                                                <strong>Support:</strong> Help with gearing, enchants, and consumables
                                            </li>
                                            <li>
                                                <strong>Guidance:</strong> Experienced players to help you improve
                                            </li>
                                            <li>
                                                <strong>Community:</strong> Friendly atmosphere both in-game and Discord
                                            </li>
                                            <li>
                                                <strong>Progression:</strong> Clear goals and progression path
                                            </li>
                                            <li>
                                                <strong>Fun:</strong> We take raiding seriously but have fun doing it
                                            </li>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </div>

                        <Divider sx={{ my: 4 }} />

                        {/* Guild Achievements */}
                        <div className="recruitment-section">
                            <div className="section-header">
                                <H3>
                                    <StarIcon className="section-icon" />
                                    Guild Achievements & Goals
                                </H3>
                            </div>
                            
                            <Paper className="recruitment-card">
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <H4>Current Season Goals</H4>
                                        <Box component="ul">
                                            <li>
                                                <strong>Mythic Progression:</strong> Clear current tier on Mythic difficulty
                                            </li>
                                            <li>
                                                <strong>Guild Ranking:</strong> Maintain top 500 EU ranking
                                            </li>
                                            <li>
                                                <strong>Roster Development:</strong> Build a strong, consistent 25-man roster
                                            </li>
                                            <li>
                                                <strong>Community Growth:</strong> Expand our social member base
                                            </li>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <H4>Long-term Vision</H4>
                                        <Box component="ul">
                                            <li>
                                                <strong>Consistent Progression:</strong> Maintain steady Mythic progression each tier
                                            </li>
                                            <li>
                                                <strong>Community Building:</strong> Create a welcoming environment for all players
                                            </li>
                                            <li>
                                                <strong>Player Development:</strong> Help members improve and achieve their goals
                                            </li>
                                            <li>
                                                <strong>Guild Stability:</strong> Build a sustainable, long-term guild structure
                                            </li>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </div>

                        <Divider sx={{ my: 4 }} />

                        {/* Contact Section */}
                        <div className="contact-section">
                            <H3>
                                <ContactIcon className="section-icon" />
                                Ready to Join Us?
                            </H3>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                If you&apos;re interested in joining our guild, please reach out to us through one of the following channels:
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                                <Chip 
                                    icon={<ChatIcon />} 
                                    label="Join our Discord" 
                                    component="a" 
                                    href="https://discord.gg/yourguild" 
                                    target="_blank"
                                    sx={{ 
                                        m: 1, 
                                        bgcolor: '#5865F2', 
                                        color: 'white',
                                        '&:hover': { bgcolor: '#4752C4' }
                                    }}
                                />
                                <Chip 
                                    icon={<EmailIcon />} 
                                    label="Contact Officers" 
                                    component="a" 
                                    href="mailto:officers@yourguild.com"
                                    sx={{ 
                                        m: 1, 
                                        bgcolor: '#B08D5A', 
                                        color: 'white',
                                        '&:hover': { bgcolor: '#9A7A4A' }
                                    }}
                                />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary">
                                We typically respond to applications within 24-48 hours.
                                <br />
                                Don&apos;t hesitate to reach out with any questions!
                            </Typography>
                        </div>

                    </div>
                </Box>
            </ContentWrapper>
        </section>
    )
}

export default Recruitment

'use client'

// Next.js
import Link from 'next/link'

// Material-UI components
import { Box, Paper, Grid, Divider, Typography, Container } from '@mui/material'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GroupsIcon from '@mui/icons-material/Groups'
import CelebrationIcon from '@mui/icons-material/Celebration'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import HandshakeIcon from '@mui/icons-material/Handshake'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'

// Internal components
import ContentWrapper from '@/core/components/content'
import { MultiColorHeadingH1, P, H3, H4 } from '@/core/components/typography'
import ThemeProvider from '@/core/themes'

// Styles
import '@/core/sections/scss/recruitment.scss'

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

                            {/* Rest of the component would continue here... */}
                            {/* For brevity, showing the key structure and imports */}
                        </Grid>
                    </div>
                </Box>
            </ContentWrapper>
        </section>
    )
}

export default Recruitment

/**
 * @file Member Detail Screen Component
 * @module core/screens/default/memberDetail
 */

'use client'

import React, { useState, useEffect } from 'react'
import { 
    Typography, 
    Box, 
    Alert, 
    CircularProgress, 
    Paper, 
    Grid, 
    Card, 
    CardContent,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Button,
    Divider
} from '@mui/material'
import { P } from '@/core/components/typography'
import { useRouter } from 'next/navigation'

// Styles
import '@/core/screens/default/scss/mplus.scss'
import '@/core/screens/default/scss/guildAudit.scss'

const MemberDetail = ({ auditable, memberData, realm, character }) => {
    const router = useRouter()

    // Decode character and realm names if they're URL-encoded
    const decodedCharacter = decodeURIComponent(character)
    const decodedRealm = decodeURIComponent(realm)

    useEffect(() => {
        console.log(memberData)
    }, [memberData])
    
    // Extract data from the new structure
    const seasonalData = memberData?.seasonalData
    const characterData = memberData?.characterData
    const loading = false // No longer need loading state since data comes from server
    const error = memberData?.error

    const getScoreColor = (score) => {
        if (!score) return '#666'
        if (score >= 3000) return '#ffd700' // Gold
        if (score >= 2500) return '#c0c0c0' // Silver
        if (score >= 2000) return '#cd7f32' // Bronze
        if (score >= 1500) return '#4CAF50' // Green
        if (score >= 1000) return '#B08D5A' // Brown
        return '#A3A3A3' // Gray
    }

    const StatCard = ({ title, value, subtitle, color = '#FFFFFF' }) => (
        <Card sx={{ 
            backgroundColor: 'rgba(17, 17, 17, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            height: '100%'
        }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: '#A3A3A3', mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ color, fontWeight: '700', mb: 1 }}>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    )

    const handleBackClick = () => {
        router.push('/mythic-plus')
    }

    // Handle loading and error states
    if (!memberData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    if (memberData.error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    <Typography variant="h6">Failed to load member data</Typography>
                    <Typography variant="body2">{memberData.error}</Typography>
                </Alert>
            </Box>
        )
    }

    // characterData is already extracted above

    return (
        <section className="guildAudit">
            <div className={`bodyContent sidebarclosed`}>
                <div className="mainContent">
                    {/* Header */}
                    <div className="logoHolder" style={{ marginTop: '40px', padding: '0 16px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Button 
                                variant="outlined" 
                                onClick={handleBackClick}
                                sx={{ 
                                    color: '#B08D5A',
                                    borderColor: '#B08D5A',
                                    '&:hover': {
                                        borderColor: '#B08D5A',
                                        backgroundColor: 'rgba(176, 141, 90, 0.1)'
                                    }
                                }}
                            >
                                ← Back to Mythic+
                            </Button>
                        </Box>
                        
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                textTransform: 'capitalize !important',
                                textAlign: 'left',
                            }}
                        >
                            {decodedCharacter} - {decodedRealm}
                        </Typography>
                        <Typography
                            variant="p"
                            component="p"
                            color="text.secondary"
                            sx={{
                                mb: 4,
                                textAlign: 'left',
                            }}
                        >
                            Mythic+ profile and seasonal statistics
                        </Typography>
                    </div>

                    {/* Character Overview */}
                    <Paper sx={{ 
                        mb: 3,
                        p: 3,
                        backgroundColor: 'rgba(17, 17, 17, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {characterData?.media?.assets?.length ? (
                                        <img
                                            src={characterData.media.assets[0].value}
                                            alt={decodedCharacter}
                                            width={80}
                                            height={80}
                                            style={{
                                                borderRadius: '12px',
                                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src="/images/logo-without-text.png"
                                            alt={decodedCharacter}
                                            width={80}
                                            height={80}
                                            style={{
                                                borderRadius: '12px',
                                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                                opacity: '0.6'
                                            }}
                                        />
                                    )}
                                    <Box>
                                        <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: '700' }}>
                                            {decodedCharacter}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: '#A3A3A3' }}>
                                            {characterData?.metaData?.spec} {characterData?.metaData?.class}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                                            {decodedRealm} • Level {characterData?.metaData?.level || 'Unknown'} • 
                                            Item Level: 
                                            <span style={{ 
                                                color: '#B08D5A',
                                                fontWeight: '700',
                                                marginLeft: '4px'
                                            }}>
                                                {characterData?.itemlevel?.equiped || 0}
                                            </span>
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                                            Current Rating: 
                                            <span style={{ 
                                                color: getScoreColor(characterData?.processedStats?.mythicPlusScore),
                                                fontWeight: '700',
                                                marginLeft: '8px'
                                            }}>
                                                {Math.round(characterData?.processedStats?.mythicPlusScore || 0)}
                                            </span>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <StatCard 
                                            title="Current Rating"
                                            value={Math.round(characterData?.processedStats?.mythicPlusScore || 0)}
                                            color={getScoreColor(characterData?.processedStats?.mythicPlusScore)}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <StatCard 
                                            title="Highest Key"
                                            value={seasonalData?.highestKeyOverall || 0}
                                            subtitle="Overall"
                                            color={getScoreColor((seasonalData?.highestKeyOverall || 0) * 100)}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <StatCard 
                                            title="Timed Key"
                                            value={seasonalData?.highestTimedKey || 0}
                                            subtitle="Best timed"
                                            color={getScoreColor((seasonalData?.highestTimedKey || 0) * 100)}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <StatCard 
                                            title="Total Runs"
                                            value={seasonalData?.totalRuns || 0}
                                            subtitle={`${Math.round(seasonalData?.completionRate || 0)}% timed`}
                                            color="#FF9800"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Equipment & Gear Status */}
                    {characterData?.equipement && (
                        <Paper sx={{ 
                            mb: 3,
                            p: 3,
                            backgroundColor: 'rgba(17, 17, 17, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}>
                            <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 2 }}>
                                Equipment Status
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Card sx={{ 
                                        backgroundColor: characterData.ready ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                        border: `1px solid ${characterData.ready ? '#4CAF50' : '#F44336'}`
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ 
                                                color: characterData.ready ? '#4CAF50' : '#F44336',
                                                fontWeight: '700',
                                                textAlign: 'left'
                                            }}>
                                                {characterData.ready ? 'Ready' : 'Not Ready'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                                                {characterData.ready ? 'All enchants applied' : `${characterData.missingEnchants} missing enchants`}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Card sx={{ 
                                        backgroundColor: characterData.hasTierSet ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                                        border: `1px solid ${characterData.hasTierSet ? '#4CAF50' : '#FF9800'}`
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ 
                                                color: characterData.hasTierSet ? '#4CAF50' : '#FF9800',
                                                fontWeight: '700',
                                                textAlign: 'left'
                                            }}>
                                                {characterData.hasTierSet ? 'Tier Set' : 'No Tier Set'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                                                {characterData.hasTierSet ? 'Tier pieces equipped' : 'No tier pieces found'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Card sx={{ 
                                        backgroundColor: characterData.isActiveInSeason2 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                                        border: `1px solid ${characterData.isActiveInSeason2 ? '#4CAF50' : '#FF9800'}`
                                    }}>
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            <Typography variant="h6" sx={{ 
                                                color: characterData.isActiveInSeason2 ? '#4CAF50' : '#FF9800',
                                                fontWeight: '700',
                                                textAlign: 'left'
                                            }}>
                                                {characterData.isActiveInSeason2 ? 'Active' : 'Inactive'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#A3A3A3' }}>
                                                {characterData.isActiveInSeason2 ? 'Active this season' : 'Inactive this season'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}

                    {/* Seasonal Statistics */}
                    {error ? (
                        <Alert severity="error">
                            <Typography variant="h6">Failed to load seasonal statistics</Typography>
                            <Typography variant="body2">{error}</Typography>
                        </Alert>
                    ) : seasonalData ? (
                        <Box>
                            {/* Top Played Members */}
                            {seasonalData.topPlayedMembers?.length > 0 && (
                                <Paper sx={{ 
                                    mb: 3,
                                    backgroundColor: 'rgba(17, 17, 17, 0.8)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <Box sx={{ p: 3 }}>
                                        <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 2 }}>
                                            Most Played With
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {seasonalData.topPlayedMembers.slice(0, 6).map((member, index) => (
                                                <Grid item xs={12} sm={6} md={4} key={index}>
                                                    <Card sx={{ 
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                                    }}>
                                                        <CardContent sx={{ p: 2 }}>
                                                            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: '600' }}>
                                                                {member.name}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#A3A3A3', mb: 1 }}>
                                                                {member.spec} • {member.server}
                                                            </Typography>
                                                            <Chip 
                                                                label={`${member.count} runs`}
                                                                size="small"
                                                                sx={{ 
                                                                    backgroundColor: '#B08D5A',
                                                                    color: '#FFFFFF',
                                                                    fontWeight: '600'
                                                                }}
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Paper>
                            )}

                            {/* Dungeon Performance */}
                            {Object.keys(seasonalData.dungeonStats || {}).length > 0 && (
                                <Paper sx={{ 
                                    mb: 3,
                                    backgroundColor: 'rgba(17, 17, 17, 0.8)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                }}>
                                    <Box sx={{ p: 3 }}>
                                        <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 2 }}>
                                            Dungeon Performance
                                        </Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Dungeon</TableCell>
                                                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Runs</TableCell>
                                                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Timed</TableCell>
                                                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Highest Key</TableCell>
                                                        <TableCell sx={{ color: '#FFFFFF', fontWeight: '600' }}>Avg Rating</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Object.entries(seasonalData.dungeonStats).map(([dungeon, stats]) => (
                                                        <TableRow key={dungeon}>
                                                            <TableCell sx={{ color: '#A3A3A3' }}>
                                                                <Typography variant="body1" sx={{ fontWeight: '600', color: '#FFFFFF' }}>
                                                                    {dungeon}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#A3A3A3' }}>
                                                                {stats.totalRuns}
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#A3A3A3' }}>
                                                                <span style={{ 
                                                                    color: stats.timedRuns > 0 ? '#4CAF50' : '#A3A3A3',
                                                                    fontWeight: '600'
                                                                }}>
                                                                    {stats.timedRuns}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#A3A3A3' }}>
                                                                <span style={{ 
                                                                    color: getScoreColor(stats.highestKey * 100),
                                                                    fontWeight: '700'
                                                                }}>
                                                                    +{stats.highestKey}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell sx={{ color: '#A3A3A3' }}>
                                                                <span style={{ 
                                                                    color: getScoreColor(stats.averageRating),
                                                                    fontWeight: '600'
                                                                }}>
                                                                    {Math.round(stats.averageRating)}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Paper>
                            )}
                        </Box>
                    ) : (
                        <Alert severity="info">
                            <Typography variant="h6">No seasonal data available</Typography>
                            <Typography variant="body2">This character hasn't completed any Mythic+ runs this season.</Typography>
                        </Alert>
                    )}
                </div>
            </div>
        </section>
    )
}

export default MemberDetail

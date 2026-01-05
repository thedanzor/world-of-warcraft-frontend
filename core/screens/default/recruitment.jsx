'use client'

// React
import { useState, useEffect } from 'react'

// Next.js
import Link from 'next/link'

// Material-UI components
import { Box, Paper, Grid, Divider, Typography, Chip, CircularProgress, Alert } from '@mui/material'
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
 * Now uses a block-based system for dynamic content
 */
const Recruitment = () => {
    const [joinText, setJoinText] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJoinText = async () => {
            try {
                setLoading(true);
                setError('');
                
                const response = await fetch('/api/jointext');
                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || data.error || 'Failed to load join text');
                    return;
                }

                setJoinText(data.joinText);
            } catch (error) {
                console.error('Error fetching join text:', error);
                setError('Failed to load join text. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchJoinText();
    }, []);

    const getIcon = (iconName) => {
        const icons = {
            work: WorkIcon,
            school: SchoolIcon,
            schedule: ScheduleIcon,
            group: GroupIcon,
            star: StarIcon,
            contact: ContactIcon
        };
        return icons[iconName] || WorkIcon;
    };

    const renderBlock = (block) => {
        const { type, data } = block;

        switch (type) {
            case 'heading':
                return (
                    <Box sx={{ mb: 4 }}>
                        <MultiColorHeadingH1
                            floatingText={data.floatingText || ''}
                            highlightText={data.highlightText || ''}
                        >
                            {data.mainText || ''}
                        </MultiColorHeadingH1>
                    </Box>
                );

            case 'text':
                return (
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {data.content || ''}
                    </Typography>
                );

            case 'text-highlight':
                return (
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#FFD700', mb: 2 }}>
                        {data.content || ''}
                    </Typography>
                );

            case 'list':
                const ListIcon = getIcon(data.icon);
                return (
                    <div className="recruitment-section">
                        <div className="section-header">
                            <H3>
                                <ListIcon className="section-icon" />
                                {data.sectionTitle || ''}
                            </H3>
                        </div>
                        <Paper className="recruitment-card">
                            <H4>{data.title || ''}</H4>
                            <Box component="ul">
                                {(data.items || []).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </Box>
                        </Paper>
                    </div>
                );

            case 'two-column-list':
                const TwoColIcon = getIcon(data.icon);
                return (
                    <div className="recruitment-section">
                        <div className="section-header">
                            <H3>
                                <TwoColIcon className="section-icon" />
                                {data.sectionTitle || ''}
                            </H3>
                        </div>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Paper className="recruitment-card">
                                    <H4>{data.leftColumn?.title || ''}</H4>
                                    <Box component="ul">
                                        {(data.leftColumn?.items || []).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper className="recruitment-card">
                                    <H4>{data.rightColumn?.title || ''}</H4>
                                    <Box component="ul">
                                        {(data.rightColumn?.items || []).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                );

            case 'schedule':
                const ScheduleIconComp = getIcon(data.icon);
                return (
                    <div className="recruitment-section">
                        <div className="section-header">
                            <H3>
                                <ScheduleIconComp className="section-icon" />
                                {data.sectionTitle || ''}
                            </H3>
                        </div>
                        <Paper className="recruitment-card schedule">
                            <div className="schedule-grid">
                                {(data.items || []).map((item, index) => (
                                    <div key={index} className="schedule-item">
                                        <div className="schedule-day">{item.day}</div>
                                        <div className="schedule-time">{item.time}</div>
                                        <div className="schedule-activity">{item.activity}</div>
                                    </div>
                                ))}
                            </div>
                        </Paper>
                    </div>
                );

            case 'contact':
                const ContactIconComp = getIcon(data.icon);
                return (
                    <div className="contact-section">
                        <H3>
                            <ContactIconComp className="section-icon" />
                            {data.sectionTitle || ''}
                        </H3>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            {data.description || ''}
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                            {data.discord?.url && (
                                <Chip 
                                    icon={<ChatIcon />} 
                                    label={data.discord.label || 'Join our Discord'} 
                                    component="a" 
                                    href={data.discord.url} 
                                    target="_blank"
                                    sx={{ 
                                        m: 1, 
                                        bgcolor: '#5865F2', 
                                        color: 'white',
                                        '&:hover': { bgcolor: '#4752C4' }
                                    }}
                                />
                            )}
                            {data.email?.url && (
                                <Chip 
                                    icon={<EmailIcon />} 
                                    label={data.email.label || 'Contact Officers'} 
                                    component="a" 
                                    href={data.email.url}
                                    sx={{ 
                                        m: 1, 
                                        bgcolor: '#FFD700', 
                                        color: 'white',
                                        '&:hover': { bgcolor: '#9A7A4A' }
                                    }}
                                />
                            )}
                        </Box>
                        
                        {data.footer && (
                            <Typography variant="body2" color="text.secondary">
                                {data.footer}
                            </Typography>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <section className="recruitment">
                <ContentWrapper>
                    <Box sx={{ pt: 5, pb: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <CircularProgress />
                    </Box>
                </ContentWrapper>
            </section>
        );
    }

    if (error || !joinText || !joinText.blocks) {
        return (
            <section className="recruitment">
                <ContentWrapper>
                    <Box sx={{ pt: 5, pb: 8 }}>
                        <Alert severity="error">
                            {error || 'Failed to load join page content. Please try again later.'}
                        </Alert>
                    </Box>
                </ContentWrapper>
            </section>
        );
    }

    // Sort blocks by order
    const sortedBlocks = [...joinText.blocks].sort((a, b) => a.order - b.order);

    return (
        <section className="recruitment">
            <ContentWrapper>
                <Box sx={{ pt: 5, pb: 8 }}>
                    {sortedBlocks.map((block, index) => (
                        <Box key={block.id}>
                            {renderBlock(block)}
                            {index < sortedBlocks.length - 1 && <Divider sx={{ my: 4 }} />}
                        </Box>
                    ))}
                </Box>
            </ContentWrapper>
        </section>
    )
}

export default Recruitment

'use client'

// React
import { useState, useEffect } from 'react'

// Material-UI components
import { Box, Paper, Grid, CircularProgress, Alert, Typography, Chip, Container } from '@mui/material'
import { 
    Chat as ChatIcon, 
    Email as EmailIcon,
    CheckCircle as CheckCircleIcon,
    EmojiEvents as TrophyIcon,
    People as PeopleIcon,
    Schedule as ScheduleIcon,
    ContactMail as ContactMailIcon,
    Gavel as RulesIcon
} from '@mui/icons-material'

// Internal components
import ContentWrapper from '@/core/components/content'

// Styles
import '@/core/screens/default/scss/recruitment.scss'

/**
 * Recruitment - Guild recruitment and information page
 * Displays guild requirements, benefits, and application process
 * Uses a section-based system for flexible content layout
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
                
                const response = await fetch('/api/jointext', {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                    }
                });
                const data = await response.json();

                console.log('📥 Join page received data:', data);
                console.log('📦 Sections count:', data.joinText?.sections?.length || 0);

                if (!response.ok) {
                    setError(data.message || data.error || 'Failed to load join text');
                    return;
                }

                // Ensure hero exists with defaults if not present
                const fetchedData = data.joinText || {};
                if (!fetchedData.hero) {
                    fetchedData.hero = {
                        title: 'Join Our Guild',
                        subtitle: 'Embark on epic adventures with skilled players.',
                        badges: []
                    };
                }
                setJoinText(fetchedData);
            } catch (error) {
                console.error('Error fetching join text:', error);
                setError('Failed to load join text. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchJoinText();
    }, []);

    const renderBlock = (block, sectionIndex) => {
        const widthProps = block.layout === 'full' 
            ? { xs: 12 } 
            : { xs: 12, md: 6 };

        // Determine card type for styling and icon
        const getCardType = () => {
            const title = block.title.toLowerCase();
            if (title.includes('requirement') || title.includes('criteria')) return 'requirements';
            if (title.includes('benefit') || title.includes('guild')) return 'benefits';
            if (title.includes('process') || title.includes('application')) return 'process';
            if (title.includes('need') || title.includes('recruiting')) return 'needs';
            if (title.includes('schedule') || title.includes('raid')) return 'schedule';
            if (title.includes('contact') || title.includes('join')) return 'contact';
            return '';
        };

        const getIcon = () => {
            const cardType = getCardType();
            const iconProps = { sx: { fontSize: '2rem', color: '#FFD700' } };
            
            switch(cardType) {
                case 'requirements': return <RulesIcon {...iconProps} />;
                case 'benefits': return <TrophyIcon {...iconProps} />;
                case 'process': return <CheckCircleIcon {...iconProps} />;
                case 'needs': return <PeopleIcon {...iconProps} />;
                case 'schedule': return <ScheduleIcon {...iconProps} />;
                case 'contact': return <ContactMailIcon {...iconProps} />;
                default: return <CheckCircleIcon {...iconProps} />;
            }
        };

        return (
            <Grid item {...widthProps} key={block.id}>
                <Paper 
                    className={`recruitment-card ${getCardType()}`}
                    elevation={0}
                    sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'visible'
                    }}
                >
                    {/* Icon Badge */}
                    <Box 
                        className="card-icon-badge"
                        sx={{
                            position: 'absolute',
                            top: -16,
                            left: 24,
                            background: 'linear-gradient(135deg, #1a2332 0%, #0f1621 100%)',
                            border: '2px solid #FFD700',
                            borderRadius: '12px',
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                            zIndex: 1
                        }}
                    >
                        {getIcon()}
                    </Box>

                    <Box sx={{ pt: 2.5 }}>
                        <Typography 
                            component="h3"
                            sx={{ 
                                color: '#FFD700',
                                fontSize: '1.5rem',
                                fontWeight: 600,
                                mb: 3,
                                mt: 1.5,
                                letterSpacing: '-0.01em',
                                textShadow: '0 2px 8px rgba(255, 215, 0, 0.2)'
                            }}
                        >
                            {block.title}
                        </Typography>
                    </Box>

                    {block.type === 'text' && (
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                whiteSpace: 'pre-line',
                                color: '#B0C4DE',
                                lineHeight: 1.8,
                                fontSize: '1.0625rem',
                                mt: 0.5
                            }}
                        >
                            {block.content}
                        </Typography>
                    )}

                    {block.type === 'list' && (
                        <Box 
                            component="ul" 
                            sx={{ 
                                pl: 0,
                                m: 0,
                                mt: 0.5,
                                listStyle: 'none',
                                '& li': {
                                    position: 'relative',
                                    pl: 3.5,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    '&:before': {
                                        content: '"▸"',
                                        position: 'absolute',
                                        left: 0,
                                        top: '2px',
                                        color: '#FFD700',
                                        fontWeight: 'bold',
                                        fontSize: '1.25rem',
                                        lineHeight: 1
                                    },
                                    '&:last-child': {
                                        mb: 0
                                    }
                                }
                            }}
                        >
                            {block.items.map((item, index) => (
                                <li key={index}>
                                    <Typography 
                                        variant="body1" 
                                        component="span"
                                        sx={{ 
                                            color: '#B0C4DE',
                                            lineHeight: 1.7,
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {item}
                                    </Typography>
                                </li>
                            ))}
                        </Box>
                    )}

                    {block.type === 'contact' && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                {block.discord?.url && (
                                    <Chip 
                                        icon={<ChatIcon />} 
                                        label={block.discord.label} 
                                        component="a" 
                                        href={block.discord.url} 
                                        target="_blank"
                                        clickable
                                        sx={{ 
                                            bgcolor: '#5865F2', 
                                            color: 'white',
                                            fontSize: '1rem',
                                            py: 2.5,
                                            px: 3,
                                            height: 'auto',
                                            '& .MuiChip-icon': {
                                                fontSize: '1.25rem',
                                                color: 'white'
                                            },
                                            '&:hover': { 
                                                bgcolor: '#4752C4',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    />
                                )}
                                {block.email?.url && (
                                    <Chip 
                                        icon={<EmailIcon />} 
                                        label={block.email.label} 
                                        component="a" 
                                        href={block.email.url}
                                        clickable
                                        sx={{ 
                                            bgcolor: '#FFD700', 
                                            color: '#0a1628',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            py: 2.5,
                                            px: 3,
                                            height: 'auto',
                                            '& .MuiChip-icon': {
                                                fontSize: '1.25rem',
                                                color: '#0a1628'
                                            },
                                            '&:hover': { 
                                                bgcolor: '#FFC700',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Grid>
        );
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

    if (error || !joinText || !joinText.sections) {
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

    // Sort sections by order
    const sortedSections = [...joinText.sections].sort((a, b) => a.order - b.order);

    // Hero badge color mapping
    const getBadgeStyle = (color) => {
        const styles = {
            gold: {
                bgcolor: 'rgba(255, 215, 0, 0.1)',
                color: '#FFD700',
                border: '1px solid rgba(255, 215, 0, 0.3)'
            },
            blue: {
                bgcolor: 'rgba(176, 196, 222, 0.1)',
                color: '#B0C4DE',
                border: '1px solid rgba(176, 196, 222, 0.3)'
            },
            green: {
                bgcolor: 'rgba(81, 207, 102, 0.1)',
                color: '#51cf66',
                border: '1px solid rgba(81, 207, 102, 0.3)'
            }
        };
        return styles[color] || styles.blue;
    };

    return (
        <section className="recruitment">
            {/* Hero Section */}
            {joinText.hero && (
                <Box 
                    className="recruitment-hero"
                    sx={{
                        background: 'none',
                        borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                        py: 8,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }
                    }}
                >
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            <Typography 
                                variant="h1" 
                                sx={{ 
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    fontWeight: 700,
                                    color: '#FFFFFF',
                                    mb: 2,
                                    textShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
                                    letterSpacing: '-0.02em'
                                }}
                            >
                                {joinText.hero.title}
                            </Typography>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontSize: { xs: '1.125rem', md: '1.375rem' },
                                    color: '#B0C4DE',
                                    maxWidth: '800px',
                                    mx: 'auto',
                                    lineHeight: 1.6,
                                    opacity: 0.9
                                }}
                            >
                                {joinText.hero.subtitle}
                            </Typography>
                            
                            {/* Decorative Elements */}
                            {joinText.hero.badges && joinText.hero.badges.length > 0 && (
                                <Box sx={{ 
                                    mt: 4, 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    gap: 2,
                                    flexWrap: 'wrap'
                                }}>
                                    {joinText.hero.badges.map((badge, index) => (
                                        <Chip 
                                            key={index}
                                            label={badge.label} 
                                            sx={{ 
                                                ...getBadgeStyle(badge.color),
                                                fontWeight: 600
                                            }} 
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Container>
                </Box>
            )}

            {/* Content Sections */}
            <ContentWrapper>
                <Box sx={{ pt: 10, pb: 12 }}>
                    {sortedSections.map((section, sectionIndex) => {
                        // Sort blocks by order
                        const sortedBlocks = [...section.blocks].sort((a, b) => a.order - b.order);
                        
                        return (
                            <Box 
                                key={section.id} 
                                className="recruitment-section"
                                sx={{ 
                                    mb: sectionIndex === sortedSections.length - 1 ? 0 : 12,
                                }}
                            >
                                <Grid container spacing={4}>
                                    {sortedBlocks.map(block => renderBlock(block, sectionIndex))}
                                </Grid>
                            </Box>
                        );
                    })}
                </Box>
            </ContentWrapper>
        </section>
    )
}

export default Recruitment

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import getRatingColor from '@/core/utils/getRatingColor'

const RatingBlock = ({ data, name, type }) => {
    const renderData = name !== 'locked' ? data[name] : data
    const sortedData = renderData.sort((a, b) => {
        const getRating = (item) => {
            return type === 'mplus'
                ? item?.mplus || 0
                : item?.pvp || 0
        }
        return getRating(b) - getRating(a)
    })

    const getRatingDisplay = (item) => {
        return type === 'mplus'
            ? Math.round(item?.mplus) || 0
            : item?.pvp || 0
    }

    console.log('sortedData', sortedData)

    return (
        <Box className="contentBlock">
            <Box
                className={`${type}List`}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(4, 1fr)',
                        lg: 'repeat(5, 1fr)',
                    },
                    gap: {
                        xs: 2,
                        sm: 1.5,
                        md: 1,
                    },
                    padding: {
                        xs: 2,
                        sm: 1.5,
                        md: 1,
                    },
                    '& > *': {
                        minWidth: 0,
                    },
                }}
            >
                {sortedData
                    .filter((item) => getRatingDisplay(item) > 0)
                    .map((item) => (
                        <Paper
                            key={item.name}
                            elevation={3}
                            sx={{
                                backgroundColor: '#060d12',
                                padding: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                                maxWidth: {
                                    xs: '100%',
                                    sm: '300px',
                                },
                                margin: '0 auto',
                                overflow: 'hidden',
                                borderRadius: 1,
                            }}
                        >
                            {/* Avatar Image */}
                            <Box
                                className=""
                                sx={{
                                    width: '100%',
                                    borderRadius: 0,
                                    overflow: 'hidden',
                                    marginBottom: 1.5,
                                }}
                            >
                                {item?.media?.assets?.length ? (
                                    <img
                                        src={item?.media?.assets[1]?.value}
                                        alt={item.name}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                        }}
                                    />
                                ) : (
                                    <img
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            opacity: '0.4',
                                            display: 'block',
                                        }}
                                        src={'/images/logo-without-text.png'}
                                        alt={item.name}
                                    />
                                )}
                            </Box>

                            {/* Name and Rating Container */}
                            <Box
                                sx={{
                                    width: '100%',
                                    padding: 1.5,
                                    paddingTop: 0,
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    color={item?.class || '#ffffff'}
                                    sx={{
                                        fontWeight: 'bold',
                                        width: '100%',
                                        textAlign: 'center',
                                        marginBottom: 0.5,
                                        fontSize: '1.2rem',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {item.name}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        width: '100%',
                                        color: (theme) => {
                                            const rating =
                                                getRatingDisplay(item)
                                            return getRatingColor(rating, type)
                                        },
                                    }}
                                >
                                    {getRatingDisplay(item)}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
            </Box>
        </Box>
    )
}

export default RatingBlock

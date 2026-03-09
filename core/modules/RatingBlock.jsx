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
        <div className="contentBlock">
            <div
                className={`${type}List grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-3 md:gap-2 p-4 sm:p-3 md:p-2`}
            >
                {sortedData
                    .filter((item) => getRatingDisplay(item) > 0)
                    .map((item) => (
                        <div
                            key={item.name}
                            className="bg-[#060d12] p-0 flex flex-col items-center w-full h-full max-w-full sm:max-w-[300px] mx-auto overflow-hidden rounded shadow-md"
                        >
                            {/* Avatar Image */}
                            <div className="w-full rounded-none overflow-hidden mb-3">
                                {item?.media?.assets?.length ? (
                                    <img
                                        src={item?.media?.assets[1]?.value}
                                        alt={item.name}
                                        className="w-full h-auto block"
                                    />
                                ) : (
                                    <img
                                        src={'/images/logo-without-text.png'}
                                        alt={item.name}
                                        className="w-full h-auto block opacity-40"
                                    />
                                )}
                            </div>

                            {/* Name and Rating Container */}
                            <div className="w-full p-3 pt-0">
                                <h3
                                    className="font-bold w-full text-center mb-1 text-xl capitalize"
                                    style={{ color: item?.class || '#ffffff' }}
                                >
                                    {item.name}
                                </h3>
                                <p
                                    className="font-bold text-center w-full"
                                    style={{
                                        color: getRatingColor(getRatingDisplay(item), type),
                                    }}
                                >
                                    {getRatingDisplay(item)}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default RatingBlock

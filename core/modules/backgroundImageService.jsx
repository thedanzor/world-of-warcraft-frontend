import './scss/bgMedia.scss'

import Image from 'next/image'

// We want to use the image service also for our background, this way we can.
// We float the content above the image
const BGService = ({ children, image, height, bottom }) => {
    return (
        <div
            className={`bgMediaWrapper ${bottom ? 'bottomAlign' : ''}`}
            style={{ minHeight: height }}
        >
            <Image
                quality={100}
                src={image}
                alt="GUILD NAME background"
                width="2400"
                height={height}
                className="mediaele"
            />
            <div className="bgMediaContent" style={{ minHeight: height }}>
                {children}
            </div>
        </div>
    )
}
export default BGService

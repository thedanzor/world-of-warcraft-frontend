import Image from 'next/image'

import { P, CardTitle } from '@/core/components/typography'

import './scss/activitiesCard.scss'

const Card = ({ title, text, icon }) => {
    return (
        <div className="activitiesCard">
            <Image src={icon} alt={title} />
            <CardTitle> {title} </CardTitle>
            <P> {text} </P>
        </div>
    )
}
export default Card

import './scss/content.scss'

// This component allows us to center content nicely
// and handle some initial responsive support

// React component
const ContentWrapper = ({ children }) => {
    return <div className="width">{children}</div>
}

export default ContentWrapper

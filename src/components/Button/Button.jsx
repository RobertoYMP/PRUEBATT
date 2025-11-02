import './Button.css'

export default function Button({as: Component = "button", to, typeButton, width, height, borderRadius, onClick, content}) {
    return (
        <>
            <Component
                to={to} 
                className={typeButton} 
                style={{width: width, height: height, borderRadius: borderRadius}}
                onClick={onClick}
            >
                {content}
            </Component>
        </>
    )
}

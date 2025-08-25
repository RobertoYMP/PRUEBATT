import './Popup.css'

export function Popup ({width}) {
    return (
        <>
            <div className='popup-container-background'>
                <div className='popup-container' style={{width: width}}>
                    <div className='header-popup'>
                        <div className='popup-close-icon-container'>
                            <div className='popup-close-icon'>
                                X
                            </div>
                        </div>
                        <div className='popup-title' style={{width: width}}>
                            TITULO
                        </div>
                    </div>
                    <div className='popup-content'>
                        
                    </div>
                </div>
            </div>
        </>
    )
}
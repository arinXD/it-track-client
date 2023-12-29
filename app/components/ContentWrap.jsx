import React from 'react'

const ContentWrap = ({ children }) => {
    return (
        <div className='mt-16'> {/* เว้น nav */}
            <div className='py-6 px-8 sm:ml-[240px]'> {/* เว้น side bar */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ContentWrap
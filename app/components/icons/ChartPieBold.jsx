import React from 'react'

const ChartPieBold = ({ size = 24, width, height, ...props }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 24 24"
            width={width || size}
            height={height || size}
            {...props}>
            <path d="M12.3,10.178a4.989,4.989,0,0,0,.363.671L23.525,8.688A11.962,11.962,0,0,0,8.216.621Z" /><path d="M12.631,13.742a7.008,7.008,0,0,1-2.169-2.773L6.377,1.406A11.991,11.991,0,1,0,20.889,20.032Z" /><path d="M14.365,12.549l7.741,5.9A11.916,11.916,0,0,0,24,12a12.055,12.055,0,0,0-.081-1.351Z" />
        </svg>

    )
}

export default ChartPieBold
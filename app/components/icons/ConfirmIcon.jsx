import React from 'react'

const ConfirmIcon = ({ size = 24, height, width, ...props }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            width={size || width}
            height={size || height}
            {...props}
            viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <path stroke-dasharray="14" stroke-dashoffset="14" d="M8 12L11 15L16 10">
                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="14;0" />
                </path>
            </g>
        </svg>
    )
}

export default ConfirmIcon
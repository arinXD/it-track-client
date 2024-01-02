import React from 'react'
export default function PlusIcon({ size = 24, width, height, ...props }) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            >
                <path d="M6 12h12" />
                <path d="M12 18V6" />
            </g>
        </svg>
    );
}
// const PlusIcon = ({ className }) => {
//     return (
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
//         </svg>
//     )
// }

// export default PlusIcon
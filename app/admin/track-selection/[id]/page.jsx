import React from 'react'

const page = ({ params }) => {
    const { id } = params
    return (
        <div>page {id}</div>
    )
}

export default page
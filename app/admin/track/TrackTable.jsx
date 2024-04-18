"use client"
import { Button } from '@nextui-org/react'
import React from 'react'

const TrackTable = ({ tracks }) => {
    return (
        <div>
            <h1>
                ข้อมูลแทรค
                <Button
                    radius='sm'
                    size='sm'
                >
                    เพิ่ม
                </Button>
            </h1>
            <ul>
                {tracks.length > 0 ? tracks.map((track, index) => (
                    <li key={index}>{`${index + 1})`} {track.title_en}</li>
                )) :
                    <li>ไม่มีข้อมูลแทรค</li>}
            </ul>
        </div>
    )
}

export default TrackTable
"use client"
import { Spinner } from "@nextui-org/react";
import { useState } from "react";

const TrackSubject = () => {
    const [fetching, setFetching] = useState(true);
    const [subjects, setSubjects] = useState([]);
    return (
        <div>
            <div className='bg-gray-100 border-gray-200 border-1 p-2 flex flex-row justify-between items-end rounded-md mb-4'>
                <p>รายวิชาประจำแทร็ก</p>
            </div>
            {
                fetching ?
                    <div className='w-full flex justify-center my-6'>
                        <Spinner label="กำลังโหลด..." color="primary" />
                    </div> :
                    <div>

                    </div>
            }
        </div>
    )
}

export default TrackSubject
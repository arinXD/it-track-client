"use client"

import { getOptions } from "@/app/components/serverAction/TokenAction";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const TeacherTrack = ({ track }) => {
    const [fetching, setFetching] = useState(true);
    const [teachers, setTeachers] = useState([]);

    const getTeachers = useCallback(async () => {
        setFetching(true)
        const URL = `/api/teachers/tracks/${track}`
        const option = await getOptions(URL, "GET")
        try {
            const res = await axios(option)
            const teachers = res.data.data
            setTeachers(teachers)
        } catch (error) {
            setTeachers([])
        } finally {
            setFetching(false)
        }

    }, [])
    useEffect(() => {
        getTeachers()
    }, [])

    return (
        <div>
            <div className='bg-gray-100 border-gray-200 border-1 p-2 flex flex-row justify-between items-end rounded-md mb-4'>
                <p>คณาจารย์ประจำแทรค</p>
            </div>
            {
                fetching ?
                    <div className='w-full flex justify-center my-6'>
                        <Spinner label="กำลังโหลด..." color="primary" />
                    </div> :
                    <div>
                        {
                            JSON.stringify(teachers)
                        }
                    </div>
            }
        </div>
    )
}

export default TeacherTrack
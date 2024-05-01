"use client"
import { DeleteIcon2, PlusIcon } from "@/app/components/icons";
import { getOptions } from "@/app/components/serverAction/TokenAction";
import { Button, Spinner } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const TrackSubject = ({ track }) => {
    const [fetching, setFetching] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [disableSelectDelete, setDisableSelectDelete] = useState(true);

    const getSubjects = useCallback(async () => {
        setFetching(true)
        const URL = `/api/subjects/tracks/${track}`
        const option = await getOptions(URL, "GET")
        try {
            const res = await axios(option)
            const teachers = res.data.data
            setSubjects(teachers)
        } catch (error) {
            setSubjects([])
        } finally {
            setFetching(false)
        }

    }, [])

    const handleSelectDelete = useCallback(() => {

    }, [])

    useEffect(() => {
        getSubjects()
    }, [])

    return (
        <div>
            <div className='bg-gray-100 border-gray-200 border-1 p-2 flex flex-row justify-between items-end rounded-md mb-4'>
                <p>รายวิชาประจำแทร็ก</p>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="bg-gray-300"
                        radius="sm"
                        color="default"
                        startContent={<PlusIcon className="w-5 h-5" />}>
                        เพิ่มวิชา
                    </Button>
                    <Button
                        radius="sm"
                        size="sm"
                        isDisabled={disableSelectDelete}
                        onPress={handleSelectDelete}
                        color="default"
                        className="bg-gray-300"
                        startContent={<DeleteIcon2 className="w-5 h-5" />}>
                        ลบ
                    </Button>
                </div>
            </div>
            {
                fetching ?
                    <div className='w-full flex justify-center my-6'>
                        <Spinner label="กำลังโหลด..." color="primary" />
                    </div> :
                    <div>
                        {
                            JSON.stringify(subjects)
                        }
                    </div>
            }
        </div>
    )
}

export default TrackSubject
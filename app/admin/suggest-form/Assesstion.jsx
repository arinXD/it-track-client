"use client"
import { getOptions } from "@/app/components/serverAction/TokenAction";
import axios from "axios";
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdOutlineInventory2 } from "react-icons/md";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Spinner, Chip, Select, SelectItem } from "@nextui-org/react"
import { Checkbox, Empty, message } from 'antd';
import { DeleteIcon, PlusIcon, SearchIcon } from "@/app/components/icons";
import { SELECT_STYLE, thinInputClass } from "@/src/util/ComponentClass";
import { FaRegTrashAlt } from "react-icons/fa";

const Assesstion = ({ prev, next, formStyle, tracks, formId, assesstion, setAssesstion }) => {
    const questionRefs = useRef([]);
    const [filterValue, setFilterValue] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [fetching, setFetching] = useState(false);
    const [defaultQuestionBank, setDefaultQuestionBank] = useState([]);
    const [questionsBank, setQuestionsBank] = useState([]);
    const [searchTrack, setSearchTrack] = useState("all");
    const [searchValue, setSearchValue] = useState("");

    const getQuestions = useCallback(async (formId) => {
        if (!formId) {
            try {
                setFetching(true)
                const option = await getOptions(`/api/assessments`, "get")
                const res = await axios(option)
                const allQuestions = res.data.data
                setQuestionsBank(allQuestions)
                setDefaultQuestionBank(allQuestions)
            } catch (error) {
                setQuestionsBank([])
                setDefaultQuestionBank([])
            } finally {
                setFetching(false)
            }
            return
        }
        try {
            setFetching(true)
            const option1 = await getOptions(`/api/assessments/in-form/${formId}`, "get")
            const option2 = await getOptions(`/api/assessments/not-in-form/${formId}`, "get")
            const option3 = await getOptions(`/api/assessments`, "get")
            const [res1, res2, res3] = await Promise.all([axios(option1), axios(option2), axios(option3)]);
            const questionsInForm = res1.data.data
            const questionsNotInForm = res2.data.data
            const allQuestions = res3.data.data
            setAssesstion(questionsInForm)
            setQuestionsBank(questionsNotInForm)
            setDefaultQuestionBank(allQuestions)
        } catch (error) {
            setAssesstion([])
            setQuestionsBank([])
            setDefaultQuestionBank([])
        } finally {
            setFetching(false)
        }
    }, [])

    const updateAssessmentsInventory = useCallback(async (formId) => {
        if (!formId) {
            try {
                const option = await getOptions(`/api/assessments`, "get")
                const res = await axios(option)
                const allQuestions = res.data.data
                setQuestionsBank(allQuestions)
            } catch (error) {
                setQuestionsBank([])
            }
            return
        }
        try {
            const option = await getOptions(`/api/assessments/not-in-form/${formId}`, "get")
            const questionsNotInForm = (await axios(option)).data.data
            setQuestionsBank(questionsNotInForm)
        } catch (error) {
            setQuestionsBank([])
        }
    }, [])


    useEffect(() => {
        getQuestions(formId)
    }, [formId])

    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value)
        } else {
            setFilterValue("")
        }
    }, [])

    const filteredItems = useMemo(() => {
        let filterData = [...questionsBank];

        if (searchTrack !== "all") {
            filterData = filterData.filter((q) =>
                q.track.toLowerCase().includes(searchTrack.toLowerCase())
            );
        }

        if (filterValue) {
            filterData = filterData.filter((q) =>
                q.question.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filterData;
    }, [filterValue, questionsBank, searchTrack]);

    const createQuestion = useCallback(() => {
        setAssesstion((prevQuestions) => {
            const id = prevQuestions.length + 1
            const newId = `new${id}`

            const newQuestion = {
                id: newId,
                question: `คำถามที่ ${id}`,
                isEnable: true,
                track: tracks[0]?.track,
                desc: null
            }

            const updatedQuestions = [newQuestion, ...prevQuestions,]
            questionRefs.current = updatedQuestions.map((_, i) => questionRefs.current[i] || createRef())

            return updatedQuestions
        })
    }, [tracks])

    const removeQuestion = useCallback((questionIndex, qid) => {
        setAssesstion((prevQuestions) => {
            questionRefs.current = prevQuestions
                .filter((_, index) => index !== questionIndex)
                .map((_, i) => questionRefs.current[i])

            return prevQuestions.filter((_, index) => index !== questionIndex)
        })
        const filterQID = defaultQuestionBank.filter(q => q.id === qid)
        if (filterQID.length > 0) {
            setQuestionsBank(prev => {
                return [
                    ...prev,
                    ...filterQID
                ]
            })
        }
    }, [defaultQuestionBank])

    const [selectedQuestions, setSelectedQuestions] = useState([])

    const selectQuestion = useCallback((e, id) => {
        const isChecked = e.target.checked
        setSelectedQuestions((prev) => {
            if (isChecked) {
                if (!prev.includes(id)) {
                    return [...prev, id]
                }
            } else {
                return prev.filter((qId) => qId !== id)
            }
            return prev
        })
    }, [])

    const addToQuestion = useCallback(() => {
        setQuestionsBank((prevQuestionsBank) => {
            let questionsToAdd = selectedQuestions.map((id) =>
                prevQuestionsBank.find(q => q.id === id)
            ).filter(Boolean)
            console.log(questionsToAdd);
            questionsToAdd = questionsToAdd.map(q => ({ ...q, isEnable: true }))

            if (questionsToAdd.length > 0) {
                setAssesstion((prevQuestions) => [...prevQuestions, ...questionsToAdd])

                const remainingQuestionsBank = prevQuestionsBank.filter(q => !selectedQuestions.includes(q.id))
                setSelectedQuestions([])

                return remainingQuestionsBank
            }
            return prevQuestionsBank
        })
        onClose()
    }, [selectedQuestions])

    const closeForm = useCallback(() => {
        setSelectedQuestions([])
        onClose()
    }, [])

    const [messageApi, contextHolder] = message.useMessage();
    const deleteQuestion = useCallback(async (aid) => {
        if (confirm("ต้องการลบคำถามหรือไม่ ?")) {
            try {
                messageApi.open({
                    key: 'updatable',
                    type: 'loading',
                    content: 'กำลังลบคำถาม',
                });
                const option = await getOptions(`/api/assessments/${aid}`, "delete")
                const { message: msg } = (await axios(option)).data

                await updateAssessmentsInventory(formId)

                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: msg,
                    duration: 2,
                });
            } catch (error) {
                message.warning("ไม่สามารถลบคำถามความชอบได้")
            }
        }
    }, [formId])

    const handleSearch = useCallback((value) => {
        setSearchValue(value);
    }, [])

    const trackItems = useMemo(() => ["all", ...tracks.map(t => t.track)], [tracks])
    const [trackFilter, setTrackFilter] = useState('all');

    const filteredAssessments = useMemo(() => {
        return assesstion.filter((q) => {
            const matchesSearch = q.question.toLowerCase().includes(searchValue.toLowerCase());
            const matchesTrack = trackFilter === 'all' || q.track === trackFilter;
            return matchesSearch && matchesTrack;
        });
    }, [assesstion, searchValue, trackFilter]);

    const handleTrackFilter = useCallback((value) => {
        setTrackFilter(value);
    }, [])

    return (
        <>
            <section style={formStyle}>
                {contextHolder}
                <Modal
                    size={"5xl"}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex items-end gap-1">
                                    <div className="w-full flex flex-col gap-1">
                                        <p className="mb-1">คลังคำถามความชอบ</p>
                                        <Input
                                            isClearable
                                            className="w-full h-fit rounded-[5px]"
                                            placeholder="ค้นหาคำถาม"
                                            size="sm"
                                            classNames={thinInputClass}
                                            startContent={<SearchIcon />}
                                            value={filterValue}
                                            onValueChange={onSearchChange}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] mb-0 text-gray-800 h-fit">แทร็ก</p>
                                        <select
                                            className="border-1 !text-xs !font-normal border-gray-200 rounded-[8px] p-2"
                                            style={{
                                                ...SELECT_STYLE,
                                                height: "32px",
                                                backgroundPositionY: "3px",
                                            }}
                                            onChange={(e) => setSearchTrack(e.target.value)}
                                            value={searchTrack}>
                                            <option value="all">ทั้งหมด</option>
                                            {tracks?.map((track, tIndex) => (
                                                <option key={tIndex} value={track.track}>{track.track}</option>
                                            ))}
                                        </select>
                                    </div>
                                </ModalHeader>
                                <ModalBody className="my-0 border-y py-0 px-6">
                                    <section className="!h-[350px] overflow-y-auto flex flex-col gap-2">
                                        {
                                            filteredItems?.length > 0 ?
                                                filteredItems.map((q, index) => (
                                                    <div key={index} className="first-of-type:mt-4 last-of-type:mb-4 my-2">
                                                        <Checkbox
                                                            onChange={(e) => selectQuestion(e, q.id)}
                                                            key={index}
                                                            className="w-full ant-qs-ck ant-qs-ck-assessments cursor-pointer flex items-center gap-2 border p-4 rounded-[5px]"
                                                            name={`questionBank[]`}
                                                        >
                                                            <p className="w-[80%] whitespace-break-spaces mb-0 text-sm">{q.question}</p>
                                                            <div className="w-[20%] flex flex-row justify-end items-center gap-4">
                                                                <Chip
                                                                    className="!p-1 !text-xs"
                                                                    color={q?.track?.split(" ")[0]?.toLowerCase() === "bit" ? "secondary" : q?.track?.split(" ")[0]?.toLowerCase() === "network" ? "primary" : "success"} variant="flat">
                                                                    {q?.track?.split(" ")[0]}
                                                                </Chip>
                                                                <Button
                                                                    onClick={() => deleteQuestion(q.id)}
                                                                    isIconOnly size="sm" className="bg-red-100 text-red-500">
                                                                    <DeleteIcon className={"w-4 h-4"} />
                                                                </Button>
                                                            </div>
                                                        </Checkbox>
                                                    </div>
                                                ))
                                                :
                                                <Empty
                                                    className='mt-8'
                                                    description={
                                                        <span className='text-gray-300'>ไม่มีข้อมูล</span>
                                                    }
                                                />
                                        }

                                    </section>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="default"
                                        variant="light"
                                        className="rounded-[5px]"
                                        onPress={closeForm}>
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        onClick={addToQuestion}
                                        color="primary"
                                        className="rounded-[5px]">
                                        เพิ่ม
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                {
                    fetching ?
                        <div className='w-full flex justify-center my-6'>
                            <Spinner label="กำลังโหลด..." color="primary" />
                        </div>
                        :
                        <>
                            <h2 className="text-black mb-4">คำถามความชอบภายในแบบฟอร์ม ({assesstion?.length} ข้อ)</h2>
                            <div className="w-full grid grid-cols-8 gap-4">
                                <Input
                                    type="text"
                                    placeholder="ค้นหาคำถาม"
                                    value={searchValue}
                                    classNames={{
                                        ...thinInputClass,
                                        innerWrapper: [
                                            "bg-white",
                                        ],
                                    }}
                                    onValueChange={handleSearch}
                                    onClear={() => handleSearch("")}
                                    className="col-span-8 md:col-span-4 !w-full !text-xs"
                                    startContent={<SearchIcon />}
                                />

                                <Select
                                    classNames={{
                                        label: "!text-xs",
                                        trigger: "border-1 h-10 !text-xs bg-white",
                                    }}
                                    variant="bordered"
                                    placeholder="เลือกแทร็ก"
                                    className="col-span-8 md:col-span-2 w-full"
                                    selectedKeys={[trackFilter]}
                                    onChange={(e) => handleTrackFilter(e.target.value)}
                                >
                                    {trackItems.map(track => (
                                        <SelectItem key={track} value={track}>
                                            {track === 'all' ? 'ทั้งหมด' : track}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <div className="col-span-8 md:col-span-2 grid grid-cols-4 max-md:place-items-center">
                                    <Button
                                        isIconOnly
                                        radius="full"
                                        className={`col-span-1 text-blue-700 bg-white border border-blue-700 hover:bg-gray-200 transition-all`}
                                        onClick={createQuestion}
                                        aria-label="create">
                                        <PlusIcon />
                                    </Button>
                                    <Button
                                        className={`col-span-3 w-full rounded-[5px] text-blue-700 bg-white border border-blue-700 hover:bg-gray-200 transition-all`}
                                        startContent={<MdOutlineInventory2 />}
                                        onClick={onOpen}
                                    >
                                        คลังคำถาม
                                    </Button>
                                </div>
                            </div>
                            <div id="questionsWrap">
                                {
                                    filteredAssessments?.length > 0 ?
                                        <div className="flex flex-col gap-4 mt-4">
                                            {
                                                filteredAssessments.map((q, index) => (
                                                    <div
                                                        key={index}
                                                        ref={questionRefs.current[index]}
                                                        className="w-full bg-white border-1 p-4 flex flex-col rounded-lg shadow-md justify-between items-center max-md:gap-2 max-md:flex-col">
                                                        <div className="w-full flex items-center justify-between gap-4 max-md:flex-col-reverse">
                                                            <input readOnly type="hidden" name="assesstion_ID[]" defaultValue={q.id} />
                                                            <input
                                                                className="text-black p-2 border-b-black border-b bg-blue-50 w-full md:w-[80%] outline-none focus:border-b-blue-500 focus:border-b-2"
                                                                type="text"
                                                                name={`assesstion_title_${q.id}`}
                                                                value={q.question}
                                                                onChange={(e) => {
                                                                    const updatedAssesstion = [...assesstion];
                                                                    updatedAssesstion[index].question = e.target.value;
                                                                    setAssesstion(updatedAssesstion);
                                                                }}
                                                            />
                                                            <select
                                                                className="border-1 border-gray-200 rounded-[5px] p-2  max-md:w-full"
                                                                name={`trackOf_${q.id}`}
                                                                style={{
                                                                    ...SELECT_STYLE
                                                                }}
                                                                onChange={(e) => {
                                                                    const updatedAssesstion = [...assesstion];
                                                                    updatedAssesstion[index].track = e.target.value;
                                                                    setAssesstion(updatedAssesstion);
                                                                }}
                                                                value={q.track}>
                                                                {tracks?.map((track, tIndex) => (
                                                                    <option key={tIndex} value={track.track}>{track.track}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="flex justify-between items-end w-full mt-4">
                                                            <div className="flex flex-col w-full">
                                                                <label className="text-xs">คำอธิบาย (optional)</label>
                                                                <input
                                                                    className="text-black text-sm w-full p-2 border-b-black border-b bg-white outline-none focus:border-b-blue-500 focus:border-b-2"
                                                                    type="text"
                                                                    placeholder="เพิ่มคำอธิบาย"
                                                                    name={`assesstion_desc_${q.id}`}
                                                                    value={q.desc}
                                                                    onChange={(e) => {
                                                                        const updatedAssesstion = [...assesstion];
                                                                        updatedAssesstion[index].desc = e.target.value;
                                                                        setAssesstion(updatedAssesstion);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="w-full flex justify-end items-center gap-2">
                                                                <div
                                                                    onClick={(e) => {
                                                                        const updatedAssesstion = [...assesstion];
                                                                        updatedAssesstion[index].isEnable = !updatedAssesstion[index].isEnable
                                                                        setAssesstion(updatedAssesstion);
                                                                    }}
                                                                    className="flex gap-2 items-center cursor-pointer select-none">
                                                                    <input
                                                                        checked={q.isEnable}
                                                                        type="checkbox"
                                                                        className="w-4 h-4"
                                                                        name={`assesstion_enable_${q.id}`}
                                                                        onChange={(e) => {
                                                                            const updatedAssesstion = [...assesstion];
                                                                            updatedAssesstion[index].isEnable = e.target.checked;
                                                                            setAssesstion(updatedAssesstion);
                                                                        }}
                                                                    />
                                                                    <span className="text-sm">ใช้งาน</span>
                                                                </div>
                                                                <Button
                                                                    isIconOnly
                                                                    variant="light"
                                                                    radius="full"
                                                                    color="default"
                                                                    className="p-2"
                                                                    onClick={() => removeQuestion(index, q.id)}
                                                                    aria-label="remove">
                                                                    <FaRegTrashAlt className="w-5 h-5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        :
                                        <Empty
                                            className='my-6'
                                            description={
                                                <span className='text-gray-300'>ไม่มีข้อมูล</span>
                                            }
                                        />
                                }
                            </div>
                        </>
                }
            </section>
            <div className="my-[24px] flex gap-2 justify-end">
                <Button
                    type="button"
                    variant="bordered"
                    className="rounded-[5px] border-white text-black border-1 hover:border-blue-500 hover:text-blue-500"
                    onClick={() => prev()}
                >
                    ย้อนกลับ
                </Button>
                <Button
                    type="button"
                    color="primary"
                    className="rounded-[5px]"
                    onClick={() => next()}>
                    ต่อไป
                </Button>
            </div>
        </>
    )
}

export default Assesstion
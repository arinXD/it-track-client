"use client"
import { useMemo, useState } from "react";
import { Steps, message } from 'antd';
import "./stepperStyle.css"

const SuggestionForm = ({ form }) => {
    const [current, setCurrent] = useState(0)
    const steps = useMemo(() => ([
        {
            title: 'แบบทดสอบ',
        },
        {
            title: 'แบบประเมิน',
        },
        {
            title: 'อาชีพ',
        },
        {
            title: 'สำเร็จ',
        },
    ]), [])

    const items = useMemo(() => steps.map((item) => ({
        key: item.title,
        title: item.title,
        description: item.description,
    })), [])

    return (
        <div className={`my-8 px-8`}>
            {
                Object.keys(form).length === 0 ?
                    <section className='text-center font-bold text-lg my-28'>
                        Coming soon!
                    </section>
                    :
                    <section>
                        <Steps
                            className="my-8"
                            current={current}
                            onChange={setCurrent}
                            items={items} />
                        {JSON.stringify(form)}
                    </section>
            }
        </div>
    )
}

export default SuggestionForm

// data.map((question, index) => (
//     <div key={index} id={`question${index}`} className='mx-auto max-w-7xl my-12'>
//         <p className='text-center text-4xl text-gray-600'>{question.question}</p>
//         <div className='flex justify-center items-center gap-16 text-2xl'>
//             <h2 className='text-green-800'>ฉันเห็นด้วย</h2>
//             <div className='flex justify-center items-center gap-12 my-20'>
//                 <Link href={`#question${index + 1}`}>
//                     <label for="default-radio-1" className="flex justify-center items-center cursor-pointer">
//                         <span className="w-16 h-16 flex items-center justify-center border border-gray-300 rounded-full">
//                             <input id="default-radio-1" type="radio" value="" name="default-radio" className="hidden" />
//                             <span className="block rounded-full transition duration-400 hover:bg-green-800 w-16 h-16"></span>
//                         </span>
//                     </label>
//                 </Link>
//                 <Link href={`#question${index + 1}`}>
//                     <label for="default-radio-1" className="flex justify-center items-center cursor-pointer">
//                         <span className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-full">
//                             <input id="default-radio-1" type="radio" value="" name="default-radio" className="hidden" />
//                             <span className="block rounded-full transition duration-400 hover:bg-green-800 w-14 h-14"></span>
//                         </span>
//                     </label>
//                 </Link>
//                 <Link href={`#question${index + 1}`}>
//                     <label for="default-radio-1" className="flex justify-center items-center cursor-pointer">
//                         <span className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full">
//                             <input id="default-radio-1" type="radio" value="" name="default-radio" className="hidden" />
//                             <span className="block rounded-full transition duration-400 hover:bg-gray-600 w-10 h-10"></span>
//                         </span>
//                     </label>
//                 </Link>
//                 <Link href={`#question${index + 1}`}>
//                     <label for="default-radio-1" className="flex justify-center items-center cursor-pointer">
//                         <span className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-full">
//                             <input id="default-radio-1" type="radio" value="" name="default-radio" className="hidden" />
//                             <span className="block rounded-full transition duration-400 hover:bg-purple-900 w-14 h-14"></span>
//                         </span>
//                     </label>
//                 </Link>
//                 <Link href={`#question${index + 1}`}>
//                     <label for="default-radio-1" className="flex justify-center items-center cursor-pointer">
//                         <span className="w-16 h-16 flex items-center justify-center border border-gray-300 rounded-full">
//                             <input id="default-radio-1" type="radio" value="" name="default-radio" className="hidden" />
//                             <span className="block rounded-full transition duration-400 hover:bg-purple-900 w-16 h-16"></span>
//                         </span>
//                     </label>
//                 </Link>
//             </div>
//             <h2 className='text-purple-800'>ฉันไม่เห็นด้วย</h2>
//         </div>
//         <hr className='border-1 border-gray-300' />
//     </div>
// ))
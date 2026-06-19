"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { FaTools, FaEnvelope, FaExternalLinkAlt, FaClock } from 'react-icons/fa'
import { Button } from '@nextui-org/react'

const Maintenance = () => {
    // URL support/feedback from env or default
    const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_SUGGESTION_URL || "https://forms.gle/q2zNnbxfDXxv1R4d6"

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden px-4 py-8">
            {/* Glowing background mesh elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

            {/* Fine decorative grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-blue-500/5 text-center flex flex-col items-center"
            >
                {/* Brand Header */}
                <div className="mb-8">
                    <span className="text-xs font-semibold tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                        SYSTEM UPGRADES IN PROGRESS
                    </span>
                </div>

                {/* Animated SVG Maintenance Illustration */}
                <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                    {/* Pulsing server/database background */}
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full filter blur-xl animate-pulse" />

                    <svg className="w-40 h-40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Server Rack Box */}
                        <motion.rect
                            x="50" y="60" width="100" height="90" rx="10"
                            stroke="url(#serverGradient)" strokeWidth="4"
                            fill="#0b0f19" fillOpacity="0.8"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ repeat: Infinity, duration: 4, repeatType: "reverse", ease: "easeInOut" }}
                        />

                        {/* Server Lines / Slots */}
                        <line x1="65" y1="80" x2="135" y2="80" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                        <line x1="65" y1="105" x2="135" y2="105" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                        <line x1="65" y1="130" x2="135" y2="130" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />

                        {/* Blinking server lights */}
                        <circle cx="70" cy="80" r="3" className="fill-emerald-500 animate-ping" style={{ animationDuration: '1.5s' }} />
                        <circle cx="70" cy="80" r="3" className="fill-emerald-400" />

                        <circle cx="70" cy="105" r="3" className="fill-blue-500 animate-ping" style={{ animationDuration: '2s' }} />
                        <circle cx="70" cy="105" r="3" className="fill-blue-400" />

                        <circle cx="70" cy="130" r="3" className="fill-indigo-500 animate-ping" style={{ animationDuration: '2.5s' }} />
                        <circle cx="70" cy="130" r="3" className="fill-indigo-400" />

                        {/* Processing data flows inside servers */}
                        <motion.line
                            x1="85" y1="80" x2="120" y2="80"
                            stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"
                            initial={{ strokeDasharray: "5, 20", strokeDashoffset: 0 }}
                            animate={{ strokeDashoffset: -25 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                        <motion.line
                            x1="85" y1="105" x2="110" y2="105"
                            stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"
                            initial={{ strokeDasharray: "5, 15", strokeDashoffset: 0 }}
                            animate={{ strokeDashoffset: -20 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                        <motion.line
                            x1="85" y1="130" x2="125" y2="130"
                            stroke="#10b981" strokeWidth="3" strokeLinecap="round"
                            initial={{ strokeDasharray: "8, 12", strokeDashoffset: 0 }}
                            animate={{ strokeDashoffset: -20 }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                        />

                        {/* Large Gear top right */}
                        <motion.g
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                            style={{ transformOrigin: '150px 50px' }}
                        >
                            <circle cx="150" cy="50" r="16" stroke="#3b82f6" strokeWidth="3" fill="#0f172a" />
                            {[...Array(8)].map((_, i) => (
                                <rect
                                    key={i}
                                    x="147" y="28" width="6" height="8" rx="1.5"
                                    fill="#3b82f6"
                                    style={{ transform: `rotate(${i * 45}deg)`, transformOrigin: '150px 50px' }}
                                />
                            ))}
                            <circle cx="150" cy="50" r="6" fill="#090d16" />
                        </motion.g>

                        {/* Small Gear bottom left */}
                        <motion.g
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            style={{ transformOrigin: '40px 140px' }}
                        >
                            <circle cx="40" cy="140" r="12" stroke="#8b5cf6" strokeWidth="2.5" fill="#0f172a" />
                            {[...Array(6)].map((_, i) => (
                                <rect
                                    key={i}
                                    x="138" y="124" width="4" height="6" rx="1"
                                    fill="#8b5cf6"
                                    style={{ transform: `rotate(${i * 60}deg) translate(-100px, 12px)`, transformOrigin: '40px 140px' }}
                                />
                            ))}
                            <circle cx="40" cy="140" r="4" fill="#090d16" />
                        </motion.g>

                        {/* Gradients */}
                        <defs>
                            <linearGradient id="serverGradient" x1="50" y1="60" x2="150" y2="150" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="50%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Floating Tool Badges */}
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute top-2 right-2 bg-indigo-500/10 text-indigo-400 p-2.5 rounded-2xl border border-indigo-500/20"
                    >
                        <FaTools className="w-4 h-4 animate-pulse" />
                    </motion.div>
                </div>

                {/* Maintenance Text content */}
                <div className="space-y-4 mb-6">
                    <h1 className="text-3xl sm:text-4xl font-semibold leading-relaxed text-white">
                        ขออภัยในความไม่สะดวก
                    </h1>
                    <h2 className="text-2xl sm:text-3xl font-semibold leading-relaxed text-blue-400">
                        ระบบอยู่ระหว่างการปรับปรุงชั่วคราว
                    </h2>
                </div>

                <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg mb-8">
                    ขณะนี้กำลังปรับปรุงระบบและอัปเกรดฐานข้อมูลเพื่อเพิ่มความเสถียรและประสิทธิภาพในการทำงานให้ดียิ่งขึ้น ขออภัยในการบริการที่ไม่สะดวกในระหว่างการดำเนินงานนี้
                </p>

                {/* Detail Box */}
                <div className="w-full max-w-md bg-slate-950/50 border border-slate-800 rounded-2xl p-5 mb-8 text-left space-y-3.5">
                    <div className="flex items-start gap-3">
                        <FaClock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">ระยะเวลาปรับปรุงโดยประมาณ</h4>
                            <p className="text-sm text-slate-400 mt-0.5">1 - 3 วัน</p>
                        </div>
                    </div>
                    <div className="h-px bg-slate-800" />
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mt-1.5 shrink-0" />
                        <div>
                            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">สถานะการเซ็ตอัป</h4>
                            <p className="text-sm text-emerald-400 font-medium mt-0.5">กำลังอัปเกรดระบบหลังบ้านและฐานข้อมูล</p>
                        </div>
                    </div>
                </div>

                {/* Footer Brand */}
                <div className="mt-12 text-xs text-slate-500 flex flex-col items-center gap-1.5">
                    <p>© {new Date().getFullYear()} College of Computing, Khon Kaen University</p>
                </div>
            </motion.div>
        </div>
    )
}

export default Maintenance

"use client"
import { useEffect } from 'react';
import SidebarDrawer from './components/SidebarDrawer'
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
const HomePage = () => {
     return (
          <>
               <SidebarDrawer />
               <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
                    {/* Hero Section */}
                    <section className="relative h-screen flex items-center justify-center overflow-hidden">
                         <div className="absolute inset-0 z-0">
                              <img src="/image/bg/bg1.jpeg" alt="Hero Background" className="w-full h-full object-cover" />
                         </div>
                         <div className="relative z-10 text-center">
                              <h1 className="text-5xl font-bold text-white mb-4">Discover Your Perfect Career Path</h1>
                              <p className="text-xl text-white mb-8">Find the job that suits you best</p>
                              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">
                                   Get Started
                              </button>
                         </div>
                    </section>

                    {/* Job Discovery Section */}
                    <div
                         className="py-20 px-4 md:px-8 lg:px-16"
                    >
                         <div className="max-w-4xl mx-auto">
                              <h2 className="text-3xl font-bold text-center mb-8">Discover Your Ideal Job</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <div className="bg-white p-6 rounded-lg shadow-md">
                                        <img src="/image/bg/bg2.jpeg" alt="Job Discovery" className="w-full h-48 object-cover rounded-md mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">Personalized Job Matching</h3>
                                        <p className="text-gray-600">Our advanced algorithm analyzes your skills, interests, and personality to find the perfect job match for you.</p>
                                   </div>
                                   <div className="bg-white p-6 rounded-lg shadow-md">
                                        <img src="/image/bg/bg12.jpeg" alt="Career Guidance" className="w-full h-48 object-cover rounded-md mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">Expert Career Guidance</h3>
                                        <p className="text-gray-600">Get valuable insights and advice from industry professionals to help you make informed career decisions.</p>
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Track Selection Section */}
                    <div
                         className="py-20 px-4 md:px-8 lg:px-16 bg-gray-100"
                    >
                         <div className="max-w-4xl mx-auto">
                              <h2 className="text-3xl font-bold text-center mb-8">Track Your Career Path</h2>
                              <div className="bg-white p-6 rounded-lg shadow-md">
                                   <img src="/image/bg/bg9.jpeg" alt="Track Selection" className="w-full h-64 object-cover rounded-md mb-4" />
                                   <h3 className="text-xl font-semibold mb-2">Personalized Career Tracking</h3>
                                   <p className="text-gray-600">Monitor your progress and stay on top of your chosen career path with our intuitive tracking system.</p>
                              </div>
                         </div>
                    </div>

                    {/* Graduation Verification Section */}
                    <div
                         className="py-20 px-4 md:px-8 lg:px-16"
                    >
                         <div className="max-w-4xl mx-auto">
                              <h2 className="text-3xl font-bold text-center mb-8">Verify Your Graduation</h2>
                              <div className="bg-white p-6 rounded-lg shadow-md">
                                   <img src="/image/bg/bg11.jpeg" alt="Graduation Verification" className="w-full h-64 object-cover rounded-md mb-4" />
                                   <h3 className="text-xl font-semibold mb-2">Secure Graduation Verification</h3>
                                   <p className="text-gray-600">Easily verify your graduation status and showcase your achievements to potential employers.</p>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default HomePage
"use client"
import { useState } from 'react'
import SidebarDrawer from './components/SidebarDrawer'

const tracks = [
     { name: 'BIT', icon: '💼', description: 'Business Information Technology' },
     { name: 'Web and Mobile', icon: '📱', description: 'Web and Mobile Development' },
     { name: 'Network', icon: '🌐', description: 'Network Engineering' },
]

const HomePage = () => {
     const [isMenuOpen, setIsMenuOpen] = useState(false)

     return (
          <div className="min-h-screen bg-gray-50 ">
               <SidebarDrawer
               />
               {/* Hero Section */}
               <section className="bg-gradient-to-r pt-16 from-blue-600 to-indigo-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                         <div className="text-center">
                              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Shape Your Future in Tech</h1>
                              <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto">Discover your ideal track, assess your fit, and verify your graduation status</p>
                              <div className="mt-10 space-x-4">
                                   <a href="#tracks" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition duration-150 ease-in-out">
                                        Explore Tracks
                                   </a>
                                   <a href="#assessment" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 transition duration-150 ease-in-out">
                                        Start Assessment
                                   </a>
                              </div>
                         </div>
                    </div>
               </section>

               {/* Track Selection Section */}
               <section id="tracks" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center">
                              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Choose Your Track</h2>
                              <p className="mt-4 text-xl text-gray-600">Explore our specialized tracks and find the perfect fit for your career goals</p>
                         </div>
                         <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                              {tracks.map((track, index) => (
                                   <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
                                        <div className="p-6">
                                             <div className="text-4xl mb-4">{track.icon}</div>
                                             <h3 className="text-2xl font-semibold text-gray-900">{track.name}</h3>
                                             <p className="mt-2 text-gray-600">{track.description}</p>
                                             <a href="#" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
                                                  Learn more
                                                  <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                       <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                  </svg>
                                             </a>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>


               {/* Track Assessment Section */}
               <section id="assessment" className="bg-gray-100 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="bg-white rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
                              <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
                                   <div className="lg:self-center">
                                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                             <span className="block">Find Your Ideal Track</span>
                                        </h2>
                                        <p className="mt-4 text-lg leading-6 text-gray-600">
                                             Take our assessment to discover which track aligns best with your skills and interests.
                                        </p>
                                        <a href="#" className="mt-8 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                             Start Assessment
                                        </a>
                                   </div>
                              </div>
                              <div className="relative -mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
                                   <img className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20" src="/image/designer.jpg" alt="Track Assessment" />
                              </div>
                         </div>
                    </div>
               </section>
               
               {/* Track Assessment Section */}
               <section id="assessment" className="bg-gray-100 pb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="bg-white rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
                              <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
                                   <div className="lg:self-center">
                                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                             <span className="block">Verify Your Graduation Status</span>
                                        </h2>
                                        <p className="mt-4 text-lg leading-6 text-gray-600">
                                             Check your grades and confirm your eligibility for graduation.
                                        </p>
                                        <a href="#" className="mt-8 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                             Verify Grades
                                        </a>
                                   </div>
                              </div>
                              <div className="relative -mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
                                   <img className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20" src="/image/diploma.jpg" alt="Track Assessment" />
                              </div>
                         </div>
                    </div>
               </section>

               {/* Grade Verification Section */}
               <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center">
                              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Verify Your Graduation Status</h2>
                              <p className="mt-4 text-xl text-gray-600">Check your grades and confirm your eligibility for graduation</p>
                         </div>
                         <div className="mt-10 flex justify-center">
                              <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out">
                                   Verify Grades
                              </a>
                         </div>
                    </div>
               </section>
          </div>
     )
}

export default HomePage
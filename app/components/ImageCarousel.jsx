"use client"
import { Image } from 'antd'
import PreviewGroup from "antd/lib/image/PreviewGroup"
import { useCallback, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function ImageCarousel({ images }) {
     const [currentIndex, setCurrentIndex] = useState(0);

     const nextImage = useCallback(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
     }, [])

     const prevImage = useCallback(() => {
          setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
     }, [])

     return (
          <div className="relative">
               <PreviewGroup>
                    {images.map((image, index) => (
                         <Image
                              key={`image-${index + 1}`}
                              width={"100%"}
                              height={265}
                              src={image}
                              rootClassName={`hidden cursor-pointer ${index === currentIndex ? '!block' : ''
                                   }`}
                              alt={`Project image ${index + 1}`}
                              className={`object-cover transition-opacity`}
                              preview={{
                                   visible: false,
                                   mask: null,
                              }}
                         />
                    ))}
               </PreviewGroup>

               <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
               >
                    <MdChevronLeft size={24} />
               </button>
               <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
               >
                    <MdChevronRight size={24} />
               </button>
               <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {images.map((_, index) => (
                         <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white border border-gray-400' : 'bg-gray-400'}`}
                         />
                    ))}
               </div>
          </div>
     );
};

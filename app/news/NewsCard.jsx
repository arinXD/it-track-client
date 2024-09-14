import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NewsCard = ({ id, title, desc, image }) => (
     <Link href={`/news/${id}`} className="bg-white shadow-md overflow-hidden block">
          <Image
               src={image}
               alt={title}
               width={400}
               height={200}
               className="w-full h-48 object-cover"
          />
          <div className="p-4">
               <h3 className="text-xl font-semibold mb-2">

                    {title}
               </h3>
               <p className="text-gray-600 text-sm line-clamp-2">{desc}</p>
          </div>
     </Link>
);

export default NewsCard;
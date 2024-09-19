import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { simpleDMY } from '@/src/util/simpleDateFormatter';

const NewsCard = ({ news }) => (
     <Link href={`/news/${news.id}`} className="bg-white shadow-md overflow-hidden block">
          <Image
               src={news.image}
               alt={news.title}
               width={400}
               height={200}
               className="w-full h-48 object-cover"
          />
          <div className="p-4">
               <p className='text-default-500 text-xs mb-1'>เผยแพร่เมื่อ {simpleDMY(news.updatedAt)}</p>
               <h3 className="text-xl font-semibold"> {news.title} </h3>
               <p className="text-gray-600 text-sm line-clamp-2">{news.desc}</p>
          </div>
     </Link>
);

export default NewsCard;
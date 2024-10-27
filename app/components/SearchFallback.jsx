"use client"
import { Progress } from "@nextui-org/react";

const SearchFallback = () => {
     return (
          <div className="w-full flex justify-center items-center">
               <Progress
                    size="sm"
                    label="Loading..."
                    isIndeterminate
                    aria-label="Loading..."
                    className="max-w-md"
               />
          </div>
     )
}

export default SearchFallback
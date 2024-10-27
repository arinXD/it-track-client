"use client"
import { Progress } from "@nextui-org/react";

const SearchFallback = () => {
     return (
          <div className="w-full flex justify-center items-center mt-16">
               <Progress
                    size="sm"
                    label={
                         <div className="w-full text-center">
                              Loading...
                         </div>
                    }
                    isIndeterminate
                    aria-label="Loading..."
                    className="max-w-md text-center"
                    classNames={{
                         label: "block w-full tracking-wider font-medium text-default-600",
                    }}
               />
          </div>
     )
}

export default SearchFallback
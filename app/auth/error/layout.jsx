import SearchFallback from '@/app/components/SearchFallback'
import { Suspense } from 'react'

const layout = ({ children }) => {
     return (
          <Suspense fallback={<SearchFallback />}>
               {children}
          </Suspense>
     )
}

export default layout
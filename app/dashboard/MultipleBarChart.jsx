"use client"
import ReactApexChart from 'react-apexcharts'
const MultipleBarChart = ({ totalPopular, totalPopularOptions }) => {
     return (
          <>
               <ReactApexChart
                    series={totalPopular}
                    type="bar"
                    height={310}
                    options={totalPopularOptions}
               />
          </>
     )
}

export default MultipleBarChart
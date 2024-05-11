"use client"
import ReactApexChart from 'react-apexcharts'
const BarChart = ({ gpaOptionBar }) => {
     return (
          <>
               <ReactApexChart
                    className={"w-full"}
                    options={gpaOptionBar.options}
                    series={gpaOptionBar.series}
                    type="bar"
                    height={320}
               />
          </>
     )
}

export default BarChart
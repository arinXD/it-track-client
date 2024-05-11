"use client"
import ReactApexChart from 'react-apexcharts'
const DounutChart = ({ sumTrackOption }) => {
     return (
          <>
               <ReactApexChart
                    className={"w-full"}
                    options={sumTrackOption.options}
                    series={sumTrackOption.series}
                    type="donut"
               />
          </>
     )
}

export default DounutChart
"use client"
import ReactApexChart from 'react-apexcharts'
const BarChart = ({ option }) => {
    return (
        <ReactApexChart
            className={"w-full"}
            options={option.options}
            series={option.series}
            type="bar"
            height={400}
        />
    )
}

export default BarChart
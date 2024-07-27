"use client"
import ReactApexChart from 'react-apexcharts'
const Chart = ({ option, className, type, height = 400 }) => {
    return (
        <ReactApexChart
            className={`w-full ${className}`}
            options={option.options}
            series={option.series}
            type={type}
            height={height}
        />
    )
}

export default Chart
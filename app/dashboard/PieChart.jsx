"use client"
import { Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
{/* <div className='my-[30px] flex flex-wrap gap-4'>
<PieChart
    title={"Property for BIS"}
    value={64}
    series={[64, 25]}
    colors={['#475be8', '#e4e8ef']} />
<PieChart
    title={"Property for WEB"}
    value={52}
    series={[60, 40]}
    colors={['#475ae8', '#e4b8ef']} />
<PieChart
    title={"Property for Network"}
    value={56}
    series={[75, 25]}
    colors={['#275be8', '#c4e8ef']} />
<PieChart
    title={"Total Student"}
    value={172}
    series={[75, 25]}
    colors={['#475be8', '#e4e8ef']} />
</div> */}

const PieChart = ({ title, value, series, colors }) => {
    return (
        <Box
            id="chart"
            flex={1}
            display={"flex"}
            bgcolor={"#fcfcfc"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            pl={3.5}
            py={2}
            gap={2}
            borderRadius={"15px"}
            minHeight={"110px"}
            width={"fit-content"}
            border={1}
            borderColor="#e5e5e5"
        >
            <Stack direction={"column"}>
                <Typography fontSize={14} color={"#808191"}>{title}</Typography>
                <Typography fontSize={24} color={"#11142d"}
                    fontWeight={700} mt={1}>{value}</Typography>
            </Stack>
            <ReactApexChart options={{
                chart: { type: "donut" },
                colors,
                legend: { show: false },
                dataLabels: { enabled: false },
            }}
                series={series}
                type='donut'
                width={"120px"}
            />
        </Box>
    )
}

export default PieChart
import React from 'react'
import { Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import ReactApexChart from 'react-apexcharts'
import { ArrowCircleUpRounded } from '@mui/icons-material'
import { TotalRevenueSeries, TotalRevenueOptions } from './TotalRevenueConfig'
const TotalRevenue = () => {
    return (
        <Box
            sx={{ width: '75%' }}
            p={4}
            flex={1}
            bgcolor="#fcfcfc"
            id="chart"
            display="flex"
            flexDirection="column"
            borderRadius="15px"
            border={1}
            borderColor="#e5e5e5"
        >
            <Typography fontSize={18} fontWeight={600} color="#11142d">
                Total Revenue
            </Typography>

            <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                <Typography fontSize={28} fontWeight={700} color="#11142d">
                    $236,535
                </Typography>
                <Stack direction="row" alignItems="center" gap={1}>
                    <ArrowCircleUpRounded
                        sx={{ fontSize: 25, color: "#475be8" }}
                    />
                    <Stack>
                        <Typography fontSize={15} color="#475be8">
                            0.8%
                        </Typography>
                        <Typography fontSize={12} color="#808191">
                            Than Last Month
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>

            <ReactApexChart
                series={TotalRevenueSeries}
                type="bar"
                height={310}
                options={TotalRevenueOptions}
            />
        </Box>
    )
}

export default TotalRevenue
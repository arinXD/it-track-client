"use client"
import React from 'react'
import { Navbar, Sidebar, BreadCrumb, ContentWrap } from '../components';
import Link from 'next/link';
import { Box, Stack } from '@mui/system';
import { Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const PieChart = dynamic(() => import('@/app/components/charts/PieChart'), { ssr: false });
const TotalRevenue = dynamic(() => import('@/app/components/charts/TotalRevenue'), { ssr: false });
const PropertyReferrals = dynamic(() => import('@/app/components/charts/PropertyReferrals'), { ssr: false });

export default function Page() {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <Box mt={"30px"}>
                    <Typography fontSize={25} fontWeight={700}
                        color={"#11142D"}>
                        ตัวชี้วัดแสดงผลรวมการคัดเลือกความเชี่ยวชาญประจำปีการศึกษา ล่าสุด
                    </Typography>
                </Box>

                <Box my={"30px"} display="flex"
                    flexWrap={"wrap"} gap={4}>
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
                </Box>

                <Stack my={"30px"} width={"100%"}
                    direction={{ xs: "column", lg: "row" }} gap={4}>
                    <TotalRevenue />
                    <PropertyReferrals />
                </Stack>
            </ContentWrap>
        </>
    )
}

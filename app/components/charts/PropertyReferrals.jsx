import React from 'react'
import { Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'

const propertyReferralsInfo = [
    {
        title: 'Social Media',
        percentage: 64,
        color: '#6C5DD3',
    },
    {
        title: 'Marketplace',
        percentage: 40,
        color: '#7FBA7A',
    },
    {
        title: 'Websites',
        percentage: 50,
        color: '#FFCE73',
    },
    {
        title: 'Digital Ads',
        percentage: 80,
        color: '#FFA2C0',
    },
    {
        title: 'Others',
        percentage: 15,
        color: '#F45252',
    },
];
const ProgressBar = ({ title, percentage, color }) => (
    <Box width="100%">
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
        >
            <Typography fontSize={16} fontWeight={500} color="#11142d">
                {title}
            </Typography>
            <Typography fontSize={16} fontWeight={500} color="#11142d">
                {percentage}%
            </Typography>
        </Stack>
        <Box
            mt={2}
            position="relative"
            width="100%"
            height="8px"
            borderRadius={1}
            bgcolor="#e4e8ef"
        >
            <Box
                width={`${percentage}%`}
                bgcolor={color}
                position="absolute"
                height="100%"
                borderRadius={1}
            />
        </Box>
    </Box>
);
const PropertyReferrals = () => {
    return (
        <Box
            sx={{ width: '25%' }}
            p={4}
            bgcolor="#fcfcfc"
            id="chart"
            // minWidth={490}
            display="flex"
            flexDirection="column"
            borderRadius="15px"
            border={1}
            borderColor="#e5e5e5"
        >
            <Typography fontSize={18} fontWeight={600} color="#11142d">
                Property Referrals
            </Typography>

            <Stack my="20px" direction="column" gap={4}>
                {propertyReferralsInfo.map((bar) => (
                    <ProgressBar key={bar.title} {...bar} />
                ))}
            </Stack>
        </Box>
    );
}

export default PropertyReferrals
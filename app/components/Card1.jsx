"use client"
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Card1() {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                alt="card1 image"
                height="140"
                image="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, vel beatae? Doloribus aut id soluta, dolores excepturi accusamus, ex corrupti eligendi, sint necessitatibus odit reprehenderit autem quisquam et ab quas eius maxime adipisci iure nihil distinctio doloremque illo. Accusantium dolore consequatur aut quos natus quibusdam repellat facilis possimus sed ducimus.
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}


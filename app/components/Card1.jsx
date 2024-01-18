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
                image="https://scontent-bkk1-2.xx.fbcdn.net/v/t1.15752-9/419907790_1441293393089626_2574240965683627478_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=8cd0a2&_nc_eui2=AeFa6QjbDoQ8N0wB17Ha_gyYMFa0KfUF5OMwVrQp9QXk4zrtxMHB9NksKCL2Jpsz3ApiCLBQrN8ZSE2Gq85G_tf-&_nc_ohc=kdjFPHeay7YAX_TQbjy&_nc_ht=scontent-bkk1-2.xx&cb_e2o_trans=q&oh=03_AdTmOWM3FHfBLMt02XPoQ1TtCUJgFhGb7fODvkzro-I3PQ&oe=65CF9539"
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


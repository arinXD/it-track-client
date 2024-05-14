"use client"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function Card1({src}) {
    return (
        <Card sx={{ borderRadius:"8px",boxShadow: "none", border: "1px solid #cbd5e1" ,maxWidth: 345 }}>
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
        </Card>
    );
}


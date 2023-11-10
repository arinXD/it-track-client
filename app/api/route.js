import { NextResponse } from "next/server";

const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'it_track'
})


export async function GET() {
    con.connect()
    con.query(
        `SELECT * FROM student`, function (err, results, fields){
            if (err) {
                return NextResponse.json({ err });
            }
            return NextResponse.json({ data: results });
        }
    );
    
    return NextResponse.json({ ping: "pong" });
}

export async function POST(request) {
    const data = await request.json()
    return NextResponse.json({
        post: data
    })
}

export async function PUT(request) {
    const data = await request.json()
    return NextResponse.json({
        put: data
    })
}

export async function PATCH(request) {
    const data = await request.json()
    return NextResponse.json({
        patch: data
    })
}
export async function DELETE(request) {
    const data = await request.json()
    return NextResponse.json({
        delete: data
    })
}
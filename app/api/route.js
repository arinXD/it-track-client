import { NextResponse } from "next/server";

export async function GET() {
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
"use server"
import { getServerSession } from "next-auth";

export async function getCurrentUserEmail() {
     const session = await getServerSession()
     return session.user.email
}
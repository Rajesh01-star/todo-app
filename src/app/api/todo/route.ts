import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"; // Install this package if not already installed
import { prismaClient as prisma } from "../../clients/db/index";

// Secret key for JWT verification (store this securely in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Helper to extract userId from JWT
const getUserIdFromToken = (req: NextRequest): number | null => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        return decoded.userId;
    } catch {
        return null;
    }
};

export async function GET(req: NextRequest) {
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const todos = await prisma.todo.findMany({
            where: { userId }, // Fetch todos for the logged-in user
        });
        return new Response(JSON.stringify(todos), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, content } = body;

        const newTodo = await prisma.todo.create({
            data: { title, content, userId }, // Associate todo with the logged-in user
        });

        return new Response(JSON.stringify(newTodo), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, title, content } = body;

        // Ensure the todo being updated belongs to the logged-in user
        const existingTodo = await prisma.todo.findUnique({
            where: { id },
        });

        if (!existingTodo || existingTodo.userId !== userId) {
            return new Response(JSON.stringify({ error: "Unauthorized or Todo not found" }), { status: 403 });
        }

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: { title, content },
        });

        return new Response(JSON.stringify(updatedTodo), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const userId = getUserIdFromToken(req);
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const body = await req.json();
        const { id } = body;

        // Ensure the todo being deleted belongs to the logged-in user
        const existingTodo = await prisma.todo.findUnique({
            where: { id },
        });

        if (!existingTodo || existingTodo.userId !== userId) {
            return new Response(JSON.stringify({ error: "Unauthorized or Todo not found" }), { status: 403 });
        }

        await prisma.todo.delete({ where: { id } });

        return new Response(
            JSON.stringify({ message: "Todo deleted successfully" }),
            { status: 200 }
        );
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

import { hashPassword } from "@/app/utils/auth";
import { prismaClient as prisma } from "@/app/clients/db/index"



// Define the expected structure of the request body
interface RegisterRequestBody {
    email: string;
    password: string;
    username: string;
}

export async function POST(req: Request): Promise<Response> {
    try {
        // Parse and validate the request body
        const body: RegisterRequestBody = await req.json();

        const { email, password, username } = body;

        if (!email || !password || !username) {
            return new Response(
                JSON.stringify({ error: "All fields are required." }),
                { status: 400 }
            );
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({ error: "User already exists." }),
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = hashPassword(password);

        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        // Return success response
        return new Response(
            JSON.stringify({
                message: "User registered successfully.",
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    username: newUser.username,
                },
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error." }),
            { status: 500 }
        );
    }
}

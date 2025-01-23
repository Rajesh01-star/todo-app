import { prismaClient as prisma } from "../../clients/db/index";
import jwt from "jsonwebtoken";
import { verifyPassword } from "@/app/utils/auth";


// JWT Secret Key (keep it safe and use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Define the expected structure of the request body
interface LoginRequestBody {
    email: string;
    password: string;
}

export async function POST(req: Request): Promise<Response> {
    try {
        // Parse and validate the request body
        const body: LoginRequestBody = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Email and password are required." }),
                { status: 400 }
            );
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "Invalid email or password." }),
                { status: 401 }
            );
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return new Response(
                JSON.stringify({ error: "Invalid email or password." }),
                { status: 401 }
            );
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, username: user.username }, // Payload
            JWT_SECRET, // Secret key
        );

        // Return the token in the response
        return new Response(
            JSON.stringify({
                message: "Login successful.",
                token,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during login:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error." }),
            { status: 500 }
        );
    }
}

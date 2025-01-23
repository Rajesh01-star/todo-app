import { randomBytes, scryptSync } from 'crypto';

export function hashPassword(password: string): string {
    // Generate a random salt
    const salt = randomBytes(16).toString('hex');
    
    // Hash the password using scrypt
    const hash = scryptSync(password, salt, 64).toString('hex');
    
    // Return the combined salt and hash
    return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
    // Split the stored hash into its components
    const [salt, storedHash] = hashedPassword.split(':');
    
    // Hash the provided password with the same salt
    const hash = scryptSync(password, salt, 64).toString('hex');
    
    // Compare the generated hash with the stored hash
    return storedHash === hash;
} 
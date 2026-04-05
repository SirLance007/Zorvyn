import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiError from '../../utils/ApiError.js';

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const registerService = async ({ name, email, password }) => {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ApiError(409, 'Email is already registered');

    // First user gets ADMIN role automatically
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'ADMIN' : 'VIEWER';

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: { name, email, passwordHash, role },
        select: { id: true, name: true, email: true, role: true }
    });

    const token = generateToken(user.id);
    return { user, token };
};

export const loginService = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(401, 'Invalid email or password');
    if (!user.isActive) throw new ApiError(403, 'Account is deactivated. Contact an admin.');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new ApiError(401, 'Invalid email or password');

    const token = generateToken(user.id);

    return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token
    };
};

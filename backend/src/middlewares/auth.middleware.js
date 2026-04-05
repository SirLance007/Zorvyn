import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import ApiError from '../utils/ApiError.js';

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Not authorized, no token');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true, role: true, isActive: true }
        });

        if (!user) throw new ApiError(401, 'User not found');
        if (!user.isActive) throw new ApiError(403, 'Account is deactivated');

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

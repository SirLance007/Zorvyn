import ApiError from '../utils/ApiError.js';
import { Prisma } from '@prisma/client';

const errorHandler = (err, req, res, next) => {
    let error = err;

    // Handle Prisma-specific errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
            error = new ApiError(404, 'Record not found');
        } else if (err.code === 'P2002') {
            error = new ApiError(409, 'A record with this value already exists');
        } else {
            error = new ApiError(400, `Database error: ${err.code}`);
        }
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new ApiError(401, 'Invalid token');
    }
    if (err.name === 'TokenExpiredError') {
        error = new ApiError(401, 'Token expired, please login again');
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        errors: error.errors || [],
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

export default errorHandler;

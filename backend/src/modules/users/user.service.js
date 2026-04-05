import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';

export const getAllUsersService = async () => {
    return prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }
    });
};

export const updateUserRoleService = async (id, role) => {
    const validRoles = ['VIEWER', 'ANALYST', 'ADMIN'];
    if (!validRoles.includes(role)) throw new ApiError(400, `Invalid role. Must be one of: ${validRoles.join(', ')}`);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new ApiError(404, 'User not found');

    return prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, name: true, email: true, role: true, isActive: true }
    });
};

export const updateUserStatusService = async (id, isActive) => {
    if (typeof isActive !== 'boolean') throw new ApiError(400, 'isActive must be a boolean');

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new ApiError(404, 'User not found');

    return prisma.user.update({
        where: { id },
        data: { isActive },
        select: { id: true, name: true, email: true, role: true, isActive: true }
    });
};

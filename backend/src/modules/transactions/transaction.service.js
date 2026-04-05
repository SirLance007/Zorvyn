import prisma from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';

export const getAllTransactionsService = async ({ type, category, from, to, page = 1, limit = 10 }) => {
    const where = { isDeleted: false };
    if (type) where.type = type;
    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (from || to) {
        where.date = {};
        if (from) where.date.gte = new Date(from);
        if (to) where.date.lte = new Date(to);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
        prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
            skip,
            take: limitNum,
            include: { user: { select: { id: true, name: true, email: true } } }
        }),
        prisma.transaction.count({ where })
    ]);

    return {
        data,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    };
};

export const getTransactionByIdService = async (id) => {
    const tx = await prisma.transaction.findFirst({
        where: { id, isDeleted: false },
        include: { user: { select: { id: true, name: true, email: true } } }
    });
    if (!tx) throw new ApiError(404, 'Transaction not found');
    return tx;
};

export const createTransactionService = async (data, userId) => {
    return prisma.transaction.create({
        data: {
            amount: data.amount,
            type: data.type,
            category: data.category,
            date: new Date(data.date),
            notes: data.notes,
            createdBy: userId
        }
    });
};

export const updateTransactionService = async (id, data) => {
    const tx = await prisma.transaction.findFirst({ where: { id, isDeleted: false } });
    if (!tx) throw new ApiError(404, 'Transaction not found');

    return prisma.transaction.update({
        where: { id },
        data: {
            ...(data.amount !== undefined && { amount: data.amount }),
            ...(data.type && { type: data.type }),
            ...(data.category && { category: data.category }),
            ...(data.date && { date: new Date(data.date) }),
            ...(data.notes !== undefined && { notes: data.notes }),
        }
    });
};

export const softDeleteTransactionService = async (id) => {
    const tx = await prisma.transaction.findFirst({ where: { id, isDeleted: false } });
    if (!tx) throw new ApiError(404, 'Transaction not found');

    return prisma.transaction.update({
        where: { id },
        data: { isDeleted: true }
    });
};

import prisma from '../../config/db.js';

export const getSummaryService = async () => {
    const result = await prisma.transaction.groupBy({
        by: ['type'],
        where: { isDeleted: false },
        _sum: { amount: true }
    });

    let totalIncome = 0;
    let totalExpenses = 0;

    result.forEach(({ type, _sum }) => {
        if (type === 'INCOME') totalIncome = Number(_sum.amount) || 0;
        if (type === 'EXPENSE') totalExpenses = Number(_sum.amount) || 0;
    });

    return {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses
    };
};

export const getByCategoryService = async () => {
    const result = await prisma.transaction.groupBy({
        by: ['type', 'category'],
        where: { isDeleted: false },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } }
    });

    return result.map(({ type, category, _sum }) => ({
        type,
        category,
        total: Number(_sum.amount) || 0
    }));
};

export const getTrendsService = async (period = 'monthly') => {
    // Fetch all non-deleted transactions sorted by date
    const transactions = await prisma.transaction.findMany({
        where: { isDeleted: false },
        select: { amount: true, type: true, date: true },
        orderBy: { date: 'asc' }
    });

    // Group them by period (monthly or weekly)
    const grouped = {};

    transactions.forEach(({ amount, type, date }) => {
        let key;
        const d = new Date(date);
        if (period === 'daily') {
            key = d.toISOString().split('T')[0];
        } else if (period === 'weekly') {
            // ISO week: YYYY-WNN
            const startOfYear = new Date(d.getFullYear(), 0, 1);
            const week = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
            key = `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
        } else {
            key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        }

        if (!grouped[key]) grouped[key] = { period: key, income: 0, expense: 0 };
        if (type === 'INCOME') grouped[key].income += Number(amount);
        else grouped[key].expense += Number(amount);
    });

    return Object.values(grouped);
};

export const getRecentService = async (n = 10) => {
    return prisma.transaction.findMany({
        where: { isDeleted: false },
        orderBy: { date: 'desc' },
        take: Number(n),
        include: { user: { select: { id: true, name: true, email: true } } }
    });
};

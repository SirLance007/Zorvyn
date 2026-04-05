import { z } from 'zod';

export const createTransactionSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().min(1, 'Category is required'),
    date: z.string().datetime({ offset: true }).or(z.string().date()),
    notes: z.string().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

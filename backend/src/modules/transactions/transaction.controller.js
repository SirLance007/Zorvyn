import {
    getAllTransactionsService,
    getTransactionByIdService,
    createTransactionService,
    updateTransactionService,
    softDeleteTransactionService
} from './transaction.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { createTransactionSchema, updateTransactionSchema } from '../../validators/transaction.validator.js';

export const getTransactions = async (req, res, next) => {
    try {
        const result = await getAllTransactionsService(req.query);
        res.status(200).json(new ApiResponse(200, result, 'Transactions fetched successfully'));
    } catch (error) {
        next(error);
    }
};

export const getTransactionById = async (req, res, next) => {
    try {
        const tx = await getTransactionByIdService(req.params.id);
        res.status(200).json(new ApiResponse(200, tx, 'Transaction fetched successfully'));
    } catch (error) {
        next(error);
    }
};

export const createTransaction = async (req, res, next) => {
    try {
        const parsed = createTransactionSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.errors });
        }
        const tx = await createTransactionService(parsed.data, req.user.id);
        res.status(201).json(new ApiResponse(201, tx, 'Transaction created successfully'));
    } catch (error) {
        next(error);
    }
};

export const updateTransaction = async (req, res, next) => {
    try {
        const parsed = updateTransactionSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.errors });
        }
        const tx = await updateTransactionService(req.params.id, parsed.data);
        res.status(200).json(new ApiResponse(200, tx, 'Transaction updated successfully'));
    } catch (error) {
        next(error);
    }
};

export const deleteTransaction = async (req, res, next) => {
    try {
        await softDeleteTransactionService(req.params.id);
        res.status(200).json(new ApiResponse(200, null, 'Transaction deleted successfully'));
    } catch (error) {
        next(error);
    }
};

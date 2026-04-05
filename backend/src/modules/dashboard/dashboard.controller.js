import {
    getSummaryService,
    getByCategoryService,
    getTrendsService,
    getRecentService
} from './dashboard.service.js';
import ApiResponse from '../../utils/ApiResponse.js';

export const getSummary = async (req, res, next) => {
    try {
        const data = await getSummaryService();
        res.status(200).json(new ApiResponse(200, data, 'Summary fetched successfully'));
    } catch (error) {
        next(error);
    }
};

export const getByCategory = async (req, res, next) => {
    try {
        const data = await getByCategoryService();
        res.status(200).json(new ApiResponse(200, data, 'Category breakdown fetched successfully'));
    } catch (error) {
        next(error);
    }
};

export const getTrends = async (req, res, next) => {
    try {
        const data = await getTrendsService(req.query.period);
        res.status(200).json(new ApiResponse(200, data, 'Trends fetched successfully'));
    } catch (error) {
        next(error);
    }
};

export const getRecent = async (req, res, next) => {
    try {
        const data = await getRecentService(req.query.n);
        res.status(200).json(new ApiResponse(200, data, 'Recent transactions fetched successfully'));
    } catch (error) {
        next(error);
    }
};

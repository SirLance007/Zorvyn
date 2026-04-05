import { getAllUsersService, updateUserRoleService, updateUserStatusService } from './user.service.js';
import ApiResponse from '../../utils/ApiResponse.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'));
    } catch (error) {
        next(error);
    }
};

export const updateUserRole = async (req, res, next) => {
    try {
        const user = await updateUserRoleService(req.params.id, req.body.role);
        res.status(200).json(new ApiResponse(200, user, 'User role updated successfully'));
    } catch (error) {
        next(error);
    }
};

export const updateUserStatus = async (req, res, next) => {
    try {
        const user = await updateUserStatusService(req.params.id, req.body.isActive);
        res.status(200).json(new ApiResponse(200, user, 'User status updated successfully'));
    } catch (error) {
        next(error);
    }
};

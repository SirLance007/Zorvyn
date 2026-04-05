import { registerService, loginService } from './auth.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { registerSchema, loginSchema } from '../../validators/user.validator.js';

export const register = async (req, res, next) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.errors });
        }
        const result = await registerService(parsed.data);
        res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.errors });
        }
        const result = await loginService(parsed.data);
        res.status(200).json(new ApiResponse(200, result, 'Login successful'));
    } catch (error) {
        next(error);
    }
};

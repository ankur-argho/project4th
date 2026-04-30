import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        fullName: string;
        role: string;
    };
}
export declare const generateToken: (payload: {
    id: string;
    email: string;
    fullName: string;
    role: string;
}) => string;
export declare const verifyToken: (token: string) => any;
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const authorize: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map
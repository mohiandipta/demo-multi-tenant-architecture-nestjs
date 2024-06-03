import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const tenant = req.headers['x-tenant-id'] as string; // Adjust this based on where the tenant ID is stored
        if (!tenant) {
            return res.status(400).json({ message: 'Tenant ID is missing' });
        }
        req['tenant'] = tenant;
        next();
    }
}
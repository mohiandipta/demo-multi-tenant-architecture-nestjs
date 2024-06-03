import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AccessControlMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authToken = req.headers['authorization'];

        if (!authToken) {
            throw new ForbiddenException('Unauthorized: Missing authorization token');
        }

        const splitToken = await authToken.split(' ')[1]
        const decodeToken = this.jwtService.decode(splitToken) as { role: string, enroll: number }

        // const menuPermission: any[] = await this.menuPermissionService.getMenuByEnroll(decodeToken.enroll)

        // const menuIds = menuPermission.map(item => item.menuId);
        // const menuPath = await this.menuService.findMenuPathById(menuIds)

        // const isRouteAllowed = menuPath.some(item => item.path === req.baseUrl)

        // if (isRouteAllowed) {
        //     return next();
        // } else {
        // throw new ForbiddenException(`Unauthorized: Access to the ${req.baseUrl} module is restricted`);
        // }
    }
}

import { Injectable, NestMiddleware, Req, Res } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Response, Request } from 'express';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
    use(
        @Req() req: Request,
        @Res() res: Response,
        next: () => void
    ) {
        let target = '';
        console.log(req.baseUrl)
        if (req.baseUrl.startsWith('/api/v1/auth')) {
            target = 'http://localhost:3001/api/v1';
        } else if (req.baseUrl.startsWith('/api/v1/billing')) {
            target = `http://localhost:3002/api/v1`;
        } else if (req.baseUrl.startsWith('/api/v1/tenant')) {
            target = 'http://localhost:3003/api/v1';
        }

        if (target) {
            createProxyMiddleware({
                target,
                changeOrigin: true,
                pathRewrite: {
                    [`^/auth`]: '',
                    [`^/billing`]: '',
                    [`^/tenant`]: '',
                },
            })(req, res, next);
        } else {
            next();
        }
    }
}

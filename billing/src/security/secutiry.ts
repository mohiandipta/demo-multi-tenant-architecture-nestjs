import { INestApplication } from '@nestjs/common'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
// import * as csurf from 'csurf'

const allowedOrigins = [
    // WEBSITES
    'http://localhost',
    'https://cms.neoscoder.com',
    'https://fairvalue-neoscms.vercel.app',
    'https://akijfairvalue.com',
    // MOBILE APPS
    'capacitor://localhost',
    'ionic://localhost',
]

export function setupSecurity(app: INestApplication): void {
    // Set security-related HTTP headers
    app.use(helmet())
    // Enable Cross-origin resource sharing for a list of domains
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.some(o => origin.includes(o))) { // Changed to includes
                callback(null, true);
            } else {
                callback(new Error(`${origin} not allowed by CORS`));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
    });
    // Limit repeated requests for brute-force attacks
    app.use(
        rateLimit({
            windowMs: 5 * 60 * 1000, // 5 minutes
            max: 2000, // limit each IP to 1000 requests per windowMs
            message: 'Too many requests created from this IP, please try again after 5 minutes'
        }),
    )
    // Mitigate Cross-site request forgery (CSRF or XSRF)
    // It requires either session middleware or a cookie-parser to be initialized first
    // app.use(csurf())
}

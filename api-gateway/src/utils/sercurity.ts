import bodyParser from 'body-parser';
import { Application } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});

// Function to set up security middleware
const applySecurityMiddleware = (app: Application) => {
    // Limit body size to prevent DoS attacks
    app.use(bodyParser.json({ limit: '10kb' }));
    app.use(bodyParser.urlencoded({ limit: '10kb', extended: true }));

    // Set security headers
    app.use(helmet());

    // Rate limiting to prevent DDoS attacks
    app.use(limiter);

    // Prevent HTTP Parameter Pollution
    app.use(hpp());

    // Disable x-powered-by header
    app.disable('x-powered-by');
};

export default applySecurityMiddleware;

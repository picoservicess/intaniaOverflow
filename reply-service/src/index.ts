import cors from 'cors';
import express from 'express';
import 'express-async-errors';

import replies from './routes/replies';

const PORT = process.env.PORT || 5003;
const app = express();

app.use(cors());
app.use(express.json());

// Load the /posts routes
app.use('/replies', replies);

// Global error handling
app.use(
    (
        err: Error,
        _req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        res.status(500).send('Uh oh! An unexpected error occurred.');
    }
);

// start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

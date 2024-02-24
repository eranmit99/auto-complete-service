//import './services/tracing-service';
import express, { Request, Response } from 'express';
import {config} from "./config";
import {v1Router} from "./routes";

const app = express();
const port = config.app.port;

app.use('/v1', v1Router)

app.get('/is_alive', (req: Request, res: Response) => {
    res.status(200).json({ status: 'alive' });
});

// Start the Express server
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        console.log('HTTP server closed')
    })
})
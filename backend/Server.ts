import express, { Request, Response, Handler as ExpressHandler } from 'express';

export interface ServerProps {
  port: string | number;
  staticPath: string;
  sessionMiddleware: ExpressHandler;
}

export const createServer = ({
  port,
  staticPath,
  sessionMiddleware,
}: ServerProps) => {
  const app = express();

  app.use(sessionMiddleware);
  app.use(express.static(staticPath));

  app.get('/api', (_req: Request, res: Response): void => {
    res.send('API HERE');
  });

  app.get('*', (_req: Request, res: Response): void => {
    res.sendFile(staticPath);
  });

  return app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

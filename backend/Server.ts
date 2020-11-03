import { Express, Request, Response } from 'express';
import express from 'express';
import * as path from 'path';

export class Server {
  private app: Express;

  constructor(app: Express, staticPath: string) {
    this.app = app;
    console.log(staticPath);

    this.app.use(express.static(staticPath));

    this.app.get('/api', (_req: Request, res: Response): void => {
      res.send('You have reached the API!');
    });

    this.app.get('*', (_req: Request, res: Response): void => {
      res.sendFile(staticPath);
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => console.log(`Server listening on port ${port}`));
  }
}
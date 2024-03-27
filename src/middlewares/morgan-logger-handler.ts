import { Application, Request } from 'express';
import morgan from 'morgan';

export default async function setMorganLogger(app: Application) {
  process.env.NODE_ENV !== 'test' &&
    app.use(
      morgan('combined', {
        stream: { write: console.info },
        // do not log this call, too much flood
        skip: (req: Request) => req.originalUrl.startsWith('/openapi'),
      })
    );
}

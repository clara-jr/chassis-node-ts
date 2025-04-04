import { Request, Response, NextFunction } from 'express';
/*
https://expressjs.com/en/guide/error-handling.html
For errors returned from asynchronous functions invoked by route handlers and middleware,
you must pass them to the next() function, where Express will catch and process them.
*/
export default function (fn: (_req: Request, _res: Response, _next: NextFunction) => Promise<void>) {
  return function (req: Request, res: Response, next: NextFunction) {
    return (
      fn(req, res, next)
      // the next middlewares will only be executed if there was an error
      // .then(() => next())
        .catch(next)
    );
  };
}

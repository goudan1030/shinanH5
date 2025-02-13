import { Request, Response, NextFunction } from 'express'

export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response | undefined>

export const createAsyncHandler = (handler: AsyncHandler) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(handler(req, res, next)).catch(next)
  } 
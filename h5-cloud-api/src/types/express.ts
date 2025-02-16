import { Request, Response, NextFunction } from 'express'

// 扩展 Express 的 Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        phone: string
        username?: string
      }
    }
  }
}

export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response | undefined>

export const createAsyncHandler = (handler: AsyncHandler) => 
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(handler(req, res, next)).catch(next)
  } 
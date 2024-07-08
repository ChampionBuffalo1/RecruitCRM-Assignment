import { getJwtPayload } from '../util/jwtUtil';
import type { Request, Response, NextFunction } from 'express';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error: Not Properly typed
  if (req.userId) {
    next();
  } else {
    res.status(400).json({
      success: false,
      message: 'You cannot go to this route without an authorization token.',
    });
  }
};

export const sessionManager = (req: Request, res: Response, next: NextFunction): void => {
  const jwtToken = req.headers.authorization?.replace('Bearer ', '');
  try {
    // @ts-ignore: For some reasont the express.d.ts file's
    // Request interface is not overloading the default express interface
    // and since I have limited time to complete this assignment
    //  I can't afford to fix a typing issues
    if (jwtToken) req.userId = getJwtPayload(jwtToken).userId;
    next();
  } catch (err) {
    if ((err as Error).message === 'JwtError') {
      res.status(401).json({
        success: false,
        message: 'Your access token has been expired.',
      });
      return;
    }
    console.error(err);
  }
};

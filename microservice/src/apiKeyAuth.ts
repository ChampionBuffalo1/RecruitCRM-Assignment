import { db } from './db';
import type { Request, Response, NextFunction } from 'express';

export const verifyApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiToken = req.header('X-API-TOKEN');
  if (!apiToken) {
    return res.status(400).json({
      success: false,
      message: 'Missing X-API-TOKEN header',
    });
  }
  try {
    // Could use redis for this.
    const key = await db
      .selectFrom('apiKeys')
      .select(['user_id'])
      .where('key', '=', apiToken)
      .executeTakeFirstOrThrow();
    // @ts-expect-error: Need type fixing
    req.userId = key.user_id;
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Invalid API Key!',
    });
  }
};

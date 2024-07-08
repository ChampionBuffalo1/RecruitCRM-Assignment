import { v4 as uuid } from 'uuid';
import { db } from '../../db';
import type { Request, Response } from 'express';

export async function createApiKey(req: Request, res: Response) {
  // @ts-expect-error: Need type fixing
  const userId = req.userId;
  const apiKey = await db.selectFrom('apiKeys').select(['id', 'key']).where('user_id', '=', userId).executeTakeFirst();
  if (apiKey?.id) {
    // If api key already exists then send it back
    return res.status(200).json({
      success: true,
      api_key: apiKey.key,
    });
  }
  // Otherwise create a new api key and return that
  const keys = await db
    .insertInto('apiKeys')
    .values({
      key: uuid(),
      user_id: userId,
    })
    .returning('key')
    .executeTakeFirst();
  if (!keys?.key) {
    return res.status(500).json({
      success: false,
      message: 'Unknown Error!',
    });
  }
  res.status(200).json({
    success: true,
    api_key: keys.key,
  });
}

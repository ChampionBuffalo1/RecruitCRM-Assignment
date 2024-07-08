import { db } from '../db';
import { resultLimit } from '../Constants';
import type { Request, Response } from 'express';

export async function getUserInfo(req: Request, res: Response) {
  // @ts-expect-error
  const userId = req.userId;
  const user = await db
    .selectFrom('user')
    .select(['first_name', 'last_name', 'email'])
    .where('id', '=', userId)
    .executeTakeFirst();
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "You shouldn't get this error",
    });
  }
  res.status(200).json({
    success: true,
    data: user,
  });
}

export async function getCandidate(req: Request, res: Response) {
  // @ts-expect-error
  const userId = req.userId;
  const queryPage = parseInt(req.query.page as string, 10);
  const page = !Number.isNaN(queryPage) && Number.isSafeInteger(queryPage) && queryPage > 0 ? queryPage - 1 : 0;

  const candidates = await db
    .selectFrom('candidate')
    .select(['id', 'first_name', 'last_name', 'email'])
    .where('user_id', '=', userId)
    .limit(resultLimit)
    .offset(page * resultLimit)
    .execute();
  res.status(200).json({
    success: true,
    data: candidates,
  });
}

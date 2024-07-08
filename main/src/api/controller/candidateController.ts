import { db } from '../../db';
import type { Response, Request } from 'express';
import { ResultsPerPage } from '../../Constants';
import { KyselyBasicErrorType } from './userController';

export async function getUserCandidate(req: Request, res: Response) {
  // @ts-expect-error: Need type fixing
  const ownerId = req.userId;
  const queryPage = parseInt(req.query.page as string, 10);
  // Page is a pagination request query parameter
  const page = !Number.isNaN(queryPage) && Number.isSafeInteger(queryPage) && queryPage > 0 ? queryPage - 1 : 0;

  const candidates = await db
    .selectFrom('candidate')
    .select(['id', 'first_name', 'last_name'])
    .where('user_id', '=', ownerId)
    .limit(ResultsPerPage)
    // Offsetting the results by page number
    // eg: when page is set to 0 then offset is also 0
    // when its 1 then offset is skipping the first `ResultsPerPage` results
    .offset(page * ResultsPerPage)
    .execute();

  res.status(200).json({
    success: true,
    data: candidates,
  });
}

const requiredFields = ['first_name', 'last_name', 'email'];
export async function createCandidate(req: Request, res: Response) {
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `Request body missing required property: ${field}`,
      });
    }
  }
  try {
    const candidate = await db
      .insertInto('candidate')
      .values({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        // @ts-expect-error: Need type fixing
        user_id: req.userId,
      })
      .returning('id')
      .executeTakeFirstOrThrow();

    res.status(200).json({
      success: true,
      message: `Successfully added candidate with id ${candidate.id}`,
    });
  } catch (err) {
    if ((err as KyselyBasicErrorType).code === '23505') {
      res.status(400).json({
        success: false,
        message: 'Candidate email already in use',
      });
    } else {
      console.error('Unknown error code: ', err);
      res.status(500).json({
        success: false,
        message: 'Unknown Error!',
      });
    }
  }
}

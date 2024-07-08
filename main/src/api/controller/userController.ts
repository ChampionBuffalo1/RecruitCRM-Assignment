import { db } from '../../db';
import bcrypt from 'bcrypt';
import { generateJwt } from '../../util/jwtUtil';
import type { Request, Response } from 'express';
import { bcryptSaltRounds } from '../../Constants';

export async function loginController(req: Request, res: Response) {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Request, missing properties',
    });
  }
  const user = await db
    .selectFrom('user')
    .select(['id', 'email', 'password_hash'])
    .where('email', '=', req.body.email)
    .executeTakeFirst();

  if (!user?.email) {
    return res.status(400).json({
      success: false,
      error: 'Email not found',
    });
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password_hash);
  if (!passwordMatch) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email or password',
    });
  }
  const access_token = generateJwt({ userId: user.id });
  res.status(200).json({
    success: true,
    token: access_token,
    message: 'Successfully Logged in',
  });
}

const requiredFields = ['first_name', 'last_name', 'email', 'password'];
export async function registerController(req: Request, res: Response) {
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `Request body missing required property: ${field}`,
      });
    }
  }

  try {
    const passwordHash = await bcrypt.hash(req.body.password, bcryptSaltRounds);
    const user = await db
      .insertInto('user')
      .values({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password_hash: passwordHash,
      })
      .returning('id')
      .executeTakeFirstOrThrow();
    const access_token = generateJwt({ userId: user.id });
    res.status(200).json({
      success: true,
      token: access_token,
      message: 'Registration successful.',
    });
  } catch (err) {
    if ((err as KyselyBasicErrorType).code === '23505') {
      res.status(400).json({
        success: false,
        message: 'Email already in use',
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
export type KyselyBasicErrorType = {
  code: string;
};

import jwt from 'jsonwebtoken';
import { JwtSecret, maxTokenAge } from '../Constants';

function generateJwt(data: Record<string, unknown>): string {
  const token = jwt.sign(data, JwtSecret, {
    expiresIn: maxTokenAge,
  });
  return token;
}

function getJwtPayload(token: string) {
  try {
    const jwtDecoded = jwt.verify(token, JwtSecret) as { userId: 'string' };
    return jwtDecoded;
  } catch (err) {
    if ((err as Error).name === 'TokenExpiredError' || (err as Error).name === 'JsonWebTokenError')
      throw new Error('JwtError', {
        cause: 'Invalid JWT Payload',
      });
  }
  // Never reached, if JwtError is thrown, the function will exit
  return undefined as never;
}

export { generateJwt, getJwtPayload };

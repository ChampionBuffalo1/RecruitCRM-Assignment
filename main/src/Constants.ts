export const PORT: number =
  process.env.PORT && !Number.isNaN(+process.env.PORT) ? parseInt(process.env.PORT, 10) : 3000;
export const JwtSecret: string = process.env.JWT_SECRET || 'secret';
export const maxTokenAge: number = 1000 * 60 * 60 * 24 * 7; // 7 days
export const bcryptSaltRounds = 8;
export const ResultsPerPage = 20;

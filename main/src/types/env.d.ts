namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    PSQL_URL: string;
    SSL?: 'true';
    JWT_SECRET?: string;
  }
}

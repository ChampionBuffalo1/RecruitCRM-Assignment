import { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  user: UserTable;
  candidate: CandidateTable;
  apiKeys: ApiKeysTable;
}

export interface UserTable {
  id: Generated<number>;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface CandidateTable {
  id: Generated<number>;
  first_name: string;
  last_name: string;
  email: string;
  user_id: number;
}

export type Candidate = Selectable<CandidateTable>;
export type NewCandidate = Insertable<CandidateTable>;
export type CandidateUpdate = Updateable<CandidateTable>;

export interface ApiKeysTable {
  id: Generated<number>;
  key: string;
  user_id: number;
}

export type ApiKeys = Selectable<ApiKeysTable>;
export type NewApiKeys = Insertable<ApiKeysTable>;
export type ApiKeysUpdate = Updateable<ApiKeysTable>;


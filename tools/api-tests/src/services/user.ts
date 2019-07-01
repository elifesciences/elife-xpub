/**
 * Provide utilities for the tests to get hold of a user
 *
 * It will provide a list of example users who are in the database and will each have a blank state at startup
 */

import {sign} from 'jsonwebtoken';

export interface UserIdentity {
  token: string;
  identifier: string;
}

const signUser = (id: string): string => {
  const payload = {
    id,
    iat: new Date().getTime(),
    exp: new Date().getTime() + 3600,
    iss: 'xpub',
  }

  // TODO: This should come out of config
  return sign(payload, process.env.JWT_SECRET || '')
}

export const defaultTestUser = {
  token: signUser("ewwboc7m"),
  identifier: "ewwboc7m",
};

export const user1 = {
  token: "",
  identifier: "",
};

export const user2 = {
  token: "",
  identifier: "",
};

export function createNewTestUser() {
  // TODO: Generate a new test user in the database, and create a signed JWT for this user
}

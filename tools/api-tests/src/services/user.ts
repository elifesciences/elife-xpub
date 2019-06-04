/**
 * Provide utilities for the tests to get hold of a user
 *
 * It will provide a list of example users who are in the database and will each have a blank state at startup
 */

export interface UserIdentity {
  token: string;
  identifier: string;
}

export const defaultTestUser = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImV3d2JvYzdtIiwiaXNzIjoieHB1YiIsImlhdCI6MTU1OTY1MjEyMiwiZXhwIjoxNTU5NzM4NTIyfQ.tdfPSQ9ltvaGp1TuxZ0Gab-ZHWP-2YevmnRrYkuw4No",
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

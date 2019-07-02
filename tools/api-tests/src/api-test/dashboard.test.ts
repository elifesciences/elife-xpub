import { test, TestContext } from "ava-ts";
import dashboard from "../xpub-api/dashboard";
import user from "../xpub-api/user";
import { defaultConfig } from "../xpub-api";
import { Manuscript } from "../generated/graphql";

test("manuscripts returns something", async (t: TestContext) => {
  await user.Query.currentUser(defaultConfig());
  const fn = dashboard.Query.manuscripts;
  const result = (await fn(defaultConfig())) as { manuscripts: Manuscript[] };

  // TODO: Do some runtime typechecking -- needs work to generate io-ts types

  t.truthy(result.manuscripts.length >= 0); // Check that it returns an array

  // TODO: We can't really assert on the contents of this until we have a new user for this test
});

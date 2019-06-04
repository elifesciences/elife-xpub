import {test, TestContext} from 'ava-ts';
import dashboard from '../xpub-api/dashboard';
import submission from '../xpub-api/submission';
import {defaultConfig} from '../xpub-api';
import {Manuscript} from '../generated/graphql';
import {v4} from 'uuid';

test("It saves a manuscript with the endpoint", async (t: TestContext) => {
  t.fail();
});

test.todo("The user can submit a manuscript, and other queries update correctly");

test.failing("The user can save a submission and the manuscripts endpoint now includes it", async (t: TestContext) => {
  const context = defaultConfig();

  const testingManuscript: Manuscript = {
    id: v4(),
    created: new Date().toISOString(),
    clientStatus: 'who knows what this is'
  };


  const initialManuscripts = await dashboard.Query.manuscripts(context);

  const savedManuscript = await submission.Mutation.updateManuscript(context, testingManuscript);

  const afterUpdating = await dashboard.Query.manuscripts(context);

  console.log({initialManuscripts, savedManuscript, afterUpdating});
  // Check that the user has a new manuscript
  t.truthy(initialManuscripts.manuscripts.length < afterUpdating.manuscripts.length,
    "there are more manuscripts after a new one is created",
  );

  // Check that the new manuscript exists in the users new manuscripts
  t.truthy(afterUpdating.manuscripts.filter((manuscript: Manuscript) => manuscript.id === savedManuscript.id).length === 1,
    "the new manuscript exists in the updated list of manuscripts",
  );

  // Check that the new manuscript does not exist in the user's old manuscript list
  t.truthy(initialManuscripts.manuscripts.filter((manuscript: Manuscript) => manuscript.id === savedManuscript.id).length === 0,
    "the new manuscript does not exist in the original list",
  );

  // Check that the stored manuscript matches the original
  t.deepEqual(savedManuscript, testingManuscript,
    "the manuscript that is saved is the same as the original manuscript",
  );
});


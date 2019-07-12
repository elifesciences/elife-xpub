import submission from '../xpub-api/submission';
import { SurveySubmission } from '../generated/graphql';
import { test, TestContext } from 'ava-ts';
import { defaultConfig } from "../xpub-api";
import { v4} from 'uuid';

test("You can submit a survey", async (t: TestContext) => {
  const context = defaultConfig();

  const testData: SurveySubmission = {
    surveyId: "api-tests",
    submissionId: v4(),
    answers: [
      {
        questionId: v4(),
        text: "What's your favourite colour?",
        answer: "Blue",
      }
    ],
  };

  const result = await submission.Mutation.submitSurveyResponse(context, testData);

  t.deepEqual(result, {submitSurveyResponse: true});
});

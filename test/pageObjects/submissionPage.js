import { submission } from './'

export class submissionPage {
  constructor(t) {
    this.t = t
  }

  articleType = {
    reasearchArticle: 'Research Article',
    shortReport: 'Short Report',
    toolsAndResources: 'Tools and Resources',
    scientificCorrespondence: 'Scientific Correspondence',
    featureArticle: 'Feature Article',
  }

  longText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas semper ante sed volutpat tincidunt.\n\n Nullam rutrum tortor in libero cursus, sit amet dictum ex consectetur. In eget quam ac felis suscipit sodales euismod ac urna. Donec varius mollis sapien ac pharetra. Sed non nunc neque.\n\n Aenean at lorem nisi. Etiam tempor, turpis vitae fringilla sodales, ante felis posuere eros, et imperdiet ante nisi vel tellus.'
  shortText = 'Lorem ipsum'

  discussionText = 'Spoke to Bob about another article'
  firstTitle = 'A title'
  secondTitle = 'Another Title'

  async writeTitle(text = this.shortText) {
    await this.t.selectText(submission.title).typeText(submission.title, text)
  }

  async writeTitleIfEmpty(text = this.shortText) {
    const textContent = await submission.title.value
    if (!textContent || textContent.length === 0) {
      await this.writeTitle(text)
    }
  }

  async selectArticleType(option = this.articleType.featureArticle) {
    await this.t.click(submission.articleType)
    await this.t.click(submission.articleTypes.withText(option))
  }

  async selectSubjectAreas(subjects = ['Developmental Biology']) {
    await Promise.all(
      subjects.map(async subject => {
        await this.t.click(submission.subjectAreaSelect)
        await this.t.click(submission.subjectArea.withText(subject))
      }),
    )
  }

  async setDiscussion(text = this.discussionText) {
    await this.t.click(submission.discussionCheckbox)
    await this.t.typeText(submission.discussionText, text)
  }

  async setPreviousArticleBox(text = this.previousArticleText) {
    await this.t.click(submission.previousArticleCheckbox)
    await this.t.typeText(submission.previousArticleText, text)
  }

  async setCoSubmissionBox(
    firstTitle = this.firstTitle,
    secondTitle = this.secondTitle,
  ) {
    await this.t.click(submission.cosubmissionCheckbox)
    await this.t.typeText(submission.firstCosubmissionTitle, firstTitle)
    await this.t.typeText(submission.secondCosubmissionTitle, secondTitle)
  }
}

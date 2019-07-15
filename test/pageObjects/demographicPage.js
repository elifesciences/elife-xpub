import { demographic } from './'

export class demographicPage {
  constructor(t) {
    this.t = t
  }

  async answerQuestion1(text = 'Mars') {
    await this.t
      .selectText(demographic.question1)
      .typeText(demographic.question1, text)
  }

  async answerQuestion2(text = 'Male') {
    await this.t
      .selectText(demographic.question2)
      .typeText(demographic.question2, text)
  }

  async answerQuestion3(text = '1992') {
    await this.t
      .selectText(demographic.question3)
      .typeText(demographic.question3, text)
  }

  async submitAnswers() {
    await this.t.click(demographic.submit)
  }
}

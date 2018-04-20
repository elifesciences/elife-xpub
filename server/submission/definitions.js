const db = require('../db-helpers/')

/**
 * TODO
 * better way to have Manuscript as input type
 * instead of duplicating each type
 *
 * do we need ID in Manuscript?
 */
const typeDefs = `
    extend type Query {
      currentSubmission: Manuscript
    }
    extend type Mutation {
      createSubmission: Manuscript!
      updateSubmission(data: ManuscriptInput!): Manuscript!
    }
    type Manuscript {
      id: ID!
      title: String
      source: String
      submissionMeta: SubmissionMeta!
    }
    input ManuscriptInput {
      id: ID
      title: String
      source: String
      submissionMeta: SubmissionMetaInput
    }
    type SubmissionMeta {
      coverLetter: String
      author: Person
      correspondent: Person
      stage: SubmissionStage
    }
    input SubmissionMetaInput {
      coverLetter: String
      author: PersonInput!
      correspondent: PersonInput
      stage: SubmissionStage!
    }
    type Person {
      firstName: String
      lastName: String
      email: String
      institution: String
    }
    input PersonInput {
      firstName: String
      lastName: String
      email: String
      institution: String
    }
    enum SubmissionStage {
      INITIAL
      QA
    }
`

/* TODO keep this in sync with the schema */
const emptyManuscript = {
  id: '',
  title: '',
  source: '',
  submissionMeta: {
    coverLetter: '',
    author: {
      firstName: '',
      lastName: '',
      email: '',
      insitution: '',
    },
    correspondent: {
      firstName: '',
      lastName: '',
      email: '',
      institution: '',
    },
    stage: 'INITIAL',
  },
}

/**
 * TODO any built-in way to do this?
 * would using an external package like deepmerge
 * https://github.com/KyleAMathews/deepmerge
 * be better here?
 * e.g. we make the app more complex, we add more packages/use more memory
 * vs
 * we might miss to catch some errors
 * it's something easy to do anyway
 *
 * replace with lodash.merge
 */
function applyObj(obj1, obj2) {
  /**
   * applies values from obj2 (can be nested)
   * to "default values"/schema obj1
   * obj1 will have all keys
   */
  const obj3 = { ...obj1 }
  if (typeof obj2 !== 'object') {
    return obj3
  }
  Object.keys(obj3).forEach(key => {
    if (key in obj2) {
      if (typeof obj2[key] === 'object') {
        obj3[key] = applyObj(obj3[key], obj2[key])
      } else {
        obj3[key] = obj2[key]
      }
    }
  })

  return obj3
}

const resolvers = {
  Query: {
    async currentSubmission(_, vars, ctx) {
      // TODO this will throw an error when you click on submit intially
      const manuscript = await db.select({
        'submissionMeta.createdBy': ctx.user,
        'submissionMeta.stage': 'INITIAL',
      })
      return manuscript
    },
  },
  Mutation: {
    async updateSubmission(_, vars, ctx) {
      /**
       * TODO
       * check that manuscript with vars.data.id is actually
       * owned by ctx.user
       *
       * we can get manuscript after id, then check with createdBy
       * or just get current manuscript for ctx.user and save there
       *
       * for now this works - get current submission for ctx.user
       * if none - create new one for the current user
       * else just update
       */
      try {
        const oldManuscript = await db.select({
          'submissionMeta.createdBy': ctx.user,
          'submissionMeta.stage': 'INITIAL',
        })
        // manuscript exists
        // TODO cheap hack to avoid random id injection
        const { id } = oldManuscript
        const manuscript = applyObj(oldManuscript, vars.data)
        manuscript.id = id
        db.update(id, manuscript, ctx)
        return manuscript
      } catch (err) {
        // manuscript is new
        const manuscript = applyObj(emptyManuscript, vars.data)
        const id = await db.save(manuscript, ctx)
        manuscript.id = id
        return manuscript
      }
    },
  },
}

module.exports = { typeDefs, resolvers }

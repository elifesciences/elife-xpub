import React from 'react'
/* import { Formik } from 'formik' */
import { withRouter } from 'react-router-dom'
/* import { Mutation, Query } from 'react-apollo' */
/* import gql from 'graphql-tag' */

/* import AuthorDetails from './AuthorDetails' */
import WithCurrentSubmission from './WithCurrentSubmission'
/* import { schema } from './AuthorDetailsSchema' */

/* const GET_CURRENT_SUBMISSION = gql` */
/*   query { */
/*     currentSubmission { */
/*       id */
/*       title */
/*       submissionMeta { */
/*         author { */
/*           firstName */
/*           lastName */
/*           email */
/*           institution */
/*         } */
/*         correspondent { */
/*           firstName */
/*           lastName */
/*           email */
/*           institution */
/*         } */
/*       } */
/*     } */
/*   } */
/* ` */

/**
 * TODO
 * have a design discussion on how to send form data from frontend
 * entire form vs individual pages at once
 */
/* const UPDATE_SUBMISSION = gql` */
/*   mutation UpdateSubmission($data: ManuscriptInput!) { */
/*     updateSubmission(data: $data) { */
/*       id */
/*       title */
/*       submissionMeta { */
/*         author { */
/*           firstName */
/*           lastName */
/*           email */
/*           institution */
/*         } */
/*         correspondent { */
/*           firstName */
/*           lastName */
/*           email */
/*           institution */
/*         } */
/*       } */
/*     } */
/*   } */
/* ` */

const AuthorDetailsPage = ({ history }) => (
  <WithCurrentSubmission>
    {data => <div>{JSON.stringify(data, null, 2)}</div>}
  </WithCurrentSubmission>
  /*   <Query query={GET_CURRENT_SUBMISSION}> */
  /*     {({ loading, error, data, client }) => { */
  /*         if (loading) return <div>Loading...</div> */

  /*             if (error) { */
  /*                 console.error(error) */
  /*                 return <div>{String(error)}</div> */
  /*             } */

  /*         const TODO = '' */
  /*         return ( */
  /*             <Mutation mutation={UPDATE_SUBMISSION}> */
  /*               {(updateSubmission, _) => ( */
  /*                   <Formik */
  /*                      component={AuthorDetails} */
  /*                      /\** */
  /*                      * stuff should be in submissionMeta.author */
  /*                      * and submissionMeta.correspondent */
  /*                      * */
  /*                      * data.currentSubmission.submissionMeta */
  /*                      *   {author, correspondent} */
  /*                      * */
  /*                      * TODO get data from form */
  /*                      *\/ */
  /*                      // initialValues={data.currentSubmission} */

  /*                      onSubmit={values => */
  /*                                updateSubmission({ */
  /*                                    variables: { */
  /*                                        data: { */
  /*                                            id: TODO, */
  /*                                            title: TODO, */
  /*                                            source: TODO, */
  /*                                            submissionMeta: { */
  /*                                                coverLetter: TODO, */
  /*                                                author: { */
  /*                                                    firstName: TODO, */
  /*                                                    lastName: TODO, */
  /*                                                    email: TODO, */
  /*                                                    institution: TODO, */
  /*                                                }, */
  /*                                                correspondent: { */
  /*                                                    firstName: TODO, */
  /*                                                    lastName: TODO, */
  /*                                                    email: TODO, */
  /*                                                    institution: TODO, */
  /*                                                }, */
  /*                                                stage: 'INITIAL', */
  /*                                            }, */
  /*                                        }, */
  /*                                    }, */
  /*                                    }).then(() => { */
  /*                                        history.push('/submit/upload') */
  /*                                    }) */
  /*                                } */
  /*                                validationSchema={schema} */
  /*                                /> */
  /*               )} */
  /*             </Mutation> */
  /*         ) */
  /*     }} */
  /* </Query> */
)

export default withRouter(AuthorDetailsPage)

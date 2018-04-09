const passport = require('passport')
const OrcidStrategy = require('passport-orcid')
const config = require('config')
const User = require('pubsweet-server/src/models/User')
const authentication = require('pubsweet-server/src/authentication')

const CALLBACK_URL = '/auth/orcid/callback'

module.exports = app => {
  // set up OAuth client
  passport.use(
    new OrcidStrategy(
      {
        scope: '/read-limited',
        callbackURL: config.get('pubsweet-server.baseUrl') + CALLBACK_URL,
        ...config.get('auth-orcid'),
      },
      async (accessToken, refreshToken, params, profile, done) => {
        // convert oauth response into a user object
        let user
        try {
          user = await User.findOneByField('orcid', params.orcid)
        } catch (err) {
          // swallow not found error
          if (err.name !== 'NotFoundError') {
            done(err)
            return
          }
        }

        try {
          if (!user) {
            user = new User({
              username: params.orcid.replace(/-/g, ''),
              orcid: params.orcid,
              oauth: { accessToken, refreshToken },
            })
            await user.save()
          }
        } catch (err) {
          done(err)
          return
        }

        done(null, user)
      },
    ),
  )

  // handle sign in request
  app.get('/auth/orcid', passport.authenticate('orcid'))

  // handle oauth response
  app.get(
    CALLBACK_URL,
    passport.authenticate('orcid', {
      failureRedirect: '/login',
      session: false,
    }),
    (req, res) => {
      const jwt = authentication.token.create(req.user)
      res.redirect(`/login?token=${jwt}`)
    },
  )
}

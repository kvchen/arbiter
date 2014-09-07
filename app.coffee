express    = require "express"

bodyParser = require "body-parser"
passport   = require "passport"
winston    = require "winston"

# Remove logging for tests
winston.remove winston.transports.Console if process.env.NODE_ENV is 'test'


# Define the Express app
app = express()

app.use express.static(__dirname + '/public')
app.use bodyParser.json()

# Define auth middleware
require "./libs/auth"
app.use passport.initialize()
app.use passport.session()

# Initialize templating engine
app.set 'views', __dirname + '/views'
app.set 'view engine', 'jade'

# Define view endpoints
app.get '/', (req, res) ->
  res.render 'index'

oauth2 = require "./libs/oauth2"
app.post "/oauth/token", oauth2.token
app.post "/oauth/test", 
  passport.authenticate("bearer", {session: false}), 
  (req, res) ->
    return res.send "testing!"

environment = require "./routes/environment"
app.post '/api/environment/run', environment.run

module.exports = app
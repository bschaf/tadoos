// Twilio Credentials
var accountSid = 'ACa9faf7e53ef457b20b640cc08b403a02';
var authToken  = '1774b3ffd83a33ac48ab8343880546d4';

var Hapi = require('hapi'),
  twilio = require('twilio')(accountSid, authToken),
  server;

server = new Hapi.Server('localhost', 1337);

server.route([
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: __dirname + '/'
      }
    }
  },
  {
    method: 'POST',
    path: '/sms',
    handler: function(request, reply) {
      var msg = request.payload.name,
        phone = request.payload.phone;

      twilio.messages.create({
        to: phone,
        from: '+14243222542',
        body: "Congrats! You've completed tadoo: " + msg
      }, function(err, data) {
        reply(err || data);
      });
    }
  }
]);

server.start(function() {
  console.log('Server started on ' + server.info.uri + ' @ ' + new Date());
});

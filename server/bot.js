var request = require('request');

module.exports = function(app) {

    //
    // GET /bot
    //
    app.get('/bot', function(request, response) {
        if (request.query['hub.mode'] === 'subscribe' && 
            request.query['hub.verify_token'] === '0C2787D65D83CD914E28B353EB4B2DB1') {            
            console.log("Validating webhook");
            response.status(200).send(request.query['hub.challenge']);
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            response.sendStatus(403);          
        }  
    });

    //
    // POST /bot
    //
    app.post('/bot', function(request, response) {
       var data = request.body;
       console.log('received bot webhook');
        // Make sure this is a page subscription
        if (data.object === 'page') {
            // Iterate over each entry - there may be multiple if batched
            data.entry.forEach(function(entry) {
               var pageID = entry.id;
               var timeOfEvent = entry.time;
                // Iterate over each messaging event
                entry.messaging.forEach(function(event) {
                    if (event.message) {
                        receivedMessage(event);
                    } else if (event.game_play) {
                        receivedGameplay(event);
                    } else {
                        console.log("Webhook received unknown event: ", event);
                    }
                });
            });
        }
        response.sendStatus(200);
    });

    //
    // Handle messages sent by player directly to the game bot here
    //
    function receivedMessage(event) {
      
    }

    //
    // Handle game_play (when player closes game) events here. 
    //
    function receivedGameplay(event) {
        // Page-scoped ID of the bot user
        var senderId = event.sender.id; 

        // FBInstant player ID
        var playerId = event.game_play.player_id; 

        // FBInstant context ID 
        var contextId = event.game_play.context_id;

        // Check for payload
        if (event.game_play.payload) {
            //
            // The variable payload here contains data set by
            // FBInstant.setSessionData()
            //
            var payload = JSON.parse(event.game_play.payload);
            if (payload.firstTime) {
            // In this example, the bot is just "echoing" the message received
            // immediately. In your game, you'll want to delay the bot messages
            // to remind the user to play 1, 3, 7 days after game play, for example.
                sendMessage(senderId, null, "Welcome to swappy world!", "Play now!", payload);   
                setTimeout(function() {
                    sendMessage(senderId, null, "It has been a while since your last game. Time to get back!", "Play now!", payload);   
                }, 1000 * 60 * 60 * 24 * 7);
            }
        }
    }

    //
    // Send bot message
    //
    // player (string) : Page-scoped ID of the message recipient
    // context (string): FBInstant context ID. Opens the bot message in a specific context
    // message (string): Message text
    // cta (string): Button text
    // payload (object): Custom data that will be sent to game session
    // 
    function sendMessage(player, context, message, cta, payload) {
        var button = {
            type: "game_play",
            title: cta
        };

        if (context) {
            button.context = context;
        }
        if (payload) {
            button.payload = JSON.stringify(payload)
        }
        var messageData = {
            recipient: {
                id: player
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [
                        {
                            title: message,
                            image_url: "https://scontent.fsgn5-3.fna.fbcdn.net/v/t1.0-9/32744217_2012470582406064_7781085571765501952_o.png?_nc_cat=0&oh=48492088615d3f269cfd0fda274ca6a1&oe=5BADF05F",
                            buttons: [button]
                        }
                        ]
                    }
                }
            }
        };

        callSendAPI(messageData);

    }

    function callSendAPI(messageData) {
    var graphApiUrl = 'https://graph.facebook.com/me/messages?access_token=EAAL0ZCZCwcNjIBADlZCIHaAkb5wQveGDUXzPKdj3xIdj8AIOeiDUoTB9fVdvF2bblyJ6O9yIZBatKPyq3rmfDWdpNVpCccleKoqutZBkBYulYsAh5wELow9VocURjOVCtLqolMIP11ul5n1CMeA5HUWmDXWQxICMkzhvyy6MQ2kzFHbXNDRy1'
        request({
            url: graphApiUrl,
            method: "POST",
            json: true,  
            body: messageData
        }, function (error, response, body){
            console.error('send api returned', 'error', error, 'status code', response.statusCode, 'body', body);
        });
    }

}
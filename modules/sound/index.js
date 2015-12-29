var Datastore = require('nedb');
var soundDb = new Datastore({
   filename: './datastores/sound.db',
   autoload: true 
});

var S = require('string');

var disconnect = require('./modules/disconnect');
var stopAudio = require('./modules/stopaudio');
var soundFileupload = require('./modules/fileupload');
var listSounds = require('./modules/list-sounds');
var playSound = require('./modules/play-sound');

var sound = function(Config, bot, channelID, message, rawEvent) {
    if (S(message).contains("!sound=")) {
        bot.sendMessage({
            to: channelID,
            message: "Getting ready to play..."
        }, function() {
            var splitMessage = message.split('=');
            var inviteCode = splitMessage[1];
            bot.acceptInvite(inviteCode, function(response) {
                var voiceChannelID = response.channel.id;
                bot.joinVoiceChannel(voiceChannelID, function() {
                    var data = {
                        enabled: true,
                        voiceChannelID: voiceChannelID
                    };
                    soundDb.insert(data, function (err, newDoc) {
                        // 
                    });
                });
            });
        });
    } else {
        // Modules
        soundDb.find({ enabled: true }, function (err, data) {
            if (data.length > 0) {
                var voiceChannelID = data[0].voiceChannelID;
                stopAudio(bot, channelID, message, voiceChannelID);
                disconnect(soundDb, bot, channelID, message, voiceChannelID);
                playSound(S, bot, channelID, message, voiceChannelID);
            }
        });
    }

    soundFileupload(bot, channelID, rawEvent);
    listSounds(Config, bot, channelID, message);
}

module.exports = sound;

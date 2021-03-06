var lastseenDb = require('./lastseenDb');

var _ = require('underscore');
var S = require('string');
var moment = require('moment');

var lastseen = function (bot) {
	setInterval(function () {
		// Check the users that are online, Update the DB
		var connectedServers = bot.servers;
		_.each(connectedServers, function (server) {
			var members = server.members;
			_.each(members, function (member) {
				if (lastseenDb.find({
					discordUserId: member.user.id,
				}, function (err, discordUser) {
					var data;

					if (member.status) {
						data = {
							discordUserId: member.user.id,
							status: member.status,
							lastseen: moment().format(),
						};
					} else {
						data = {
							discordUserId: member.user.id,
							status: 'offline',
						};
					}

					if (S(discordUser).isEmpty()) {
						lastseenDb.insert(data, function (err, newData) {});
					} else {
						lastseenDb.update(
							{ discordUserId: member.user.id },
							{ $set: data },
							{}
						);
					}
				}));
			});
		});
	}, 1000);
};

module.exports = lastseen;

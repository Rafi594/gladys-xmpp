const XMPPBot = require('node-xmpp');
const shared = require('./shared.js');

module.exports = function init(){
    return gladys.param.getValues(['XMPP_ROOM_URL'])
        .spread((xmppRoomUrl) => {

            shared.telegramApiKey = telegramApiKey;

            if(webhookUrl === 'POLLING'){
                shared.bot = new XMPPBot(xmppRoomUrl, {polling: true, interval: 500});
            } else {
                shared.bot = new XMPPBot(xmppRoomUrl);
                shared.bot.setWebHook(webhookUrl);
            }

            shared.bot.on('message', msg => {
                sails.log.debug(`XMPP : Received message on chat ID = ${msg.chat.id}, from = "${msg.from.first_name} ${msg.from.last_name}" with content = "${msg.text}"`);

                gladys.param.getValue(`XMPP_ROOM_URL_${msg.chat.id}_USER`)
                    .then((value) => {

                        // get the user
                        return gladys.user.getById({id: value});
                    })
                    .then((user) => {

                        // sending the message
                        return gladys.message.send(user, {text: msg.text});
                    })
                    .catch(() => {
                        sails.log.warn(`XMPP : Conversation not linked to a user in Gladys.`);
                        sails.log.warn(`Create a param in Gladys "XMPP_ROOM_URL_${msg.chat.id}_USER" with in value the ID of your user in Gladys`);
                    });
            });

            shared.bot.on('webhook_error', (error) => {
                sails.log.warn(`XMPP : Room error : ${error}`);
            });


        })
};

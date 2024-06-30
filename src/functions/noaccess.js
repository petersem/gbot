
const { Client, 
    Collection, 
    Events, 
    IntentsBitField, 
    Guild, 
    messageLink, 
    GatewayIntentBits,
    time,
    TimestampStyles} = require('discord.js');


require('dotenv').config();


//const { token } = require('./config.json');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMembers
    ]
});

class NoAccess {
    constructor() {
        return;
    }

    static async ListNoAccess(i) {
        const c = i.client;
        let output = '## Users who have not accepted the group rules\n'
        const cGuild = c.guilds.resolve(i.guildId);
        // console.log(cGuild.memberCount);
        const mems = await cGuild.members.fetch()
            // .then(console.log)
            .catch(console.error);
        //console.log('Total: ' + (await list.members.fetch()));
        let membersArray = [];
        mems.forEach(mem => {
            // console.log(new Date(mem.joinedTimestamp).valueOf / 1000);

            const memObj = {};
            let roleCount = 0;
            // console.log(`
            // ID: ` + mem.user.id + `
            // User Name: ` + mem.user.username + `   
            // Global Name: ` + mem.user.globalName );
            //memObj.id = mem.user.id;
            memObj.nickName = mem.nickname;
            memObj.userName = mem.user.username;
            memObj.globalName = mem.user.globalName;
            memObj.joinedAt = mem.joinedAt;
        //    throw 1;
            // const joinDate = new Date(mem.joinedTimestamp * 1000);
            // const timeString = joinDate;
            
            let d = new Date(mem.joinedAt);
            memObj.joinedAt = d.toLocaleDateString();

            let roleArray = [];
            const memRoles = mem.roles.cache.map(role => {
                let roleObj = {};
                // ?            console.log(`            ` + role.name);
                roleCount += 1;
                roleObj.name = role.name;
                roleArray.push(roleObj);
            })
            memObj.roleCount = roleCount;
            memObj.roles = roleArray;
            // console.log(`        Number of roles: ` + roleCount);
            membersArray.push(memObj);
        });
        // console.log(membersArray);
        // console.log(membersArray.roles);

        membersArray.forEach(mem => {
            if (mem.roleCount == 1) {
                //        console.log(mem);
                output += '**Nickname:** ' + mem.globalName + '\n**Global Name:** ' + mem.globalName + '\n**Username:** ' + mem.userName + '\n**Joined:** ' + mem.joinedAt + '\n\n';
            }
        })
        //console.log(output);
        return await Promise.resolve(output);
    }

}

module.exports = NoAccess;
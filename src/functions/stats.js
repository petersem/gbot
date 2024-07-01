const mysql = require('mysql2');


// const { Client, 
//     Collection, 
//     Events, 
//     IntentsBitField, 
//     Guild, 
//     messageLink, 
//     GatewayIntentBits,
//     time,
//     TimestampStyles} = require('discord.js');


require('dotenv').config();


//const { token } = require('./config.json');

// const client = new Client({
//     intents: [
//         IntentsBitField.Flags.Guilds,
//         IntentsBitField.Flags.GuildMembers,
//         IntentsBitField.Flags.GuildMessages,
//         IntentsBitField.Flags.MessageContent,
//         IntentsBitField.Flags.GuildMembers
//     ]
// });

class Stats {
    constructor() {
        return;
    }

    static async Channels() {

        // connecting Database
		const con = mysql.createConnection({
			host: process.env.GBOT_DB_SERVER,
			user: process.env.GBOT_USER,
			port: process.env.GBOT_DB_PORT,
			password: process.env.GBOT_PSW,
			database: process.env.GBOT_DB,
		});


		con.connect(function(err) {
			if (err) throw err;

            console.log("Connected!");
			let sql = `SELECT COUNT(name) AS Count, channel
FROM traffic
GROUP BY channel`;
            let msg = "";
            con.query(sql, function (err, result) {
				if (err) throw err;
				msg = `## Channel Message Count\n`
				result.forEach(element => {
					msg += element.Count + `    ` + element.channel + `\n`
                    console.log(element.Count + `    ` + element.channel);
				});
                console.log(msg);
			})
            .then( res => {
                return res;                
            }
                
            );
		});


    }

}

module.exports = Stats;
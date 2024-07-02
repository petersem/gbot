const { Client, Collection, Events, IntentsBitField, Guild, messageLink, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2');

//const { token } = require('./config.json');
//const { noac } = require('./functions/noaccess.js');
const { deploy } = require('./deploy-commands.js');
const Deploy = require('./deploy-commands.js');
let personCounter = [];

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMembers
	]
});

//console.log(process.env.GBOT_DB_SERVER,process.env.GBOT_USER,process.env.GBOT_DB_PORT,process.env.GBOT_PSW,process.env.GBOT_DB);

// connecting Database
const connection = mysql.createPool({
    host: process.env.GBOT_DB_SERVER,
    user: process.env.GBOT_USER,
	port: process.env.GBOT_DB_PORT,
    password: process.env.GBOT_PSW,
    database: process.env.GBOT_DB,
  });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`********* GROKBOT STARTED *********`);
	console.log(` - GrokBot logged in as ${readyClient.user.tag}`);
	const dep = new Deploy();
//	console.log(client.user.id);

	dep.UpdateSlashCmds(process.env.CLIENT_ID, process.env.GUILD_ID);
});


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);

		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return;

	if (message.guild) {

// 		//if (message.content.startsWith('mjp')) {
// 		//console.log(personCounter);
// 		//console.log('-------------------------');
// 		var foundIndex = personCounter.findIndex(arrayItem => ((arrayItem.name == message.author.username) && (arrayItem.channel == message.channel.name)));
// 		if (foundIndex != -1) {
// 			//				console.log('found!!');
// 			//				console.log('Index: ' + foundIndex);
// 			//				console.log(personCounter[foundIndex]);
// 			personCounter[foundIndex].messageCount++
// //			console.log(personCounter[foundIndex]);
// 		}
// 		else {
// 			// create a new array entry with a count of 1
// 			var newPerson = { "channel": message.channel.name, "name": message.author.username, "messageCount": 1 }
// 			personCounter.push(newPerson);
// 			//console.log('Added new person to data: ' + message.author.username);
// 		}
// console.log(personCounter);
		let d = new Date();
		let nameToUse = "";
		if (message.member.nickname != null)
			{nameToUse=message.member.nickname}
		else if (message.author.globalName != null)
			{nameToUse=message.author.globalName}
		else 
			{nameToUse=message.author.username}

		//console.log(message.member.nickname,message.author.globalName,message.author.username);
		const [{ insertId }] = await connection.promise().query(
			`INSERT INTO traffic (logged_date, guild_id, name, channel) 
          		VALUES (?, ?, ?, ?)`,
				[d, message.guildId, nameToUse, message.channel.name]
		  );

		// console.log(personCounter);

		// let d = new Date();
		// console.log(d.toUTCString());
		// fs.unlinkSync('src/data/' + 'xx' + '.json');

		// var writeStream = fs.createWriteStream('src/data/' + 'xx' + '.json');
		// writeStream.write(JSON.stringify(personCounter));
		// writeStream.end();

	}


});




client.login(process.env.TOKEN);



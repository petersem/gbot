const { SlashCommandBuilder } = require('discord.js');
const mysql = require('mysql2');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Provides statistics of the server.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild

		// connecting Database
		const con = mysql.createConnection({
			host: process.env.GBOT_DB_SERVER,
			user: process.env.GBOT_USER,
			port: process.env.GBOT_DB_PORT,
			password: process.env.GBOT_PSW,
			database: process.env.GBOT_DB,
		});

		let output = "";

		con.connect(function(err) {
			if (err) throw err;
			console.log("Connected!");
			let sql = `SELECT COUNT(name) AS Count, channel
FROM traffic
GROUP BY channel`;
			con.query(sql, function (err, result) {
				if (err) throw err;
				output = `## Channel Message Count\n`
				result.forEach(element => {
					output+= element.Count + `    ` + element.channel + `\n`
				});

			  	// interaction.reply(output);
				//interaction.reply({content: output, ephemeral: true});

			});

			sql = `SELECT COUNT(name) as count, name
FROM traffic
GROUP BY name
ORDER BY COUNT(name) DESC
LIMIT 5`;
						con.query(sql, function (err, result) {
							if (err) throw err;
							output += `\n## Top 5 Users by Message Count\n`
							result.forEach(element => {
								output+= element.count + `    ` + element.name + `\n`
							});
			
							  // interaction.reply(output);
							interaction.reply({content: output, ephemeral: true});
			
						});
		  });



	},
};
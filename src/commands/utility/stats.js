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
			//console.log("Connected!");
			let sql = `SELECT COUNT(name) as count, channel
FROM traffic
WHERE logged_date >= ( CURDATE() - INTERVAL 7 DAY )
AND channel <> '🪳-tech-testing'
AND channel <> '👋-lobby'
GROUP BY channel
ORDER BY count DESC`;
			con.query(sql, function (err, result) {
				if (err) throw err;
				output = `## Channel Message Count (7 days)\n`
				result.forEach(element => {
					output+= `${element.count.toString().padEnd(5)}` + element.channel + `\n`
				});

			  	// interaction.reply(output);
				//interaction.reply({content: output, ephemeral: true});

			});

			sql = `SELECT COUNT(name)as count, name
FROM traffic
WHERE logged_date >= ( CURDATE() - INTERVAL 1 DAY )
AND channel <> '🪳-tech-testing'
GROUP BY name
ORDER BY COUNT(name) DESC
LIMIT 10`;
						con.query(sql, function (err, result) {
							if (err) throw err;
							output += `\n## Top 10 Users by Message Count (7 days)\n`
							result.forEach(element => {
								output+= `${element.count.toString().padEnd(5)}` + element.name + `\n`
							});
			
							  // interaction.reply(output);
							interaction.reply({content: output, ephemeral: true});
			
						});
		  });



	},
};
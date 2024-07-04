const { SlashCommandBuilder } = require('discord.js');
const mysql = require('mysql2');
const ChartJSImage = require('chart.js-image');

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



		con.connect(function (err) {
			if (err) throw err;
			//console.log("Connected!");
			let output = "";
			// count for messages in channels
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
					output += `${element.count.toString().padEnd(5)}` + element.channel + `\n`
				});

				// interaction.reply(output);
				//interaction.reply({content: output, ephemeral: true});

			});

			// count for messages in week
			sql = `SELECT COUNT(name)as count, name
FROM traffic
WHERE logged_date >= ( CURDATE() - INTERVAL 7 DAY )
AND channel <> '🪳-tech-testing'
GROUP BY name
ORDER BY COUNT(name) DESC
LIMIT 10`;
			con.query(sql, function (err, result) {
				if (err) throw err;
				output += `\n## Top 10 Users by Message Count (7 days)\n`
				result.forEach(element => {
					output += `${element.count.toString().padEnd(5)}` + element.name + `\n`
				});

				// interaction.reply(output);
				//interaction.reply({ content: output, ephemeral: true });

			});

			// count for days of week
			sql = `SELECT COUNT(name)as count, DAY(joined_date) as day
FROM joined
WHERE joined_date >= ( CURDATE() - INTERVAL 1 MONTH )
GROUP BY day
ORDER BY joined_date ASC`;
			con.query(sql, function (err, result) {
				if (err) throw err;
				output += `\n## Number of new members (Monthly)\n`
				var labels=[];
				var data=[];
				let total = 0
				result.forEach(element => {
//					output += `Day of month: ${element.day.toString().padEnd(5)} - New members: ${element.count.toString().padEnd(5)}` + `\n`
					labels.push(element.day.toString());
					data.push(element.count.toString());
					total += element.count;
				});
				output += 'Total new members: ' + total;
				output += `\n`;

				// interaction.reply(output);
				//interaction.reply({ content: output, ephemeral: true });


				//--------------------

				const line_chart = ChartJSImage().chart({
					"type": "line",
					"data": {
						"labels": labels,
						"datasets": [
							{
								"label": "Member Growth",
								"borderColor": "rgb(54, 162, 235)",
								"backgroundColor": "rgba(54, 162, 235, .5)",
								"data": data
							}
						]
					},
					"options": {
						"title": {
							"display": true,
							"text": "ALIVE Movement"
						},
						"scales": {
							"xAxes": [
								{
									"scaleLabel": {
										"display": true,
										"labelString": "Day of Month"
									}
								}
							],
							"yAxes": [
								{
									"stacked": true,
									"scaleLabel": {
										"display": true,
										"labelString": "Number of People"
									}
								}
							]
						}
					}
				}) // Line chart
					.backgroundColor('white')
					.width(500) // 500px
					.height(300); // 300px

				line_chart.toFile('./download/chart.png')
					.then(() => interaction.reply({content: output, files: ['./download/chart.png'], ephemeral: true })); // Promise<()>
				//interaction.reply({content: output, files: ['./download/chart.png'], ephemeral: true });

				// ----------------------
			});
		});

	},
};
const { SlashCommandBuilder } = require('discord.js');
const AllUsers = require('../../functions/allusers.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('allusers')
		.setDescription('Lists all users and their roles'),
	async execute(interaction) {
		const OUTPUT = await Promise.resolve(AllUsers.ListAll(interaction));
		//await interaction.reply({ content: OUTPUT, ephemeral: true });
		//Write multiple files asynchronously
		fs.writeFileSync("./download/allusers.txt", OUTPUT);
            // .then()
            // .catch(console.error);


		await interaction.reply({
			content:
				`All server members`,
			files: ['./download/allusers.txt'],
			ephemeral: true 
		}).catch((err) => {
			 console.log("Error during Export File " + err);
		});


		let d = new Date();
		console.log(d.toLocaleString() + '    /allusers command called by ' + interaction.user.username);
	},
};

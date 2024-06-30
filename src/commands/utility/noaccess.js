const { SlashCommandBuilder } = require('discord.js');
const noac = require('../../functions/noaccess.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('noaccess')
		.setDescription('Shows who has not agreed to group rules'),
	async execute(interaction) {
		const OUTPUT = await Promise.resolve(noac.ListNoAccess(interaction));
		await interaction.reply({ content: OUTPUT, ephemeral: true });
		let d = new Date();
		console.log(d.toLocaleString() + '    /noaccess command called by ' + interaction.user.username);
	},
};

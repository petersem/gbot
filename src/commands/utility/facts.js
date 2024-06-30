const { SlashCommandBuilder } = require('discord.js');

const { facts } = require('../../data/facts.json');
//import facts from '../../data/facts.json' assert { type: 'json' };
// let facts = fetch('../../data/facts.json')
//     .then((response) => response.json())
//     .then((json) => console.log(json));

	

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fact')
		.setDescription('Serves a random vaping fact :)'),

	async execute(interaction) {

		let rndIndex = Math.floor(Math.random() * facts.length);

		await interaction.reply({ content: facts[rndIndex].fact, ephemeral: true });
		let d = new Date();
		console.log(d.toLocaleString() + '    /facts command called by ' + interaction.user.username);
	},
};

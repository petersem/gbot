const { insults } = require('../../data/insults.json');

const { SlashCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('insult')
		.setDescription('Generate an insult for your favourite anti-vaper. Only you will see the output.')
		.addStringOption(option =>
			option.setName('person')
				.setDescription('Just some text for the name of someone you want create an insult for.')
				.setRequired(true)
				.addChoices(
					{ name: 'Albanese', value: 'Elbow, '},
					{ name: 'Butler', value: 'Butthole, '},
					{ name: 'Chapman', value: 'Chapman, '},
					{ name: 'Davey', value: 'Melissa, '},
					{ name: 'Freeman', value: 'Becky, '},
					{ name: 'Hunt', value: 'G-Hunt, '},
					{ name: 'Sandro', value: 'Sandro, '},
					{ name: 'Slevin', value: 'Terry, '},
					{ name: 'Sweet', value: 'Mel, '},
					{ name: 'Tahir', value: 'Tahir, '}
				)
			),

	async execute(interaction) {
		const person = interaction.options.getString('person')
		let rndIndex = Math.floor(Math.random() * insults.length);

		await interaction.reply({ content: '\n' + person + insults[rndIndex].insult, ephemeral: true })

    	let d = new Date();
		console.log(d.toLocaleString() + '    /insult command called by ' + interaction.user.username);

	},
};



const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Lists and explains GrokBot commands'),

	async execute(interaction) {
		let output = `
## GrokBot Commands 
> ***ONLY YOU*** *will see the results of all of these commmands*

**/fact** 
- Sends you a random vaping fact
**/help** 
- Generates this message
**/insult** *person*
- Displays a random **NSFW** insult for your favourite selected anti-vaper
**/stats** 
- Shows channel and user stats for last 7 (rolling) days 

**/allusers** \`Restricted Access\`
- Lists all people on the ALIVE serer.
**/noaccess** \`Restricted Access\`
- Lists all people who have not agreed to the group rules. 
`
		await interaction.reply({ content: output, ephemeral: true });
		let d = new Date();
		console.log(d.toLocaleString() + '    /help command called by ' + interaction.user.username);
	},
};

import { createEmbed, brBuilder } from "@magicyan/discord";
import { app } from "#app/index.js";
import { getWebhookAndUser, author, sendToWebhook } from "#functions";

export async function GuildMemberAdd() {
  app.on('guildMemberAdd', async (member) => {
    const userConfig = await getWebhookAndUser(member.user.id);
    if (!userConfig) return;

    const { webhookUrl } = userConfig;

    const serverInviteUrl = member.guild.vanityURLCode
      ? `https://discord.gg/${member.guild.vanityURLCode}`
      : `https://discord.gg/${member.guild.id}`;

    const embed = new createEmbed({
      author: author(member.user),
      description: brBuilder(
        `**Usuário:** <@${member.user.id}> \`(${member.user.id})\`\n\n`,
        `**Entrou no servidor:** ${member.guild.name}\n`,
        `\`(${member.guild.id})\`\n\n`,
        `**Server URL:** ${serverInviteUrl}`,
        `**Horário:** <t:${Math.floor(Date.now() / 1000)}:F>`
      ),
      color: "#2c2c34",
      timestamp: new Date(),
      thumbnail: member.user.displayAvatarURL(),
    });

    await sendToWebhook(webhookUrl, embed);
  });
}

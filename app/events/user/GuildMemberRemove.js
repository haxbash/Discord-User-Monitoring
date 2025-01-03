import { app } from "#app/index.js";
import { author, getWebhookAndUser, sendToWebhook } from "#functions";
import { brBuilder, createEmbed } from "@magicyan/discord";

export async function GuildMemberRemove() {
  app.on('guildMemberRemove', async (member) => {

    const monitoredUser = await getWebhookAndUser(member.user.id);
    if (!monitoredUser) return;

    const { webhookUrl } = monitoredUser;

    const serverInviteUrl = member.guild.vanityURLCode
    ? `https://discord.gg/${member.guild.vanityURLCode}`
    : `https://discord.gg/${member.guild.id}`;

    const embed = new createEmbed({
      author: author(member.user),
      description: brBuilder(
        `**Usuário:** <@${member.user.id}> \`(${member.user.id})\`\n\n`,
        `**Saiu do servidor:** ${member.guild.name} \`(${member.guild.id})\`\n\n`,
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

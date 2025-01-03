import { app } from "#app/index.js";
import { author, getWebhookAndUser, sendToWebhook } from "#functions";
import { brBuilder, createEmbed } from "@magicyan/discord";

export async function VoiceStatusUpdate() {
  app.on('voiceStateUpdate', async (oldState, newState) => {
    const userConfig = await getWebhookAndUser(newState.id);
    if (!userConfig) return;

    const { webhookUrl } = userConfig;
    const serverInviteUrl = newState.guild.vanityURLCode
      ? `https://discord.gg/${newState.guild.vanityURLCode}`
      : `https://discord.gg/${newState.guild.id}`;

    const actionType = newState.channel ? "join" : oldState.channel && !newState.channel ? "leave" : null

    switch (actionType) {
      case "join": {
        const members = newState.channel.members
          .map((member) => `> <@${member.user.id}> \`(${member.user.id})\``)
          .join("\n");

        const embed = new createEmbed({
          author: author(newState.member.user),
          title: `${newState.member.user.tag} Entrou em call.`,
          description: brBuilder(
            `**Usuário:** <@${newState.member.user.id}> \`(${newState.member.user.id})\``,
            `**Canal:** ${newState.channel.name} <#${newState.channel.id}> \`(${newState.channel.id})\`\n\n`,
            `**Server URL:** ${serverInviteUrl}\n`,
            `**Membros na call:**\n${members}`
          ),
          color: "#2c2c34",
          timestamp: new Date(),
          thumbnail: newState.member.user.displayAvatarURL(),
        });

        await sendToWebhook(webhookUrl, embed);
        return;
      }

      case "leave": {
        const oldChannelId = oldState.channelId;
        const oldChannelName = oldState.channel.name;

        const embed = new createEmbed({
          author: author(newState.member.user),
          title: `${newState.member.user.username} Saiu da call.`,
          description: brBuilder(
            `**Usuário:** <@${newState.member.user.id}> \`(${newState.member.user.id})\``,
            `**Server URL:** ${serverInviteUrl}\n`,
            `**Canal:** ${oldChannelName} <#${oldChannelId}> \`(${oldChannelId})\``
          ),
          color: "#2c2c34",
          timestamp: new Date(),
          thumbnail: newState.member.user.displayAvatarURL(),
        });

        await sendToWebhook(webhookUrl, embed);
        return;
      }
    }
  });
}

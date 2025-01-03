import { app } from "#app/index.js";
import { author, getWebhookAndUser, sendToWebhook } from "#functions";
import { brBuilder, createEmbed } from "@magicyan/discord";

export async function MessageDelete() {
 app.on('messageDelete', async (message) => {
  if (!message || !message.author || message.author.bot || !message.guild) return;

  const userConfig = await getWebhookAndUser(message.author.id);
  if (!userConfig) return;

  const { webhookUrl } = userConfig;

  const messageContent = message.content || "*Nenhum conteúdo*";

  const serverInviteUrl = message.guild.vanityURLCode
   ? `https://discord.gg/${message.guild.vanityURLCode}`
   : `https://discord.gg/${message.guild.id}`;

  const embed = createEmbed({
   author: author(message.author),
   title: `${message.author.username} deletou uma mensagem.`,
   description: brBuilder(
    `**Usuário:** <@${message.author.id}> \`(${message.author.id})\``,
    `**Canal:** <#${message.channel.id}> \`(${message.channel.id})\``,
    `**Server URL:** ${serverInviteUrl}\n\n`,
    `**Mensagem Deletada:**\n\`\`\`${messageContent}\`\`\``
   ),
   color: "#2c2c34",
   timestamp: new Date(),
   thumbnail: message.author.displayAvatarURL({ dynamic: true }),
  });

  await sendToWebhook(webhookUrl, embed);
 });
}

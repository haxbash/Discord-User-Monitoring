import { app } from "#app/index.js";
import { author, getWebhookAndUser, sendToWebhook } from "#functions";
import { brBuilder, createEmbed } from "@magicyan/discord";

export async function MessageCreate() {
    app.on('messageCreate', async (message) => {
        if (!message.author || message.author.bot) return;

        const userConfig = await getWebhookAndUser(message.author.id);
        if (!userConfig) return;

        const { webhookUrl } = userConfig;

        let messageContent = message.content || "(Sem conteúdo)";
        let imageUrl = "";

        if (message.attachments.size > 0) {
            message.attachments.forEach(attachment => {
                if (attachment.contentType && (attachment.contentType.startsWith('image/') || attachment.contentType.startsWith('video/'))) {
                    imageUrl = attachment.url;
                }
            });
        }

        const serverInviteUrl = message.guild.vanityURLCode
            ? `https://discord.gg/${message.guild.vanityURLCode}`
            : `https://discord.gg/${message.guild.id}`;

        const embed = new createEmbed({
            author: author(message.author),
            title: `${message.author.username} Enviou uma mensagem.`,
            description: brBuilder(
                `**Usuário:** <@${message.author.id}> \`(${message.author.id})\``,
                `**Canal:** <#${message.channel.id}> \`(${message.channel.id})\`\n\n`,
                `**Server URL:** ${serverInviteUrl})`
                `**Mensagem:**\n\`\`\`${messageContent}\`\`\``,
            ),
            color: "#2c2c34",
            timestamp: new Date(),
            thumbnail: message.author.displayAvatarURL(),
        });

        if (imageUrl) {
            embed.setImage(imageUrl);
        }

        await sendToWebhook(webhookUrl, embed);
    });
}

import { app } from "#app/index.js";
import { author, getWebhookAndUser, sendToWebhook } from "#functions";
import { brBuilder, createEmbed } from "@magicyan/discord";

export async function MessageUpdate() {
    app.on('messageUpdate', async (oldMessage, newMessage) => {
        if (!oldMessage || !newMessage) return;
        if (newMessage.author.bot) return;

        const userConfig = await getWebhookAndUser(newMessage.author.id);
        if (!userConfig) return;

        const { webhookUrl } = userConfig;

        const oldContent = oldMessage.content || "*[Sem conteúdo anterior]*";
        const newContent = newMessage.content || "*[Mensagem excluída ou sem conteúdo]*";

        const serverInviteUrl = newMessage.guild.vanityURLCode
            ? `https://discord.gg/${newMessage.guild.vanityURLCode}`
            : `https://discord.gg/${newMessage.guild.id}`;

        const embed = createEmbed({
            author: author(newMessage.author),
            description: brBuilder(
                `**Usuário:**\n<@${newMessage.author.id}> \`(${newMessage.author.id})\``,
                `**Canal:** <#${newMessage.channel.id}> \`(${newMessage.channel.id})\``,
                `**Server URL:** ${serverInviteUrl}\n\n`,
                `**Mensagem Editada:**`,
                `**Antiga:**\n\`\`\`${oldContent}\`\`\``,
                `**Nova:**\n\`\`\`${newContent}\`\`\``
            ),
            color: "#2c2c34",
            timestamp: new Date(),
            thumbnail: newMessage.author.displayAvatarURL({ dynamic: true }),
        });

        await sendToWebhook(webhookUrl, embed);
    });
}

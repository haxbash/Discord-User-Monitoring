import { WebhookClient } from "discord.js";

export async function sendToWebhook(webhookUrl, body) {
    const hook = new WebhookClient({ url: webhookUrl })
    await hook.send({
        embeds: [body]
    }).catch(e => console.error(e))
}
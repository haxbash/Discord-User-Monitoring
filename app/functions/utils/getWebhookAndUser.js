import config from "../../../config.json" assert { type: 'json' };

export async function getWebhookAndUser(userId) {
    const monitoredUsers = config.users;
    return monitoredUsers.find(user => user.userId === userId) || null;
}

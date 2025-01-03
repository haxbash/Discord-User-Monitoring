import request from "request-promise-native"

export async function checkToken(token) {
    try {
        const data = await request.get({
            url: `https://discord.com/api/v10/users/@me`,
            headers: { Authorization: token },
            json: true,
        });
        return { id: data.id, username: data.username };
    } catch (error) {
        if (error.statusCode === 401) {
            return null;
        } else {
            throw error;
        }
    }
}
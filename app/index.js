import * as monitoring from "#events";
import { selfLogin } from "#functions";
import { Client } from "discord.js-selfbot-v13";
import config from "../config.json" assert { type: 'json' };

export const app = new Client({ checkUpdate: false })

async function dust2() {
    await monitoring.MessageCreate()
    await monitoring.MessageUpdate()
    await monitoring.MessageDelete()

    await monitoring.GuildMemberAdd()
    await monitoring.GuildMemberRemove()

    await monitoring.VoiceStatusUpdate()
}

(async () => {
    await dust2();
    await selfLogin(config.app.tokens);
})();

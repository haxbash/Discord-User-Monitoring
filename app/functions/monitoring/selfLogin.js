import { app } from "#app/index.js";
import ck from "chalk";
import { checkToken } from "#functions";

function censorToken(token) {
    return `${token.slice(-6)}*******${token.slice(0, 8)}`;
}

export async function selfLogin(tokens) {
    console.clear()
    for (let j = 0; j < tokens.length; j++) {
        try {
            const valid = await checkToken(tokens[j]);
            if (!valid) {
                console.log(ck.yellow.bold(`Token ${j + 1} (${censorToken(tokens[j])}): `) + ck.red("Invalid token. Skipping..."));
                continue;
            }
            tokens[j] = tokens[j].replace(/["']/g, "");
            await app.login(tokens[j]);
            console.log(ck.green.bold(`Token ${j + 1} `) + ck.yellow.bold(`(${censorToken(tokens[j])}): `) + ck.blue("Logged in successfully!"));
        } catch (error) {
            console.error(ck.red.bold(`Token ${j + 1} (${censorToken(tokens[j])}): `) + ck.yellow("Failed to log in. ") + ck.orange(error.message));
        }
    }
}

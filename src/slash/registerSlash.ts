import { BeccaInt } from "../interfaces/BeccaInt";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { REST } from "@discordjs/rest";
import { APIApplicationCommandOption, Routes } from "discord-api-types/v9";
import { beccaLogHandler } from "../utils/beccaLogHandler";

export const registerSlash = async (Becca: BeccaInt): Promise<boolean> => {
  try {
    const rest = new REST({ version: "9" }).setToken(Becca.configs.token);

    const commandData: {
      name: string;
      description: string;
      options: APIApplicationCommandOption[];
    }[] = [];

    Becca.slash.forEach((command) => commandData.push(command.data.toJSON()));
    if (process.env.NODE_ENV === "production") {
      beccaLogHandler.log("debug", "registering commands globally!");
      await rest.put(Routes.applicationCommands(Becca.configs.id), {
        body: commandData,
      });
    } else {
      beccaLogHandler.log("debug", "registering to home guild only");
      await rest.put(
        Routes.applicationGuildCommands(
          Becca.configs.id,
          Becca.configs.homeGuild
        ),
        { body: commandData }
      );
    }
    return true;
  } catch (err) {
    await beccaErrorHandler(Becca, "slash command register", err);
    return false;
  }
};

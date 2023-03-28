import { Client, GatewayIntentBits, Collection, PermissionFlagsBits,} from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits
const client = new Client({intents:[Guilds, MessageContent, GuildMessages, GuildMembers]})
import { Command, SlashCommand } from "./types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { Configuration, OpenAIApi } from "openai";
config()

const configuration = new Configuration({
    organization: process.env.OPEN_ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const openai = new OpenAIApi(configuration);
  
  //check for messeges


client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    require(`${handlersDir}/${handler}`)(client)
})

client.on('messageCreate' , async function(message){
    //@ts-ignore
   if (message.channel.name == ("chatbot"))  {
    try{
        if(message.author.bot) return;
        message.channel.sendTyping();
        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt: `Hello, I'm chatbot based on Openai GPT-3 API\n${message.content}`,
            temperature:0.9,
            max_tokens:400,
        });
        console.log(`${response.data.choices[0].text}`);
        if (response.data.choices[0].text && response.data.choices[0].text.trim() !== '') {
                message.reply(`${response.data.choices[0].text}`);
        }
        return;
    }catch(e){
        console.log(e)
    }
  }});
  

client.login(process.env.TOKEN)
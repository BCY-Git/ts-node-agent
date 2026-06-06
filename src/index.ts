import { ChatOpenAI } from "./ChatOpenAI.js";

async function main(){
    const llm = new ChatOpenAI('deepseek-v4-flash', 'You are a helpful assistant.')
    const { content, tool_calls } = await llm.chat('你好')
    console.log(content);
    console.log(tool_calls);
}

main()

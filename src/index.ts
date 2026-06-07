import { ChatOpenAI } from "./ChatOpenAI.js";
import { MCPClient } from "./MCPClient.js";

// async function main(){
//     const llm = new ChatOpenAI('deepseek-v4-flash', 'You are a helpful assistant.')
//     const { content, tool_calls } = await llm.chat('你好')
//     console.log(content);
//     console.log(tool_calls);
// }

async function main(){
    const fetchMCP = new MCPClient('fetch', 'uvx',['mcp-server-fetch'])
    await fetchMCP.initMCP()
    const tools = fetchMCP.getTools()
    console.log(tools);
    
    await fetchMCP.closeMCP()

}
main()

import { ChatOpenAI } from "./ChatOpenAI.js";
import { MCPClient } from "./MCPClient.js";
import { Agent } from "./agent.js";


// 测试ChatOpenAI
// async function main(){
//     const llm = new ChatOpenAI('deepseek-v4-flash', 'You are a helpful assistant.')
//     const { content, tool_calls } = await llm.chat('你好')
//     console.log(content);
//     console.log(tool_calls);
// }

// 测试MCPClient
// async function main(){
//     const fetchMCP = new MCPClient('fetch', 'uvx',['mcp-server-fetch'])
//     await fetchMCP.initMCP()
//     const tools = fetchMCP.getTools()
//     console.log(tools);
    
//     await fetchMCP.closeMCP()
// }

const currentDir = process.cwd();
const fetchMCP = new MCPClient('fetch', 'uvx',['mcp-server-fetch'])
const fileMCP = new MCPClient('file', 'npx',["-y","@modelcontextprotocol/server-filesystem",currentDir])
async function main(){
    const agent = new Agent('deepseek-v4-flash', [fetchMCP,fileMCP])
    await agent.init()
    const response = await agent.invoke(`帮我爬取https://news.ycombinator.com/的前1条内容，并且保存${currentDir}的news.md文件中`)
    console.log(response);
}
main()


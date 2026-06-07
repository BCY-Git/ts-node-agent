import { logTitle } from "./chalk.js";
import { ChatOpenAI } from "./ChatOpenAI.js";
import { MCPClient } from "./MCPClient.js";

export class Agent {

    private llm: ChatOpenAI | null = null;
    private model: string;
    private mcpClient: MCPClient[] = [];
    private context: string = "";
    private prompt: string = "";


    constructor(model: string, mcpClient: MCPClient[], prompt: string = "", context: string = "") {
        this.model = model;
        this.mcpClient = mcpClient;
        this.prompt = prompt;
        this.context = context;
    }

    public async init() {

        logTitle("Running agent...");
        for (const mcpClient of this.mcpClient) {
            await mcpClient.initMCP();
        }
        const tools = this.mcpClient.flatMap(mcpClient => mcpClient.getTools());
        this.llm = new ChatOpenAI(this.model, this.prompt, tools, this.context);
    }

    public async close() {
        logTitle("Closing agent...");
        for (const mcpClient of this.mcpClient) {
            await mcpClient.closeMCP();
        }
    }

    async invoke(prompt: string) {
        if (!this.llm) throw new Error("LLM is not initialized");
        let response = await this.llm.chat(prompt);
        while (true) {
            if (response.tool_calls.length > 0) {
                for (const tool_call of response.tool_calls) {
                    const mcp = this.mcpClient.find(mcpClient => mcpClient.getTools().find(tool => tool.name === tool_call.function.name));//寻找具有该工具的MCPClient
                    if (mcp) {
                        logTitle('Tool Use:' + tool_call.function.name);
                        const result = await mcp.callTool(tool_call.function.name, JSON.parse(tool_call.function.arguments));//得先用JSON.parse把arguments转成对象
                        logTitle(`Tool Result: ${result}`);
                        console.log(`Tool Result: ${result}`);
                        this.llm.appendToolResult(tool_call.id, JSON.stringify(result));//这里还得再转成字符串
                    }
                    else {
                        this.llm.appendToolResult(tool_call.id, "Tool not found");
                    }
                }
                response = await this.llm.chat();
                continue;
            }
            await this.close();//没有工具调用时关闭MCPClient
            return response.content;//返回最终的response内容
        }
    }


}

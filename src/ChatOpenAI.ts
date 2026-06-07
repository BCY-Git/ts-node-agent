import OpenAI from "openai";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
dotenv.config();
import { logTitle } from "./chalk.js";

export interface ToolCall {
    id: string;
    function: {
        name: string;
        arguments: string;
    };
}

export class ChatOpenAI {
    private llm: OpenAI;
    private model: string;
    private messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    private tools: Tool[];

    constructor(model: string, systemPrompt: string, tools: Tool[] = [], context: string = "") {
        this.llm = new OpenAI({
            baseURL: process.env.OPENAI_BASE_URL,
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.model = model;//初始化模型
        this.tools = tools;//初始化工具
        if (systemPrompt) { this.messages.push({ role: "system", content: systemPrompt }); }
        if (context) { this.messages.push({ role: "user", content: context }); }
    }

    async chat(prompt?: string) {
        logTitle("Chat");
        if (prompt) { this.messages.push({ role: "user", content: prompt }); }
        const stream = await this.llm.chat.completions.create({//创建流
            model: this.model,
            messages: this.messages,
            stream: true,
            tools: this.getToolsDefinition(),
        });
        let content = "";
        let reasoning_content = "";
        let tool_calls: ToolCall[] = [];
        logTitle("response.stream")
        for await (const chunk of stream) {
            const delta = chunk.choices[0].delta;
            if (delta.content) {
                const chunkContent = delta.content || "";
                content += chunkContent;//把delta.content加到content
                process.stdout.write(chunkContent);//这里的process.stdout.write是把chunkContent写到控制台
            }
            // @ts-ignore - DeepSeek API 返回 reasoning_content
            if (delta.reasoning_content) {
                // @ts-ignore
                reasoning_content += delta.reasoning_content;
            }
            if (delta.tool_calls) {
                for (const tool_call of delta.tool_calls) {
                    if(tool_calls.length<=tool_call.index){
                        tool_calls.push({id:'', function:{name:'', arguments:''}});
                    }
                    let currentCall = tool_calls[tool_call.index];
                    if (tool_call.id) currentCall.id += tool_call.id;
                    if (tool_call.function?.name) currentCall.function.name += tool_call.function.name;
                    if (tool_call.function?.arguments) currentCall.function.arguments += tool_call.function.arguments;
                    
                }
            }
        }
        // @ts-ignore - DeepSeek API 需要 reasoning_content
        this.messages.push({ 
            role: "assistant", 
            content: content,
            reasoning_content: reasoning_content || undefined,
            tool_calls: tool_calls.map(call => ({ id: call.id, type: "function", function: { name: call.function.name, arguments: call.function.arguments } })) 
        } as any);
        return { content, tool_calls };
    }

    private getToolsDefinition() {
        return this.tools.map(tool => ({
            type: "function" as const,
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema,
            },
        }));
    }

    appendToolResult(toolCallId: string, result: string) {
        this.messages.push({
            role: "tool",
            tool_call_id: toolCallId,
            content: result,
        });
    }

}
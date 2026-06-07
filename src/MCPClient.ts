import { Client } from "@modelcontextprotocol/sdk/client";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio";
import { Tool } from "@modelcontextprotocol/sdk/types";

export class MCPClient {
  private mcp: Client;
  private transport: StdioClientTransport | null = null;
  private tools: Tool[] = [];
  private command: string;
  private args: string[];

  constructor(name:string, command:string, args:string[], version?:string) {
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
    this.command = command;
    this.args = args;
  }//这个构造器的作用主要是
  

  public async initMCP() {
    await this.connectToServer();
  }

  public async closeMCP() {
    await this.mcp.close();
  }

  public getTools(): Tool[] {
    return this.tools;
  }


  private async connectToServer() {
  try {
    this.transport = new StdioClientTransport({
      command: this.command,
      args: this.args,
    });
    await this.mcp.connect(this.transport);

    const toolsResult = await this.mcp.listTools();
    this.tools = toolsResult.tools.map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      };
    });
    console.log(
      "Connected to server with tools:",
      this.tools.map(({ name }) => name)
    );
  } catch (e) {
    console.log("Failed to connect to MCP server: ", e);
    throw e;
  }
}



}
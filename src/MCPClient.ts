import { Client } from "@modelcontextprotocol/sdk/client";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio";
import { Tool } from "@modelcontextprotocol/sdk/types";

export default class MCPClient {
  private mcp: Client;
  private transport: StdioClientTransport | null = null;
  private tools: Tool[] = [];

  constructor(name:string) {
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
  }
  

}
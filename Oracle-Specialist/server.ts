import { AgentMode, HederaLangchainToolkit, coreAccountQueryPlugin, coreConsensusQueryPlugin, coreConsensusPlugin } from 'hedera-agent-kit';
import { ChatGroq } from '@langchain/groq';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';
import { Client, PrivateKey } from '@hashgraph/sdk';
import * as dotenv from 'dotenv';
import { DynamicTool } from "@langchain/core/tools";
import express, { Request, Response } from 'express'; // Import Express
import { z } from "zod";

// Load environment variables immediately
dotenv.config();

// --- Define Custom Tools ---

const getHbarApy = new DynamicTool({
  name: "get_hbar_apy",
  description: "Call this to get the APY for HBAR staking and DeFi lending strategies (Native Staking, Bonzo Finance, Stader Labs) on the Hedera Network.",
 
 func: async () => {
    try {
      const url = `https://gist.githubusercontent.com/yashsharma22003/8f5172422f5f9df4087e07a6251b8042/raw/d31da862822de0fabb0b38685b1d35bddc80e7f4/HbarApy.json`;

      const response = await fetch(url);
      if (!response.ok) {
        return `Error: API call to HBAR endpoint failed with status ${response.status}`;
      }
      const data = await response.json();
      return JSON.stringify(data, null, 2);
    } catch (error: any) {
      return `Error executing getHbarApy tool: ${error.message}`;
    }
  },
});

const getUsdcApy = new DynamicTool({
  name: "get_usdc_apy",
  description: "Call this to get the APY for USDC lending strategies on the Hedera Network.",
  func: async () => {
    try {
      const url = `https://gist.githubusercontent.com/yashsharma22003/4918c5d38cba7ec40f27c4d4aab0c112/raw/302d9253119aa4a09781b9182e1fb203452b6d58/USDCApy.json`;

      const response = await fetch(url);
      if (!response.ok) {
        return `Error: API call to USDC endpoint failed with status ${response.status}`;
      }
      const data = await response.json();
      return JSON.stringify(data, null, 2);
    } catch (error: any) {                                                                   
      return `Error executing getUsdcApy tool: ${error.message}`;
    }
  },
});


// --- Agent and Server Initialization ---

// We will store the initialized agent executor here
let agentExecutor: AgentExecutor;

/**
 * Initializes the LLM, tools, and agent executor.
 * This runs once when the server starts.
 */
async function initializeAgent() {
  console.log('Initializing Hedera Agent...');

  // 1. Initialise LLM
  const llm = new ChatGroq({
    model: 'qwen/qwen3-32b',
    apiKey: process.env.GROQ_API_KEY,
  });

  // 2. Hedera client setup
  const client = Client.forTestnet().setOperator(
    process.env.ACCOUNT_ID!,
    PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY!),
  );

  // 3. Prepare Hedera toolkit
  const hederaAgentToolkit = new HederaLangchainToolkit({
    client,
    configuration: {
      tools: [],
      context: { mode: AgentMode.AUTONOMOUS },
      plugins: [coreAccountQueryPlugin, coreConsensusQueryPlugin, coreConsensusPlugin],
    },
  });

  // 4. Combine all tools
  const hederaTools = hederaAgentToolkit.getTools();
  const tools = [getHbarApy, getUsdcApy];

  // 5. Define the JSON-enforcing prompt
  // 5. Define the JSON-enforcing prompt
  const systemMessage = `You are an expert financial data assistant.
  IMPORTANT: When the user asks for data (like APY for HBAR or USDC), you MUST:
  1. Call the correct tool (getHbarApy or getUsdcApy).
  2. Format the raw tool data into the specified JSON schema.
  3. Your *entire response* must be **ONLY** the valid JSON object.
  4. DO NOT add any conversational text or markdown.

  JSON Schema:
  {{
    "asset": "string",
    "lastUpdated": "string",
    "strategies": [
      {{
        "name": "string",
        "risk": "string",
        "apy": "string",
        "lockup": "string",
        "description": "string"
      }}
    ]
  }}
  
  For all other general conversation, answer as a helpful assistant.

  ---
  Here are the tools you can use:
  {tools}

  The "tool" key in your JSON response must be one of the following:
  {tool_names}
  ---`;

 const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemMessage],
    // Use the object constructor to set 'optional'
    new MessagesPlaceholder({ variableName: "chat_history", optional: true }),
    ['human', '{input}'],
    new MessagesPlaceholder({ variableName: "agent_scratchpad", optional: true }),
  ]);

  // 6. Create the agent
  const agent = await createStructuredChatAgent({
    llm,
    tools: tools,
    prompt,
  });

  // 7. Create the agent executor
  // We remove BufferMemory to make the API stateless.
  // Each API call will be independent.
  agentExecutor = new AgentExecutor({
    agent,
    tools,
    returnIntermediateSteps: false,
  });

  console.log('Hedera Agent initialized successfully.');
}

/**
 * Starts the Express server to listen for API requests.
 */
function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Health check endpoint
  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hedera APY Agent is running.');
  });

  /**
   * Main endpoint for invoking the agent.
   * Expects a JSON body with an "input" key.
   * e.g., { "input": "What is the APY for HBAR?" }
   */
  app.post('/invoke', async (req: Request, res: Response) => {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ success: false, error: 'Input is required' });
    }

    if (!agentExecutor) {
      return res.status(503).json({ success: false, error: 'Agent is not yet initialized' });
    }

    console.log(`Processing request for: "${input}"`);

    try {
      // Invoke the agent. We pass an empty chat_history for a stateless invocation.
      const response = await agentExecutor.invoke({
        input: input,
        chat_history: [], // Makes the API stateless
      });

      let output = response?.output ?? response;

      // The prompt forces APY data into a JSON string.
      // We parse it here so the API returns a real JSON object.
      try {
        const parsedOutput = JSON.parse(output);
        // If parsing succeeds, send the object
        res.json({ success: true, output: parsedOutput });
      } catch (e) {
        // If it fails, it's just a normal string response (like "Hello")
        res.json({ success: true, output: output });
      }

    } catch (err: any) {
      console.error('Error invoking agent:', err);
      res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    }
  });

  // Start listening
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

/**
 * Main function to run the application
 */
async function main() {
  try {
    await initializeAgent(); // Wait for the agent to be ready
    startServer();           // Then start the server
  } catch (err) {
    console.error('Fatal error during initialization:', err);
    process.exit(1);
  }
}

// Run the server
main();
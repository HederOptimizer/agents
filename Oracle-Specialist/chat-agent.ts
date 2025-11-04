import { AgentMode, HederaLangchainToolkit,coreAccountQueryPlugin, coreConsensusQueryPlugin, coreConsensusPlugin   } from 'hedera-agent-kit';
// import { ChatOpenAI } from '@langchain/openai';
import { ChatGroq } from '@langchain/groq'
import type { ChatPromptTemplate } from '@langchain/core/prompts';
import { pull } from 'langchain/hub';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';
import { BufferMemory } from 'langchain/memory';
import { Client, PrivateKey } from '@hashgraph/sdk';
import prompts from 'prompts';
import * as dotenv from 'dotenv';
import { DynamicTool } from "@langchain/core/tools"

dotenv.config();

async function bootstrap(): Promise<void> {
  // Initialise OpenAI LLM
  const llm = new ChatGroq({
    model: 'qwen/qwen3-32b',
  });

  // Hedera client setup (Testnet by default)
  const client = Client.forTestnet().setOperator(
    process.env.ACCOUNT_ID!,
    PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY!),
  );

 const getHbarApy = new DynamicTool({
    name: "get_hbar_apy",
    description: "Call this to get the APY for HBAR staking and DeFi lending strategies (Native Staking, Bonzo Finance, Stader Labs) on the Hedera Network.",
    func: async () => {
        try {
            // URL for HBAR APY data
            const url = `https://gist.githubusercontent.com/yashsharma22003/8f5172422f5f9df4087e07a6251b8042/raw/d31da862822de0fabb0b38685b1d35bddc80e7f4/HbarApy.json`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                return `Error: API call to HBAR endpoint failed with status ${response.status} from ${url}`;
            }
            
            const data = await response.json();
            
            // Return the data as a string for the agent to process
            return JSON.stringify(data, null, 2);

        } catch (error: any) {
            return `Error executing getHbarApy tool: ${error.message}`;
        }
    },
});

// --- 2. Tool for fetching USDC APY data ---
 const getUsdcApy = new DynamicTool({
    name: "get_usdc_apy",
    description: "Call this to get the APY for USDC lending strategies on the Hedera Network.",
    func: async () => {
        try {
            // URL for USDC APY data
            const url = `https://gist.githubusercontent.com/yashsharma22003/4918c5d38cba7ec40f27c4d4aab0c112/raw/302d9253119aa4a09781b9182e1fb203452b6d58/USDCApy.json`;
            
            const response = await fetch(url);

            if (!response.ok) {
                return `Error: API call to USDC endpoint failed with status ${response.status} from ${url}`;
            }
            
            const data = await response.json();
            
            // Return the data as a string for the agent to process
            return JSON.stringify(data, null, 2);

        } catch (error: any) {
            return `Error executing getUsdcApy tool: ${error.message}`;
        }
    },
});

  // Prepare Hedera toolkit (load all tools by default)
  const hederaAgentToolkit = new HederaLangchainToolkit({
    client,
    configuration: {
      tools: [], // use an empty array if you want to load all tools
      context: {
        mode: AgentMode.AUTONOMOUS,
      },
      plugins: [coreAccountQueryPlugin, coreConsensusQueryPlugin, coreConsensusPlugin ],
    },
  });

  // Load the structured chat prompt template
  const prompt = await pull<ChatPromptTemplate>('hwchase17/structured-chat-agent');

// Fetch tools from toolkit
const hederaTools = hederaAgentToolkit.getTools();

// 2. Add your custom tool to the list
const tools = [...hederaTools, getHbarApy, getUsdcApy];

  const agent = await createStructuredChatAgent({
    llm,
    tools: tools,
    prompt,
  });

  // In-memory conversation history
  const memory = new BufferMemory({
    memoryKey: 'chat_history',
    inputKey: 'input',
    outputKey: 'output',
    returnMessages: true,
  });

  // Wrap everything in an executor that will maintain memory
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    memory,
    returnIntermediateSteps: false,
  });

  console.log('Hedera Agent CLI Chatbot — type "exit" to quit');

  while (true) {
    const { userInput } = await prompts({
      type: 'text',
      name: 'userInput',
      message: 'You',
    });

    // Handle early termination
    if (!userInput || ['exit', 'quit'].includes(userInput.trim().toLowerCase())) {
      console.log('Goodbye!');
      break;
    }

    try {
      const response = await agentExecutor.invoke({ input: userInput });
      // The structured-chat agent puts its final answer in `output`
      console.log(`AI: ${response?.output ?? response}`);
    } catch (err) {
      console.error('Error:', err);
    }
  }
}

bootstrap()
  .catch(err => {
    console.error('Fatal error during CLI bootstrap:', err);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
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

  const getExternalDataTool = new DynamicTool({
  name: "get_dynamic_apy",
  description: "Call this to get Apy for different strategies on Hedera Network, staratagies include Native staking, Bonzo Finance and Starader Labs",
  func: async () => {
    try {
    
      const response = await fetch(`https://gist.githubusercontent.com/yashsharma22003/8f5172422f5f9df4087e07a6251b8042/raw/d31da862822de0fabb0b38685b1d35bddc80e7f4/HbarApy.json`);
      if (!response.ok) {
        return `Error: API call failed with status ${response.status}`;
      }
      
      const data = await response.json();
      
      // Return the data as a string (agents work best with string I/O)
      return JSON.stringify(data, null, 2);
    } catch (error: any) {
      return `Error executing tool: ${error.message}`;
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
const tools = [...hederaTools, getExternalDataTool];

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
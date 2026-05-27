/**
 * =================================================================================
 * 项目: theoldllm-2api-pro (Ultimate Absolute Zero Edition)
 * 版本: 1.6.1 (代号: Onyx - The Final Protocol)
 * 作者: 首席AI执行官 (Principal AI Executive Officer) Modify by Wilson
 * 协议: 奇美拉协议 · 终极复刻版
 * 日期: 2025-12-28
 * 来源：本项目改自 https://github.com/lza6/theoldllm-2api-cfwork
 *
 * [核心修正日志 v1.6.1]
 * 1. [修复] 路由分发：优化 /v1/models 匹配逻辑，支持单复数及末尾斜杠，解决 Cherry Studio 等软件识别问题。
 * 2. [同步] 全量模型列表：包含 GPT-5.1/5.2, o1, o3, Claude 4, Gemini 3 等。
 * 3. [修复] 路由分发：自动识别 Persona 模式与 Proxy 模式 (provider=p7)。
 * 4. [复刻] 1:1 鉴权：区分使用 Tenant Token 和 Supabase Key。
 * 5. [增强] 思维链渲染：支持 reasoning_content 实时流式输出。
 * =================================================================================
 */

// 模型配置
// OpenAI 模型列表（全部绑定到 p5 企业服务）
// const openaiModels = [
//   { id: "ent-gpt-5.2", name: "GPT-5.2", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-5.2" },
//   { id: "ent-gpt-5.1", name: "GPT-5.1", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-5.1" },
//   { id: "ent-gpt-5", name: "GPT-5", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-5" },
//   { id: "ent-gpt-5-mini", name: "GPT-5 Mini", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-5-mini" },
//   { id: "ent-gpt-5-nano", name: "GPT-5 Nano", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-5-nano" },
//   { id: "ent-o4-mini", name: "O4 Mini", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "o4-mini" },
//   { id: "ent-o3", name: "O3", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "o3" },
//   { id: "ent-o3-mini", name: "O3 Mini", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "o3-mini" },
//   { id: "ent-o1", name: "O1", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "o1" },
//   { id: "ent-o1-preview", name: "O1 Preview", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "o1-preview" },
//   { id: "ent-o1-mini", name: "O1 Mini", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "o1-mini" },
//   { id: "ent-gpt-4.1", name: "GPT-4.1", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4.1" },
//   { id: "ent-gpt-4o", name: "GPT-4o", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4o" },
//   { id: "ent-gpt-4o-2024-08-06", name: "GPT-4o (2024-08-06)", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4o-2024-08-06" },
//   { id: "ent-gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4o-mini" },
//   { id: "ent-gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4-turbo" },
//   { id: "ent-gpt-4-turbo-preview", name: "GPT-4 Turbo Preview", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4-turbo-preview" },
//   { id: "ent-gpt-4", name: "GPT-4", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4" },
//   { id: "ent-gpt-4-1106-preview", name: "GPT-4 1106 Preview", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4-1106-preview" },
//   { id: "ent-gpt-4-vision-preview", name: "GPT-4 Vision Preview", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4-vision-preview" },
//   { id: "ent-gpt-4-0613", name: "GPT-4 (0613)", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4-0613" },
//   { id: "ent-gpt-4-0314", name: "GPT-4 (0314)", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4-0314" },
//   { id: "ent-gpt-4-32k-0314", name: "GPT-4 32K (0314)", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-4-32k-0314" },
//   { id: "ent-gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-3.5-turbo" },
//   { id: "ent-gpt-3.5-turbo-0125", name: "GPT-3.5 Turbo (0125)", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-3.5-turbo-0125" },
//   { id: "ent-gpt-3.5-turbo-1106", name: "GPT-3.5 Turbo (1106)", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-3.5-turbo-1106" },
//   { id: "ent-gpt-3.5-turbo-16k", name: "GPT-3.5 Turbo 16K", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-3.5-turbo-16k" },
//   { id: "ent-gpt-3.5-turbo-0613", name: "GPT-3.5 Turbo (0613)", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-3.5-turbo-0613" },
//   { id: "ent-gpt-3.5-turbo-16k-0613", name: "GPT-3.5 Turbo 16K (0613)", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-3.5-turbo-16k-0613" },
//   { id: "ent-gpt-3.5-turbo-0301", name: "GPT-3.5 Turbo (0301)", provider: "OpenAI", apiProvider: "p5", llmProvider: "openai", llmVersion: "gpt-3.5-turbo-0301" }
// ];

// Anthropic 模型列表（全部绑定到 p5）
// const anthropicModels = [
//   { id: "ent-claude-opus-4.5", name: "Claude Opus 4.5", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-opus-4-5" },
//   { id: "ent-claude-opus-4.5-20251101", name: "Claude Opus 4.5 (20251101)", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-opus-4-5-20251101" },
//   { id: "ent-claude-opus-4.1", name: "Claude Opus 4.1", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-opus-4-1" },
//   { id: "ent-claude-opus-4.1-20250805", name: "Claude Opus 4.1 (20250805)", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-opus-4-1-20250805" },
//   { id: "ent-claude-opus-4", name: "Claude Opus 4", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-opus-4-20250514" },
//   { id: "ent-claude-4-opus", name: "Claude 4 Opus", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-4-opus-20250514" },
//   { id: "ent-claude-sonnet-4.5", name: "Claude Sonnet 4.5", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-sonnet-4-5" },
//   { id: "ent-claude-sonnet-4.5-20250929", name: "Claude Sonnet 4.5 (20250929)", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-sonnet-4-5-20250929" },
//   { id: "ent-claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-sonnet-4-20250514" },
//   { id: "ent-claude-4-sonnet", name: "Claude 4 Sonnet", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-4-sonnet-20250514" },
//   { id: "ent-claude-3.7-sonnet", name: "Claude 3.7 Sonnet", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-3-7-sonnet-latest" },
//   { id: "ent-claude-3.7-sonnet-20250219", name: "Claude 3.7 Sonnet (20250219)", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-3-7-sonnet-20250219" },
//   { id: "ent-claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-3-5-sonnet-latest" },
//   { id: "ent-claude-haiku-4.5", name: "Claude Haiku 4.5", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-haiku-4-5" },
//   { id: "ent-claude-haiku-4.5-20251001", name: "Claude Haiku 4.5 (20251001)", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-haiku-4-5-20251001" },
//   { id: "ent-claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-3-5-haiku-latest" },
//   { id: "ent-claude-3.5-haiku-20241022", name: "Claude 3.5 Haiku (20241022)", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-3-5-haiku-20241022" },
//   { id: "ent-claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-3-opus-latest" },
//   { id: "ent-claude-3-opus-20240229", name: "Claude 3 Opus (20240229)", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-3-opus-20240229" },
//   { id: "ent-claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", apiProvider: "p5", llmProvider: "anthropic", llmVersion: "claude-3-haiku-20240307" }
// ];

// Google / Anthropic 混合模型（用于 p7 通用服务）
// const universalModels = [
//   { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", apiProvider: "p7" },
//   { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "Google", apiProvider: "p7" },
//   { id: "gemini-claude-opus-4-5-thinking", name: "Claude Opus 4.5 Thinking", provider: "Anthropic", apiProvider: "p7", thinkingModel: "gemini-claude-opus-4-5-thinking" },
//   { id: "gemini-claude-sonnet-4-5-thinking", name: "Claude Sonnet 4.5 Thinking", provider: "Anthropic", apiProvider: "p7", thinkingModel: "gemini-claude-sonnet-4-5-thinking" }
// ];

// 多厂商模型（用于 p9 OldLLM API）
const p9Models = [
  { id: "nemotron-nano-9b-v2:free", name: "Nemotron Nano 9b V2 Free", provider: "Nvidia", apiProvider: "p9" },
  { id: "grok-4", name: "Grok 4", provider: "xAI", apiProvider: "p9" },
  { id: "grok-4.1-fast", name: "Grok 4.1 Fast", provider: "xAI", apiProvider: "p9" },
  { id: "grok-code-fast-1", name: "Grok Code Fast 1", provider: "xAI", apiProvider: "p9" },
  { id: "grok-3", name: "Grok 3", provider: "xAI", apiProvider: "p9" },
  { id: "aion-rp-llama-3.1-8b", name: "Aion RP Llama 3.1 8b", provider: "Aion-labs", apiProvider: "p9" },
  { id: "qwq-32b-arliai-rpr-v1", name: "QWQ 32b Arliai Rpr V1", provider: "Arliai", apiProvider: "p9" },
  { id: "deepseek-prover-v2", name: "DeepSeek Prover V2", provider: "DeepSeek", apiProvider: "p9" },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", apiProvider: "p9" },
  { id: "deepseek-r1-0528", name: "DeepSeek R1 0528", provider: "DeepSeek", apiProvider: "p9" },
  { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", apiProvider: "p9" },
  { id: "deepseek-v3.1", name: "DeepSeek V3.1", provider: "DeepSeek", apiProvider: "p9" },
  { id: "deepseek-v3.1-aws", name: "DeepSeek V3.1 AWS", provider: "DeepSeek", apiProvider: "p9" },
  { id: "deepseek-v3.1-terminus", name: "DeepSeek V3.1 Terminus", provider: "DeepSeek", apiProvider: "p9" },
  { id: "deepseek-v3.2", name: "DeepSeek V3.2", provider: "DeepSeek", apiProvider: "p9" },
  { id: "gemini-2.0-flash-001", name: "Gemini 2.0 Flash 001", provider: "Google", apiProvider: "p9" },
  { id: "gemini-3-flash-preview", name: "Gemini 3 Flash Preview", provider: "Google", apiProvider: "p9" },
  { id: "gemini-2.0-flash-lite-001", name: "Gemini 2.0 Flash Lite 001", provider: "Google", apiProvider: "p9" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", apiProvider: "p9" },
  { id: "gemini-2.5-flash-image", name: "Gemini 2.5 Flash Image", provider: "Google", apiProvider: "p9" },
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "Google", apiProvider: "p9" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", apiProvider: "p9" },
  { id: "gemini-3-pro-image-preview", name: "Gemini 3 Pro Image Preview", provider: "Google", apiProvider: "p9" },
  { id: "gemini-3-pro-preview", name: "Gemini 3 Pro Preview", provider: "Google", apiProvider: "p9" },
  { id: "kat-coder-pro", name: "Kat Coder Pro", provider: "Kwaipilot", apiProvider: "p9" },
  { id: "lfm-2.2-6b", name: "LFM 2.2 6b", provider: "Liquid", apiProvider: "p9" },
  { id: "llama-3.1-8b-instruct", name: "Llama 3.1 8b Instruct", provider: "Meta", apiProvider: "p9" },
  { id: "llama-3.3-70b-instruct", name: "Llama 3.3 70b Instruct", provider: "Meta", apiProvider: "p9" },
  { id: "merl", name: "Merl", provider: "Microsoft", apiProvider: "p9" },
  { id: "devstral-medium", name: "Devstral Medium", provider: "Mistral", apiProvider: "p9" },
  { id: "devstral-2512:free", name: "Devstral 2512 Free", provider: "Mistral", apiProvider: "p9" },
  { id: "deepseek-v3.1-nex-n1:free", name: "DeepSeek V3.1 Nex N1 Free", provider: "Nex-agi", apiProvider: "p9" },
  { id: "minimax-01", name: "Minimax 01", provider: "Minimax", apiProvider: "p9" },
  { id: "minimax-m1", name: "Minimax M1", provider: "Minimax", apiProvider: "p9" },
  { id: "minimax-m2", name: "Minimax M2", provider: "Minimax", apiProvider: "p9" },
  { id: "tng-r1t-chimera:free", name: "TNG R1t Chimera Free", provider: "Tngtech", apiProvider: "p9" },
  { id: "olmo-3.1-32b-think:free", name: "Olmo 3.1 32b Think Free", provider: "Allenai", apiProvider: "p9", thinkingModel: "olmo-3.1-32b-think:free" },
  { id: "nemotron-nano-12b-v2-vl:free", name: "Nemotron Nano 12b V2 Vl Free", provider: "Nvidia", apiProvider: "p9" },
  { id: "tongyi-deepresearch-30b-a3b:free", name: "Tongyi Deepresearch 30b A3b Free", provider: "Alibaba", apiProvider: "p9", isSearch: true },
  { id: "glm-4.5-air:free", name: "GLM 4.5 Air Free", provider: "Zhipu", apiProvider: "p9" },
  { id: "dolphin-mistral-24b-venice-edition:free", name: "Dolphin Mistral 24b Venice Edition Free", provider: "Cognitivecomputations", apiProvider: "p9" },
  { id: "gemma-3n-e2b-it:free", name: "Gemma 3n E2b It Free", provider: "Google", apiProvider: "p9" },
  { id: "deepseek-r1t2-chimera:free", name: "DeepSeek R1T2 Chimera Free", provider: "Tngtech", apiProvider: "p9" },
  { id: "magistral-medium-2506:thinking", name: "Magistral Medium 2506 Thinking", provider: "Mistral", apiProvider: "p9", thinkingModel: "magistral-medium-2506:thinking" },
  { id: "mistral-large-2512", name: "Mistral Large 2512", provider: "Mistral", apiProvider: "p9" },
  { id: "mistral-medium-3.1", name: "Mistral Medium 3.1", provider: "Mistral", apiProvider: "p9" },
  { id: "mistral-nemo", name: "Mistral Nemo", provider: "Mistral", apiProvider: "p9" },
  { id: "mistral-saba", name: "Mistral Saba", provider: "Mistral", apiProvider: "p9" },
  { id: "mistral-small-3.2-24b-instruct", name: "Mistral Small 3.2 24b Instruct", provider: "Mistral", apiProvider: "p9" },
  { id: "mixtral-8x22b-instruct", name: "Mixtral 8x22b Instruct", provider: "Mistral", apiProvider: "p9" },
  { id: "mixtral-8x7b-instruct", name: "Mixtral 8x7b Instruct", provider: "Mistral", apiProvider: "p9" },
  { id: "kimi-dev-72b", name: "Kimi Dev 72b", provider: "Moonshot", apiProvider: "p9" },
  { id: "kimi-k2", name: "Kimi K2", provider: "Moonshot", apiProvider: "p9" },
  { id: "kimi-k2-0905", name: "Kimi K2 0905", provider: "Moonshot", apiProvider: "p9" },
  { id: "noromaid-20b", name: "Noromaid 20b", provider: "Neversleep", apiProvider: "p9" },
  { id: "chatgpt-4o-latest", name: "ChatGPT 4o Latest", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-3.5-turbo", name: "GPT 3.5 Turbo", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-4", name: "GPT 4", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-4-turbo", name: "GPT 4 Turbo", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-4-turbo-preview", name: "GPT 4 Turbo Preview", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-4.1", name: "GPT 4.1", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-4.1-mini", name: "GPT 4.1 Mini", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-4.1-nano", name: "GPT 4.1 Nano", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-4o", name: "GPT 4o", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-4o-mini", name: "GPT 4o Mini", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-4o-mini-search-preview", name: "GPT 4o Mini Search Preview", provider: "OpenAI", apiProvider: "p9", isSearch: true },
  { id: "gpt-4o-search-preview", name: "GPT 4o Search Preview", provider: "OpenAI", apiProvider: "p9", isSearch: true },
  { id: "gpt-5", name: "GPT 5", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-5-chat", name: "GPT 5 Chat", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-5-chat-latest", name: "GPT 5 Chat Latest", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-5-mini", name: "GPT 5 Mini", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-5-nano", name: "GPT 5 Nano", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-5.1", name: "GPT 5.1", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-5.1-chat-latest", name: "GPT 5.1 Chat Latest", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-5.2", name: "GPT 5.2", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-5.2-chat-latest", name: "GPT 5.2 Chat Latest", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-5.5", name: "GPT 5.5", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-audio", name: "GPT Audio", provider: "OpenAI", apiProvider: "p9" },
  { id: "o1", name: "O1", provider: "OpenAI", apiProvider: "p9" },
  { id: "o3", name: "O3", provider: "OpenAI", apiProvider: "p9" },
  { id: "o3-mini", name: "O3 Mini", provider: "OpenAI", apiProvider: "p9" },
  { id: "o4-mini", name: "O4 Mini", provider: "OpenAI", apiProvider: "p9" },
  { id: "qwen3-14b", name: "Qwen 3 14b", provider: "Alibaba", apiProvider: "p9" },
  { id: "qwen3-next-80b-a3b-instruct", name: "Qwen 3 Next 80b A3b Instruct", provider: "Alibaba", apiProvider: "p9" },
  { id: "qwen3-next-80b-a3b-thinking", name: "Qwen 3 Next 80b A3b Thinking", provider: "Alibaba", apiProvider: "p9", thinkingModel: "qwen3-next-80b-a3b-thinking" },
  { id: "qwen3-235b-a22b", name: "Qwen 3 235b A22b", provider: "Alibaba", apiProvider: "p9" },
  { id: "qwen3-235b-a22b-07-25", name: "Qwen 3 235b A22b 07 25", provider: "Alibaba", apiProvider: "p9" },
  { id: "qwen3-32b", name: "Qwen 3 32b", provider: "Alibaba", apiProvider: "p9" },
  { id: "qwen3-coder", name: "Qwen 3 Coder", provider: "Alibaba", apiProvider: "p9" },
  { id: "glm-4-32b", name: "GLM 4 32b", provider: "Zhipu", apiProvider: "p9" },
  { id: "glm-4.5", name: "GLM 4.5", provider: "Zhipu", apiProvider: "p9" },
  { id: "glm-4.5-air", name: "GLM 4.5 Air", provider: "Zhipu", apiProvider: "p9" },
  { id: "glm-4.5v", name: "GLM 4.5v", provider: "Zhipu", apiProvider: "p9" },
  { id: "glm-4.6", name: "GLM 4.6", provider: "Zhipu", apiProvider: "p9" },
  { id: "glm-4.7", name: "GLM 4.7", provider: "Zhipu", apiProvider: "p9" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", apiProvider: "p9" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic", apiProvider: "p9" },
  { id: "claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic", apiProvider: "p9" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", apiProvider: "p9" },
  { id: "claude-3.7-sonnet", name: "Claude 3.7 Sonnet", provider: "Anthropic", apiProvider: "p9" },
  { id: "claude-haiku-4.5", name: "Claude Haiku 4.5", provider: "Anthropic", apiProvider: "p9" },
  { id: "claude-opus-4", name: "Claude Opus 4", provider: "Anthropic", apiProvider: "p9" },
  { id: "claude-opus-4.1", name: "Claude Opus 4.1", provider: "Anthropic", apiProvider: "p9" },
  { id: "claude-opus-4.5", name: "Claude Opus 4.5", provider: "Anthropic", apiProvider: "p9" },
  { id: "claude-opus-4.7", name: "Claude Opus 4.7", provider: "Anthropic", apiProvider: "p9" },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", apiProvider: "p9" },
  { id: "claude-sonnet-4.5", name: "Claude Sonnet 4.5", provider: "Anthropic", apiProvider: "p9" },
  { id: "gpt-oss-120b", name: "GPT Oss 120b", provider: "OpenAI", apiProvider: "p9" },
  { id: "gpt-oss-20b", name: "GPT Oss 20b", provider: "OpenAI", apiProvider: "p9" }
];

// 其他厂商模型（用于 p8 高级网关）
// const advancedGatewayModels = [
//   { id: "deepseek-v3.1-terminus", name: "DeepSeek V3.1 Terminus", provider: "DeepSeek", apiProvider: "p8" },
//   { id: "glm-4.6", name: "GLM-4.6", provider: "Zhipu", apiProvider: "p8" },
//   { id: "kimi-k2-thinking", name: "Kimi K2 Thinking", provider: "Moonshot", apiProvider: "p8", thinkingModel: "kimi-k2-thinking" },
//   { id: "kimi-k2-instruct", name: "Kimi K2 Instruct", provider: "Moonshot", apiProvider: "p8" },
//   { id: "minimax-m2", name: "Minimax M2", provider: "Minimax", apiProvider: "p8" },
//   { id: "mistral-nemotron", name: "Mistral Nemotron", provider: "Mistral", apiProvider: "p8" },
//   { id: "qwen/qwen3-next-80b-a3b-instruct", name: "Qwen 3 Next 80B Instruct", provider: "Alibaba", apiProvider: "p8" }
// ];

// const ALL_MODELS = [...openaiModels, ...anthropicModels, ...universalModels, ...advancedGatewayModels, ...p9Models];
const ALL_MODELS = p9Models;

// --- [第一部分: 核心配置] ---
const CONFIG = {
  PROJECT_NAME: "theoldllm-api-pro",
  PROJECT_VERSION: "1.6.1",

  API_MASTER_KEY: "1",

  UPSTREAM_ORIGIN: "https://theoldllm.vercel.app",
  UPSTREAM_API: "https://theoldllm.vercel.app/sv5",
  PROXY_API: "https://theoldllm.vercel.app/api/proxy?provider=p7",
  SUPABASE_RPC: "https://ifoybzchxzhgngmgubem.supabase.co/rest/v1/rpc/increment_counter",

  DECRYPT_KEY: "TheOldLLm-Secure-2025-v9",

  // 核心鉴权 Token (来自浏览器日志)
  TENANT_TOKEN: "on_tenant_65566e34-de7f-490a-b88f-32ac8203b659.FlFtgizBOIHSKUrSYbSiT23u7VK3-AHqf64TtjN5v0qP-8AD8QJQ6RLxl0zG9Cgjj5R5ICdgNYFBz9JSv3OJcN3LiKtA6oJTj9CF_1nKjkZQ-InxkNfhEzktF52PXVvFxy7H1IR5JH9PnmMo467YfkAzf8z8vbRmW9WUQcqhBEMuxogPfqAIL1b60F8wGup7WChnADayGVAXyg0ihs4K-fXRyiR7OvXRii05DGX9XT7KtJvb24-XY_VEmWi8OO_o",

  ENCRYPTED_TOKENS: [
    "3112312a1228352c2a4d2337421c4963735b7a437f4729123e333583301b49224a7e195d4f130f3463580b88666d2b803c1b4d0d053f240e1c7d07341946273b4e76688b03651d583d0f5c2a0d0a2b0d0e5529241c2f415246546c5c0b7c24792b2d194614172176207a04315b43272c625b0e136a704573253340220a312d11676d444021461734557d4c664a692176681430116636341c6e62083e173f1d262584810c26752d8d354e201f0208232c0c76421b5b2d3d2966866f5d6e71130c310d583e3f3227444427393c2d22040d"
  ],

  UA: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
  SEC_CH_UA: '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',

  // 模型映射表
  // type: 0 = Persona 模式 (需要创建 Session)
  // type: 1 = Proxy 模式 (直接调用 Proxy 接口)
  MODELS: convertModelsToLegacyFormat(ALL_MODELS) || [
    // --- OpenAI 系列 (Persona 模式) ---
    { id: "gpt-5.2", persona_id: 2064, type: 0, tokens: 398976, name: "GPT-5.2 (Experimental)" },
    { id: "gpt-5.1", persona_id: 2116, type: 0, tokens: 270976, name: "GPT-5.1 (Next-Gen)" },
    { id: "o1", persona_id: 3047, type: 0, tokens: 198976, name: "OpenAI o1 (Full)" },
    { id: "o3", persona_id: 3410, type: 0, tokens: 198976, name: "OpenAI o3 (Latest)" },
    { id: "o3-mini", persona_id: 1260, type: 0, tokens: 198976, name: "OpenAI o3-mini" },
    { id: "gpt-4o", persona_id: 1378, type: 0, tokens: 126976, name: "GPT-4o" },
    { id: "gpt-4.1", persona_id: 1378, type: 0, tokens: 1046552, name: "GPT-4.1 (Ultra Context)" },

    // --- Anthropic 系列 (Persona 模式) ---
    { id: "claude-opus-4-5", persona_id: 6701, type: 0, tokens: 198976, name: "Claude 4.5 Opus" },
    { id: "claude-3-7-sonnet-latest", persona_id: 1426, type: 0, tokens: 198976, name: "Claude 3.7 Sonnet" },
    { id: "claude-3-5-sonnet-20241022", persona_id: 1426, type: 0, tokens: 198976, name: "Claude 3.5 Sonnet V2" },

    // --- Gemini / Proxy 系列 (Proxy 模式) ---
    { id: "gemini-3-pro-preview", type: 1, tokens: 1000000, name: "Gemini 3 Pro (Preview)" },
    { id: "gemini-3-flash-preview", type: 1, tokens: 1000000, name: "Gemini 3 Flash (Preview)" },
    { id: "gemini-2.5-pro", type: 1, tokens: 500000, name: "Gemini 2.5 Pro" },
    { id: "gemini-2.5-flash", type: 1, tokens: 500000, name: "Gemini 2.5 Flash" },
    { id: "gemini-claude-opus-4-5-thinking", type: 1, tokens: 200000, name: "Claude 4.5 (Thinking Mode)" },
    { id: "deepseek-r1", persona_id: 1031, type: 0, tokens: 128000, name: "DeepSeek R1 (Thinking)" }
  ],

  RETRY_LIMIT: 2,
};

// --- [第二部分: 核心算法] ---

function convertModelsToLegacyFormat(allNewModels) {
  if(!allNewModels) return null;
  return allNewModels.map(model => ({
    id: model.id,
    name: model.name,
    type: (model.apiProvider === 'p7' || model.apiProvider === 'p8' || model.apiProvider === 'p9') ? 1 : 0,
    tokens: model.tokens || 200000,
    provider: model.provider,
    apiProvider: model.apiProvider,
    llmProvider: model.llmProvider,
    llmVersion: model.llmVersion
  }));
}

function decryptToken(hex) {
  try {
    const key = CONFIG.DECRYPT_KEY;
    let result = "";
    for (let i = 0; i < hex.length; i += 2) {
      let n = parseInt(hex.substring(i, i + 2), 16);
      n = (n - (i / 2) % 17) & 255;
      result += String.fromCharCode(n ^ key.charCodeAt((i / 2) % key.length));
    }
    return result;
  } catch (e) { return ""; }
}

function getPerfectHeaders(type = "biz", env = {}) {  // 添加 env 参数
  const base = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
    "user-agent": CONFIG.UA,
    "sec-ch-ua": CONFIG.SEC_CH_UA,
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',  // 调整为 macOS，与 curl 示例一致
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "priority": "u=1, i",
    "origin": CONFIG.UPSTREAM_ORIGIN,
    "referer": CONFIG.UPSTREAM_ORIGIN + "/"
  };

  if (type === "supabase") {
    const sbKey = decryptToken(CONFIG.ENCRYPTED_TOKENS[0]);
    return {
      ...base,
      "apikey": sbKey,
      "authorization": `Bearer ${sbKey}`,
      "content-profile": "public",
      "sec-fetch-site": "cross-site",
      "x-client-info": "supabase-js-web/2.84.0",
      "content-type": "application/json"
    };
  }

  // 优先使用环境变量，如果没有则使用配置中的默认值
  const userToken = env.API_MASTER_KEY && env.API_MASTER_KEY!=="1" ? env.API_MASTER_KEY : '';
  const tenantToken = userToken || env.TENANT_TOKEN || CONFIG.TENANT_TOKEN;

  return {
    ...base,
    "authorization": `Bearer ${tenantToken}`,
    "sec-fetch-site": "same-origin",
    "content-type": "application/json"
  };
}

// --- [第三部分: Worker 入口] ---

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const apiKey = env.API_MASTER_KEY || CONFIG.API_MASTER_KEY;handleChat

    if (request.method === 'OPTIONS') return handleCorsPreflight();
    if (url.pathname === '/') return handleUI(request, apiKey);

    if (url.pathname.startsWith('/v1/')) {
      return handleApi(request, apiKey, env);  // 传递 env
    }

    return createErrorResponse(`Not Found: ${url.pathname}`, 404);
  }
};

async function handleApi(request, apiKey, env) {  // 添加 env 参数
  const url = new URL(request.url);
  // 核心修复：移除路径末尾的所有斜杠，并统一转换为小写进行匹配
  const path = url.pathname.replace(/\/+$/, "");

  // 1. 鉴权校验
  const authHeader = request.headers.get('Authorization');
  if (apiKey !== "1" && authHeader !== `Bearer ${apiKey}`) {
    return createErrorResponse('Unauthorized', 401);
  }

  // 2. 路由分发
  if (path === '/v1/models' || path === '/v1/model') {
    return handleModels();
  }

  if (path === '/v1/chat/completions') {
    return handleChat(request, env);  // 传递 env
  }

  return createErrorResponse(`Endpoint Not Supported: ${path}`, 404);
}

function handleModels() {
  return new Response(JSON.stringify({
    object: "list",
    data: CONFIG.MODELS.map(m => ({
      id: m.id,
      name: m?.name || m.id,
      object: "model",
      created: Math.floor(Date.now() / 1000),
      owned_by: "theoldllm",
      context_window: m.tokens
    }))
  }), {
    headers: corsHeaders({
      "Content-Type": "application/json; charset=utf-8"
    })
  });
}

// --- [第四部分: 核心对话逻辑] ---

async function handleChat(request, env) {
  const body = await request.json();
  const isWebUI = body.is_web_ui === true;
  const modelId = body.model || "gpt-5.2";
  const modelCfg = CONFIG.MODELS.find(m => m.id === modelId) || CONFIG.MODELS[0];
  const traceId = `onyx-${crypto.randomUUID()}`;

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    let retryCount = 0;
    let success = false;

    while (retryCount <= CONFIG.RETRY_LIMIT && !success) {
      const bizHeaders = getPerfectHeaders("biz", env);  // 传递 env
      const sbHeaders = getPerfectHeaders("supabase", env);  // 传递 env

      try {
        // --- 模式 A: Proxy 模式 (Gemini 3 / Claude Thinking) ---
        if (modelCfg.type === 1) {
            if (isWebUI) await writer.write(encoder.encode(`data: ${JSON.stringify({ debug: "正在通过代理网关建立连接..." })}\n\n`));
            // 使用模型配置中的 apiProvider 作为 provider 参数
            const proxyUrl = `${CONFIG.UPSTREAM_ORIGIN}/api/proxy?provider=${modelCfg.apiProvider}`;
            const proxyRes = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                  ...bizHeaders,
                  "cache-control": "no-cache",
                  "pragma": "no-cache"
                },
                body: JSON.stringify({
                    model: modelCfg.id,
                    messages: body.messages,
                    stream: true
                })
            });

            if (!proxyRes.ok) throw new Error(`Proxy Error: ${proxyRes.status}`);
            await processStream(proxyRes, writer, encoder, traceId, modelCfg.id);
            success = true;
        }
        // --- 模式 B: Persona 模式 (GPT-5 / o1 / o3) ---
        else {
            // 1. 激活 Persona
            if (isWebUI) await writer.write(encoder.encode(`data: ${JSON.stringify({ debug: `正在激活模型配置 (ID: ${modelCfg.persona_id})...` })}\n\n`));
            await fetch(`${CONFIG.UPSTREAM_API}/persona`, {
                method: 'POST',
                headers: bizHeaders,
                body: JSON.stringify({
                    name: `${modelCfg.id} Agent v${Math.floor(Math.random()*9000)+1000}`,
                    description: "Direct chat with Provider",
                    system_prompt: "You are a helpful assistant.",
                    llm_model_provider_override: modelCfg.provider || 'Unkown',  // 改这里
                    llm_model_version_override: modelCfg.llmVersion || modelCfg.id,  // 改这里
                    // llm_model_provider_override: modelCfg.id.includes('claude') ? "Anthropic" : "OpenAI",
                    // llm_model_version_override: modelCfg.id,
                    is_public: false,
                    num_chunks: 0
                })
            });

            // 2. Supabase 握手
            const today = new Date().toISOString().split('T')[0];
            await fetch(CONFIG.SUPABASE_RPC, {
                method: 'POST',
                headers: sbHeaders,
                body: JSON.stringify({ p_counter_name: `chats_${today}`, p_amount: 1 })
            }).catch(() => {});

            // 3. 创建会话
            if (isWebUI) await writer.write(encoder.encode(`data: ${JSON.stringify({ debug: "正在创建加密会话..." })}\n\n`));
            const sessionRes = await fetch(`${CONFIG.UPSTREAM_API}/chat/create-chat-session`, {
                method: 'POST',
                headers: bizHeaders,
                body: JSON.stringify({
                    persona_id: modelCfg.persona_id,
                    description: `Onyx Session ${Date.now()}`
                })
            });
            const sessionData = await sessionRes.json();
            const sessionId = sessionData.chat_session_id || sessionData.id;

            // 4. 发送消息（支持多轮对话历史）
            const lastMessage = body.messages.at(-1);
            let messageText = "";
            let fileDescriptors = [];

            // --- 处理多模态内容（图片+文字） ---
            if (Array.isArray(lastMessage.content)) {
                for (const part of lastMessage.content) {
                    if (part.type === 'text') {
                        messageText += part.text;
                    } else if (part.type === 'image_url') {
                        const url = part.image_url.url;
                        if (url.startsWith('data:image/')) {
                            messageText += "\n[系统提示：检测到图片附件，但当前不支持 Base64 格式，已忽略]";
                        } else {
                            fileDescriptors.push({
                                id: `img_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                                type: 'image',
                                url: url
                            });
                        }
                    }
                }
            } else {
                messageText = lastMessage.content;
            }

            // --- ✅ 关键修复：拼接完整对话历史 ---
            if (body.messages.length > 1) {
                const historyContext = body.messages.slice(0, -1).map(msg => {
                    const role = msg.role === 'user' ? 'User' :
                                 msg.role === 'assistant' ? 'Assistant' :
                                 msg.role === 'system' ? 'System' : msg.role;
                    const content = typeof msg.content === 'string'
                        ? msg.content
                        : msg.content.find(p => p.type === 'text')?.text || '';
                    return `${role}: ${content}`;
                }).join('\n\n');

                // 将历史对话作为上下文前缀
                messageText = `[对话历史]\n${historyContext}\n\n[当前消息]\nUser: ${messageText}`;
            }

            const chatRes = await fetch(`${CONFIG.UPSTREAM_API}/chat/send-message`, {
                method: 'POST',
                headers: bizHeaders,
                body: JSON.stringify({
                    chat_session_id: sessionId,
                    message: messageText,  // ✅ 现在包含完整历史
                    parent_message_id: null,
                    file_descriptors: fileDescriptors,
                    search_doc_ids: [],
                    retrieval_options: {}
                })
            });

            // 4. 发送消息
            // const chatRes = await fetch(`${CONFIG.UPSTREAM_API}/chat/send-message`, {
            //     method: 'POST',
            //     headers: bizHeaders,
            //     body: JSON.stringify({
            //         chat_session_id: sessionId,
            //         message: body.messages.at(-1).content,
            //         parent_message_id: null,
            //         file_descriptors: [],
            //         search_doc_ids: [],
            //         retrieval_options: {}
            //     })
            // });

            await processStream(chatRes, writer, encoder, traceId, modelCfg.id);
            success = true;
        }

      } catch (err) {
        retryCount++;
        if (isWebUI) await writer.write(encoder.encode(`data: ${JSON.stringify({ debug: `重试中 (${retryCount}/${CONFIG.RETRY_LIMIT}): ${err.message}` })}\n\n`));
        if (retryCount > CONFIG.RETRY_LIMIT) {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ error: { message: err.message, type: "upstream_error" } })}\n\n`));
        }
      }
    }
    await writer.close();
  })();

  return new Response(readable, {
    headers: corsHeaders({
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache"
    })
  });
}

/**
 * 通用流处理引擎：支持 reasoning_content 和 content
 */
async function processStream(response, writer, encoder, traceId, modelId) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let partialLine = "";
    let hasStartedThinking = false;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (partialLine + chunk).split('\n');
        partialLine = lines.pop();

        for (const line of lines) {
            if (!line.trim() || line.includes('data: [DONE]')) continue;

            let jsonString = line;
            if (line.startsWith('data: ')) jsonString = line.substring(6);

            try {
                const json = JSON.parse(jsonString);
                let content = "";
                let reasoning = "";

                // 适配两种上游格式
                const obj = json.obj || json;
                const choices = obj.choices?.[0];

                // 提取思维链
                reasoning = choices?.delta?.reasoning_content || obj?.reasoning_content || "";
                // 提取正文
                content = choices?.delta?.content || obj?.content || "";

                if (reasoning) {
                    if (!hasStartedThinking) {
                        await writer.write(encoder.encode(`data: ${JSON.stringify(makeChunk(traceId, modelId, "<think>" + reasoning))}\n\n`));
                        hasStartedThinking = true;
                    } else {
                        await writer.write(encoder.encode(`data: ${JSON.stringify(makeChunk(traceId, modelId, reasoning))}\n\n`));
                    }
                } else if (content) {
                    if (hasStartedThinking) {
                        await writer.write(encoder.encode(`data: ${JSON.stringify(makeChunk(traceId, modelId, "</think>\n\n" + content))}\n\n`));
                        hasStartedThinking = false;
                    } else {
                        await writer.write(encoder.encode(`data: ${JSON.stringify(makeChunk(traceId, modelId, content))}\n\n`));
                    }
                }
            } catch (e) {}
        }
    }
    if (hasStartedThinking) {
        await writer.write(encoder.encode(`data: ${JSON.stringify(makeChunk(traceId, modelId, "</think>"))}\n\n`));
    }
    await writer.write(encoder.encode(`data: ${JSON.stringify({ id: traceId, object: "chat.completion.chunk", choices: [{ index: 0, delta: {}, finish_reason: "stop" }] })}\n\n`));
    await writer.write(encoder.encode('data: [DONE]\n\n'));
}

function makeChunk(id, model, content) {
    return {
        id,
        object: "chat.completion.chunk",
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [{ index: 0, delta: { content }, finish_reason: null }]
    };
}

// --- [第五部分: 开发者驾驶舱 UI] ---

function handleUI(request, apiKey) {
  const origin = new URL(request.url).origin;
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${CONFIG.PROJECT_NAME} - 开发者驾驶舱</title>
    <style>
        :root {
            --bg: #0a0a0a; --panel: #121212; --border: #262626; --text: #e5e5e5;
            --text-dim: #737373; --primary: #FFBF00; --primary-dim: #a67c00;
            --success: #22c55e; --error: #ef4444; --font-mono: 'Fira Code', 'Cascadia Code', monospace;
        }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bg); color: var(--text); height: 100vh; display: flex; overflow: hidden; }
        .container { display: flex; width: 100%; height: 100%; }
        .sidebar { width: 380px; background: var(--panel); border-right: 1px solid var(--border); padding: 24px; display: flex; flex-direction: column; overflow-y: auto; flex-shrink: 0; }
        .header h1 { font-size: 1.4rem; margin: 0; color: var(--primary); }
        .header p { font-size: 0.8rem; color: var(--text-dim); margin: 8px 0 32px; }
        .box { background: #171717; border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 20px; }
        .label { font-size: 0.7rem; text-transform: uppercase; color: var(--text-dim); margin-bottom: 10px; font-weight: 800; display: flex; justify-content: space-between; }
        .code-block { font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary); background: #000; padding: 12px; border-radius: 6px; cursor: pointer; word-break: break-all; border: 1px solid transparent; transition: 0.2s; }
        .code-block:hover { border-color: var(--primary); }
        .main { flex: 1; display: flex; flex-direction: column; padding: 24px; gap: 20px; background: radial-gradient(circle at top right, #1a1a1a, var(--bg)); }
        .terminal { flex: 1; background: #000; border: 1px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .terminal-header { background: #1a1a1a; padding: 12px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .terminal-body { flex: 1; padding: 20px; overflow-y: auto; font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.6; scroll-behavior: smooth; }
        .input-area { background: #1a1a1a; padding: 20px; border-top: 1px solid var(--border); display: flex; gap: 15px; }
        textarea { flex: 1; background: #0a0a0a; border: 1px solid var(--border); border-radius: 8px; color: #fff; padding: 12px; resize: none; font-family: inherit; font-size: 0.95rem; }
        textarea:focus { border-color: var(--primary); outline: none; }
        button { background: var(--primary); color: #000; border: none; border-radius: 8px; padding: 0 24px; font-weight: 900; cursor: pointer; transition: 0.2s; }
        button:hover { background: var(--primary-dim); }
        button:disabled { background: #444; cursor: not-allowed; }
        .log-panel { height: 200px; background: #000; border: 1px solid var(--border); border-radius: 10px; padding: 15px; overflow-y: auto; font-family: var(--font-mono); font-size: 0.7rem; }
        .log-item { margin-bottom: 4px; border-bottom: 1px solid #111; padding-bottom: 4px; display: flex; gap: 10px; }
        .log-time { color: #555; flex-shrink: 0; }
        .log-tag { color: var(--primary); font-weight: bold; flex-shrink: 0; }
        .log-msg { color: #aaa; word-break: break-all; }
        .msg-user { color: var(--primary); margin-bottom: 15px; font-weight: bold; border-left: 3px solid var(--primary); padding-left: 10px; }
        .msg-ai { color: #fff; margin-bottom: 25px; white-space: pre-wrap; padding-left: 13px; }
        think { display: block; background: #111; border: 1px dashed #333; padding: 12px; border-radius: 8px; color: #888; font-style: italic; margin: 10px 0; font-size: 0.85rem; }
        think::before { content: '💭 思考过程...'; display: block; font-size: 0.7rem; margin-bottom: 8px; color: var(--primary); font-style: normal; font-weight: bold; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="header">
                <h1>${CONFIG.PROJECT_NAME}</h1>
                <p>v${CONFIG.PROJECT_VERSION} | 奇美拉协议 · 终极版</p>
            </div>
            <div class="box">
                <span class="label">API 接口地址 <span style="color:var(--success)">● 活跃</span></span>
                <div class="code-block" onclick="copy('${origin}/v1')">${origin}/v1</div>
            </div>
            <div class="box">
                <span class="label">API 密钥 (Master Key)</span>
                <div class="code-block" onclick="copy('${apiKey}')">${apiKey}</div>
            </div>
            <div class="box">
                <span class="label">模型映射 (含 Token 限制)</span>
                <select id="model-select" style="width:100%; background:#000; color:var(--primary); border:1px solid var(--border); padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">
                    ${CONFIG.MODELS.map(m => `<option value="${m.id}">${m.name}<!-- (${Math.floor(m.tokens/1000)}k)--></option>`).join('')}
                </select>
            </div>
            <div class="box" style="font-size:0.75rem; color:var(--text-dim); line-height:1.6;">
                <span class="label">系统状态</span>
                • <b>指纹模拟:</b> Chrome 143 (1:1)<br>
                • <b>路由引擎:</b> Onyx Hybrid (Persona/Proxy)<br>
                • <b>思维链:</b> 支持 Gemini-3/Claude-Thinking<br><br>
                <span class="label">注意事项</span>
                • <b>✗不支持图片:</b> 因为上游不支持图片，试了无法识别<br>
                • <b>✓支持附件:</b> 因为附件本质还是转成文本附加到提示词下面<br>
                • <b>✗不支持流式输出:</b> 因为上游不支持，试了不输出思考过程<br>
                • <b>⚠️模型ID显示错误:</b> gemini-claude-前缀的其实是claude，可能上游模型id写错了<br><br>
                <span class="label">数据来源</span>
                • <b>上游公益站:</b> https://theoldllm.vercel.app/
            </div>
        </div>
        <div class="main">
            <div class="terminal">
                <div class="terminal-header">
                    <span style="font-size:0.8rem; font-weight:bold;">实时交互终端 - READY</span>
                    <span id="status-tag" style="font-size:0.7rem; color:var(--text-dim);">就绪</span>
                </div>
                <div class="terminal-body" id="chat-box">
                    <div style="color:var(--text-dim); text-align:center; margin-top:100px;">等待指令输入...</div>
                </div>
                <div class="input-area">
                    <textarea id="user-input" rows="2" placeholder="输入消息，Ctrl+Enter 发送..."></textarea>
                    <button id="send-btn">发送</button>
                    <button onclick="clearConversation()" style="background:#444;color:#fff;">清空</button>
                </div>
            </div>
            <div class="log-panel" id="log-box">
                <div class="log-item">
                    <span class="log-time">${new Date().toLocaleTimeString()}</span>
                    <span class="log-tag">[SYSTEM]</span>
                    <span class="log-msg">初始化完成。双模路由引擎已就绪。</span>
                </div>
            </div>
            <div style="text-align: center;font-size: 12px;color: #adb00b;">
                高速稳定模型齐全的第三方AI平台推荐：<a style="color: #30b83d;" href="https://api.gpt.ge/register?aff=GlNE" target="_blank">V-API</a> 或 <a style="color: #30b83d;" href="https://api.vectorengine.ai/register?aff=JBmK" target="_blank">向量AI</a> 或 <a style="color: #30b83d;" href="https://wzw.pp.ua/register?aff=Upf6" target="_blank">WONG</a>
            </div>
        </div>
    </div>
    <script>
      const chatBox = document.getElementById('chat-box');
      const logBox = document.getElementById('log-box');
      const userInput = document.getElementById('user-input');
      const sendBtn = document.getElementById('send-btn');
      const modelSelect = document.getElementById('model-select');

      function addLog(tag, msg) {
          const div = document.createElement('div');
          div.className = 'log-item';
          // ✅ 修复：使用字符串拼接代替模板字符串
          div.innerHTML = '<span class="log-time">' + new Date().toLocaleTimeString() + '</span><span class="log-tag">[' + tag + ']</span><span class="log-msg">' + msg + '</span>';
          logBox.appendChild(div);
          logBox.scrollTop = logBox.scrollHeight;
      }

      function copy(text) {
          navigator.clipboard.writeText(text);
          alert('已复制到剪贴板');
      }

      let conversationHistory = [];

      async function sendMessage() {
          const text = userInput.value.trim();
          if (!text) return;
          userInput.value = '';
          sendBtn.disabled = true;

          document.getElementById('status-tag').innerText = '正在处理...';
          // ✅ 修复：使用字符串拼接
          addLog('REQUEST', '模型: ' + modelSelect.value + ', 长度: ' + text.length);

          conversationHistory.push({ role: 'user', content: text });

          const userDiv = document.createElement('div');
          userDiv.className = 'msg-user';
          userDiv.textContent = 'User: ' + text;
          chatBox.appendChild(userDiv);

          const aiDiv = document.createElement('div');
          aiDiv.className = 'msg-ai';
          chatBox.appendChild(aiDiv);

          try {
              const response = await fetch('/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ${apiKey}'  // ✅ 这个保留，因为是外层模板字符串的变量
                  },
                  body: JSON.stringify({
                      model: modelSelect.value,
                      messages: conversationHistory,
                      stream: true,
                      is_web_ui: true
                  })
              });

              const reader = response.body.getReader();
              const decoder = new TextDecoder();
              let fullText = '';

              while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  const chunk = decoder.decode(value);
                  const lines = chunk.split('\\n');
                  for (const line of lines) {
                      if (line.startsWith('data: ')) {
                          const dataStr = line.substring(6).trim();
                          if (dataStr === '[DONE]') continue;
                          try {
                              const data = JSON.parse(dataStr);
                              if (data.debug) { addLog('DEBUG', data.debug); continue; }
                              if (data.error) { addLog('ERROR', data.error.message); continue; }
                              const content = data.choices[0].delta.content || '';
                              fullText += content;
                              aiDiv.innerHTML = fullText
                                  .replace(/<think>/g, '<think>')
                                  .replace(/<\\/think>/g, '</think>');
                              chatBox.scrollTop = chatBox.scrollHeight;
                          } catch (e) {}
                      }
                  }
              }

              conversationHistory.push({ role: 'assistant', content: fullText });

              addLog('SUCCESS', '响应流接收完毕');
              document.getElementById('status-tag').innerText = '就绪';
          } catch (err) {
              addLog('FATAL', err.message);
              aiDiv.style.color = 'var(--error)';
              aiDiv.textContent = 'AI Error: ' + err.message;
              document.getElementById('status-tag').innerText = '错误';
          } finally {
              sendBtn.disabled = false;
          }
      }

      function clearConversation() {
          conversationHistory = [];
          chatBox.innerHTML = '<div style="color:var(--text-dim); text-align:center; margin-top:100px;">对话已清空,等待新指令...</div>';
          addLog('SYSTEM', '对话历史已清空');
      }

      sendBtn.addEventListener('click', sendMessage);
      userInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) sendMessage();
      });
  </script>
</body>
</html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// --- [第六部分: 辅助函数] ---

function corsHeaders(headers = {}) {
  return {
    ...headers,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '86400',
  };
}

function handleCorsPreflight() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function createErrorResponse(message, status) {
  return new Response(JSON.stringify({
    error: { message, type: 'api_error' }
  }), {
    status,
    headers: corsHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  });
}

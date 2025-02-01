require("dotenv").config();
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { Gen } = require("../../function/Gen");
const { SupportedChatModels } = require("../../function/Chatbot");

// Use NVIDIA API key from the environment.
const nvidiaApiKey = process.env.NVIDIA_API_KEY;

// Test marketing description (NVIDIA)
async function testNvidiaMarketingDesc() {
  const prompt = "gaming chair.";
  const desc = await Gen.get_marketing_desc(prompt, nvidiaApiKey, SupportedChatModels.NVIDIA);
  console.log("NVIDIA Marketing Desc:", desc);
  assert(desc.length > 0, "Marketing description should not be empty.");
  // Ensure no <think> tag remains.
  assert(!desc.includes("<think>"), "Response should not contain <think> tag.");
}

// Test blog post (NVIDIA)
async function testNvidiaBlogPost() {
  const prompt = "AI in art blog post.";
  const blog = await Gen.get_blog_post(prompt, nvidiaApiKey, SupportedChatModels.NVIDIA);
  console.log("NVIDIA Blog Post:", blog);
  assert(blog.length > 0, "Blog post should not be empty.");
  assert(!blog.includes("<think>"), "Response should not contain <think> tag.");
}

// Test HTML page generation (NVIDIA)
async function testNvidiaHtmlPage() {
  const tempDir = path.join(__dirname, "../temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  const text = "a registration page with flat modern theme.";
  const htmlCode = await Gen.generate_html_page(text, nvidiaApiKey, "deepseek", SupportedChatModels.NVIDIA);
  console.log("NVIDIA HTML Page:", htmlCode);
  fs.writeFileSync(path.join(tempDir, "nvidia_generated_page.html"), htmlCode["html"]);
  assert(htmlCode["html"].length > 0, "HTML output should not be empty.");
}

// Test dashboard generation (NVIDIA)
async function testNvidiaDashboard() {
  const tempDir = path.join(__dirname, "../temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  const csvData = "Title,Value\nGraph1,100\nGraph2,200"; // simplified CSV data
  const topic = "Monthly Hospital Activity";
  const dashboardOutput = await Gen.generate_dashboard(csvData, topic, nvidiaApiKey, "deepseek", 2, SupportedChatModels.NVIDIA);
  console.log("NVIDIA Dashboard:", dashboardOutput);
  fs.writeFileSync(path.join(tempDir, "nvidia_dashboard.html"), dashboardOutput["html"]);
  assert(dashboardOutput["html"].length > 0, "Dashboard HTML should not be empty.");
}

// Test instruct update (NVIDIA)
async function testNvidiaInstructUpdate() {
  const modelOutput = "{\"html\": \"<!DOCTYPE html><html><body><h1>Title1</h1></\"";
  const userInstruction = "fix the format";
  const type = "json with html content";
  const fixedOutput = await Gen.instructUpdate(modelOutput, userInstruction, type, nvidiaApiKey, "deepseek", SupportedChatModels.NVIDIA);
  console.log("NVIDIA Instruct Update:", fixedOutput);
  assert(fixedOutput.length > 0, "Instruct update output should not be empty.");
  assert(!fixedOutput.includes("<think>"), "Response should not contain <think> tag.");
}

(async () => {
  console.log("Running NVIDIA Gen tests...");
  await testNvidiaMarketingDesc();
  await testNvidiaBlogPost();
  await testNvidiaHtmlPage();
  await testNvidiaDashboard();
  await testNvidiaInstructUpdate();
  console.log("All NVIDIA Gen tests passed.");
})();

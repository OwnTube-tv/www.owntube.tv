import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Convert __dirname and __filename for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of known routes
const routes = ["/contact", "/consulting"];

// Path to the build output
const buildDir = path.resolve(__dirname, "dist/");

// Eliminate GPT Engineer import in generated index HTML
const indexHtmlPath = path.join(buildDir, "index.html");
let indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
indexHtml = indexHtml.replace(/\s+<script src="https:\/\/cdn.gpteng.co\/gptengineer.js" type="module"><\/script>/, "");
fs.writeFileSync(indexHtmlPath, indexHtml);

routes.forEach((route) => {
  const routePath = path.join(buildDir, route);
  fs.mkdirSync(routePath, { recursive: true });

  // Copy the index.html file to the route's folder
  fs.copyFileSync(path.join(buildDir, "index.html"), path.join(routePath, "index.html"));
});

console.log("Static files for routes have been generated!");

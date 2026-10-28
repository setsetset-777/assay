import express from "express";
import fs from "fs";
import yaml from "yaml";
import path from "path";
import url from "url";

const port = process.env.SERVER_PORT ?? 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir =
  process.env.NODE_ENV === "production" ? "../data" : "../../data";

interface Form {
  id: string;
  ttile: string;
  route: string;
}

interface FormData {
  form: Form;
}

const app = express();

/**
 * API
 */
app.get("/api/form/:id", (req, res) => {
  try {
    const filePath = path.resolve(
      __dirname,
      dataDir,
      "forms",
      `${req.params.id}.yml`,
    );

    const fileData = fs.readFileSync(filePath, "utf8");
    const fileYaml = yaml.parse(fileData) as FormData;
    res.json(fileYaml.form);
  } catch (err) {
    res.status(404).send("Not found");
  }
});

/**
 * Web server
 */

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /");
});

// Static files
app.use(express.static(path.join(__dirname, "public")));

// SPA fallback: send index.html for any non-API route (React Router)
app.get("/{*foo}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/**
 * Start server
 */
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

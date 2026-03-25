import express from "express";
import fs from "fs";
import yaml from "yaml";
import path from "path";
import url from "url";

const port = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = "./data/forms";

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
    const filePath = path.resolve(__dirname, dataDir, `${req.params.id}.yml`);
    const fileData = fs.readFileSync(filePath, "utf8");
    const fileYaml = yaml.parse(fileData) as FormData;
    res.json(fileYaml.form);
  } catch (err) {
    res.status(404).send("Not found");
  }
});

/**
 * Initialise server
 */

const clientDist = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDist));

app.get("*foo", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

/**
 * Start server
 */
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

import express from "express";
import fs from "fs/promises";
import yaml from "yaml";
import path from "path";
import url from "url";

const port = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Form {
  id: string;
  ttile: string;
  route: string;
}

interface FormData {
  form: Form;
}

/**
 * Retrieve data
 */
const loadFormData: () => Promise<Form[]> = async () => {
  const dataDir = "/data/forms";
  try {
    const filenames = await fs.readdir(path.join(__dirname, dataDir));
    const formData: Form[] = [];
    for (let filename of filenames) {
      const filePath = path.join(__dirname, dataDir, filename);
      const fileData = await fs.readFile(filePath, "utf8");
      const dataYml = yaml.parse(fileData) as FormData;
      formData.push(dataYml.form);
    }
    return formData;
  } catch (e) {
    console.error(`Could not retrieve data ${e}`);
    return [];
  }
};

let data: { forms: Form[] } = {
  forms: [],
};

data.forms = await loadFormData();

const app = express();

/**
 * API
 */
app.get("/api/routes", (req, res) => {
  const routes: string[] = [];
  data.forms.forEach((form) => {
    routes.push(form.route);
  });
  return res.json(routes);
});

app.get("/api/form/:id", (req, res) => {
  const form = data.forms.find((form) => form.id === req.params.id);
  if (!form) {
    res.status(404);
  } else {
    res.json(form);
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

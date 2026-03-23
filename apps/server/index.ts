import express from "express";
import fs from "fs/promises";
import yaml from "yaml";
import path from "path";
import url from "url";

import type { Request, Response, NextFunction } from "express";

const app = express();
const port = 3000;
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);

interface Form {
  id: string;
  ttile: string;
  route: string;
}

interface FormData {
  form: Form;
}

interface HttpError extends Error {
  status?: number;
}

const loadFormData: () => Promise<Form[]> = async () => {
  const dataDir = "/data/forms";
  try {
    console.log(path.join(__dirname, dataDir));
    console.log(path.resolve(__dirname, dataDir));
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

const clientDist = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDist));

app.get("*foo", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.get("/api/form/:id", (req, res) => {
  const form = data.forms.find((form) => form.id === req.params.id);
  console.log(data);
  if (!form) {
    res.status(404);
  } else {
    res.json(form);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

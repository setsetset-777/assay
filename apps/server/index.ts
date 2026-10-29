import express, { type ErrorRequestHandler } from "express";
import fs from "fs";
import yaml from "yaml";
import path from "path";
import url from "url";
import { HttpError } from "./lib/HttpError.js";
import { mail } from "./lib/mail.js";

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

app.use(express.json());

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

app.post("/api/form/success", (req, res) => {
  const { formId, data } = req.body ?? {};

  // TODO Validate data with schema
  // if (!schema(data)) {
  //   throw new HttpError(400, "Missing fields");
  // }

  try {
    // TODO send email

    const from = "noreply@setsetset.net";
    const to = process.env.ADMIN_EMAIL;
    const subject = "You got mail!";

    const params = {
      from,
      subject,
      to,
      text: JSON.stringify(data),
    };

    mail(params);

    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    throw new HttpError(502, "Could not send message, please try again later");
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
 * Error handling
 */
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return res
      .status(err.status)
      .json({ error: err.message, details: err.details });
  }

  // Malformed JSON body from express.json()
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

app.use(errorHandler);

/**
 * Start server
 */
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

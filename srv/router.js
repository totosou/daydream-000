import express from "express";
import path from "path";
import axios from "axios";
import { URL } from "url";
import contentType from "content-type";

const router = express.Router();
const __dirname = process.cwd();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages/index.html"));
});

router.get("/results/:query", async (req, res) => {
  const { query } = req.params;

  try {
    const reply = await fetch(
      `http://api.duckduckgo.com/ac?q=${query}&format=json`
    ).then((resp) => resp.json());

    res.send(reply);
  } catch (err) {
    console.error(`Search error: ${err}`);
    res.status(500).send({ error: "Search failed" });
  }
});

router.use(
  "/internal/",
  express.static(path.join(__dirname, "public/pages/internal/"))
);

router.use("/internal/icons/:url(*)", async (req, res) => {
  let { url } = req.params;
  url = url.replace(/https?:\/\//g, "");
  let proxiedUrl;
  try {
    proxiedUrl = "https://icon.horse/icon/" + url;
  } catch (err) {
    console.error(`Failed to process URL: ${err}`);
    return res.status(400).send("Invalid URL");
  }

  try {
    const assetUrl = new URL(proxiedUrl);
    const assetResponse = await axios.get(assetUrl.toString(), {
      responseType: "arraybuffer",
      timeout: 5000
    });

    const contentTypeHeader = assetResponse.headers["content-type"];
    const parsedContentType = contentTypeHeader
      ? contentType.parse(contentTypeHeader).type
      : "application/octet-stream";

    res.writeHead(assetResponse.status, {
      "Content-Type": parsedContentType
    });

    res.end(Buffer.from(assetResponse.data));
  } catch (err) {
    console.error(`Failed to fetch proxied URL: ${err}`);
    res.status(500).send("Failed to fetch icon");
  }
});

router.use((req, res) => {
  res.status(404);
  res.sendFile(path.join(__dirname, "public/pages/internal/error/index.html"));
});

export default router;

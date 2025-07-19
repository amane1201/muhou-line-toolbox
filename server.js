import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { loginWithPassword } from "@evex/linejs";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await loginWithPassword(
      { email, password },
      { device: "IOSIPAD" }
    );

    // PINコード不要な場合のみAuthToken返す
    const token = client.authToken || (client.getAuthToken ? await client.getAuthToken() : null);

    if (!token) {
      return res.status(400).json({ error: "PINコードが必要なアカウントは対応していません" });
    }

    // 保存したいならここで保存も可能
    fs.writeFileSync("authtoken.txt", token);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/start", (req, res) => {
  const { token } = req.body;
  try {
    fs.writeFileSync("authtoken.txt", token);
    import("./bot.js").then((mod) => mod.startBot(token));
    res.json({ status: "Bot起動しました" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("http://localhost:3000 で起動中"));

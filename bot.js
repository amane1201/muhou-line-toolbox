import { loginWithAuthToken } from "@evex/linejs";
import { FileStorage } from "@evex/linejs/storage";

export async function startBot(token) {
  const client = await loginWithAuthToken(token, {
    device: "IOSIPAD",
    storage: new FileStorage("./storage.json"),
  });

  client.on("square:message", async (m) => {
    if (m.text === "!asupe") {
      for (let i = 0; i < 10; i++) {
        await m.reply("asupe.xyz " + Math.random().toString(36).slice(2));
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  });

  client.listen();
  console.log("Botが起動しました！");
}

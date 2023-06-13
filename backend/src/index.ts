import { cleanEnv, str, num } from "envalid";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { mintNft } from "./contracts";

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: num(),
});
const PORT = env.PORT;

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/mint-nft", mintNft);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

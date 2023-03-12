import { Action } from "./enums/action";
import { createServer, plugins, Request } from "restify";
import { Payload } from "./interfaces/payload";
import crypto from "crypto";
import dotenv from "dotenv";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(tz);
dotenv.config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env`,
});

const port = process.env.PORT || 3000;
const secret = process.env.GITHUB_WEBHOOK_SECRET || "";
const discord_webhook = process.env.DISCORD_WEBHOOK || "";
const timezone = process.env.TIMEZONE || "";

const app = createServer();
app.use(plugins.bodyParser());

app.get("/health", (req, res, next) => {
  res.send("♥️");
});

app.post("/pr", (req, res, next) => {
  const event = req.header("X-GitHub-Event");
  if (event !== "pull_request") {
    return res.send(200, "Not pull request, PASS!");
  }

  if (!validSignature(req)) {
    return res.send(401);
  }

  const body: Payload = req.body;
  const {
    action,
    pull_request: {
      user: { login: author, avatar_url },
      title,
      body: description,
      html_url: url,
      created_at,
    },
  } = body;

  const pushEventList: Action[] = [
    Action.OPEN,
    Action.FOR_REVIEW,
    Action.REOPEN,
  ];

  if (!pushEventList.includes(action)) {
    return res.send(200, "Action excluded, PASS!");
  }

  const json = {
    content: `🚀  PR: ${author}'s Effort!`,
    embeds: [
      {
        author: {
          name: author,
          url,
          icon_url: avatar_url,
        },
        title: "Pull Request Notification",
        fields: [
          {
            name: "Author",
            value: `${author}`,
          },
          {
            name: "Title",
            value: title,
          },
          {
            name: "Description",
            value: description,
          },
          {
            name: "URL",
            value: `[${url}](${url})`,
          },
          {
            name: "Type",
            value: action,
          },
        ],
        timestamp: created_at,
      },
    ],
  };

  axios.post(discord_webhook, json).catch((error) => {
    console.log(`❌ Type: ${action}`);
    console.log(`Author: ${author}`);
    console.log(`URL: ${url}`);
    console.log(
      `Notify Time: ${dayjs().tz(timezone).format("YYYY/MM/DD HH:mm:ss")}`
    );
    console.log(`Error: ${error}`);

    return res.send(500, "Notify Error!");
  });

  console.log(`🚀 Type: ${action}`);
  console.log(`Author: ${author}`);
  console.log(
    `Notify Time: ${dayjs().tz(timezone).format("YYYY/MM/DD HH:mm:ss")}`
  );
  console.log(`URL: ${url}`);

  res.send(200, "Notify Success!");
});

function validSignature(req: Request): boolean {
  let signature = req.header("X-Hub-Signature");

  const hmac = crypto.createHmac("sha1", secret);
  const calculatedSignature =
    "sha1=" + hmac.update(JSON.stringify(req.body)).digest("hex");

  if (calculatedSignature !== signature) {
    return false;
  }
  return true;
}

app.listen(port, function () {
  console.log(`⚡️Server is running at http://localhost:${port}`);
});

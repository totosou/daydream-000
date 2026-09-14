import express from "express";
import http from "node:http";
import cors from "cors";
import chalk from "chalk";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";
import gradient from "gradient-string";
import fs from "node:fs";
import router from "./srv/router.js";
import path from "node:path";

const server = http.createServer();
const app = express();
const packageInfo = JSON.parse(fs.readFileSync("package.json"));
const PORT = process.env.PORT || 8080;

logging.set_level(logging.ERROR);
wisp.options.dns_method = "resolve";
wisp.options.dns_servers = ["1.1.1.3", "1.0.0.3"];
wisp.options.dns_result_order = "ipv4first";
wisp.options.wisp_version = 2;
wisp.options.wisp_motd = "WISP server";

try {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(express.static(path.join(process.cwd(), "public/static/")));
  app.use("/epoxy/", express.static(epoxyPath));
  app.use("/@/", express.static(uvPath));
  app.use("/libcurl/", express.static(libcurlPath));
  app.use("/baremux/", express.static(baremuxPath));
  app.use("/", router);

  server.on("request", (req, res) => {
    app(req, res);
  });

  server.on("upgrade", (req, socket, head) => {
    if (req.url.endsWith("/wisp/")) {
      wisp.routeRequest(req, socket, head);
    }
  });

  server.on("listening", async () => {
    const address = server.address();
    const theme = chalk.hex("#630aba");
    const ddx = {
      1: "#8b0ab8",
      2: "#630aba",
      3: "#665e72",
      4: "#1c1724"
    };
    const gitColor = chalk.hex("#00ff95");
    const host = chalk.hex("#0d52bd");

    const startupText = `
██████╗  █████╗ ██╗   ██╗██████╗ ██████╗ ███████╗ █████╗ ███╗   ███╗    ██╗  ██╗
██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗██╔══██╗██╔════╝██╔══██╗████╗ ████║    ██║  ██║
██║  ██║███████║ ╚████╔╝ ██║  ██║██████╔╝█████╗  ███████║██╔████╔██║    ███████║
██║  ██║██╔══██║  ╚██╔╝  ██║  ██║██╔══██╗██╔══╝  ██╔══██║██║╚██╔╝██║    ╚════██║
██████╔╝██║  ██║   ██║   ██████╔╝██║  ██║███████╗██║  ██║██║ ╚═╝ ██║         ██║
╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝         ╚═╝
`;

    console.log(gradient(Object.values(ddx)).multiline(startupText));
    console.log(
      theme("Version: "),
      chalk.whiteBright("v" + packageInfo.version)
    );
    console.log(theme("🌐 Deployment Method: "), chalk.whiteBright("Railway"));
    console.log(host("🔗 Deployment Entrypoints: "));
    console.log(
      `  ${chalk.bold(host("Local System IPv4:"))}            http://localhost:${PORT}`
    );
    console.log(
      `  ${chalk.bold(host("Local System IPv6:"))}            http://${address.family === "IPv6" ? `[${address.address}]` : address.address}:${PORT}`
    );
  });

  server.listen({ port: PORT });

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  server.setMaxListeners(0);

  function shutdown() {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      server.close();
      process.exit(1);
    });
  }
} catch (err) {
  console.log(chalk.redBright(`Error starting DayDream-000: ${err}`));
}

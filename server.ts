import express, { Express, Request, Response } from "express";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { BadgeResponse } from "@steak-enjoyers/badges.js/types/codegen/Hub.types";

const app: Express = express();
const port = 3000;

const rpcEndpoint = "https://rpc.stargaze-apis.com:443";
const hubAddr = "stars13unm9tgtwq683wplupjlgw39nghm7xva7tmu7m29tmpxxnkhpkcq4gf3p4";

app.get("/metadata", (req: Request, res: Response) => {
  const id = req.query["id"];
  if (!id) {
    res.status(400).send({
      message: "id is not specified",
    });
  }

  CosmWasmClient.connect(rpcEndpoint)
    .then((cwClient) => {
      return cwClient.queryContractSmart(hubAddr, {
        badge: {
          id: Number(id),
        },
      });
    })
    .then((badgeRes: BadgeResponse) => {
      res.send(badgeRes.metadata);
    })
    .catch((_err) => {
      res.status(400).send({
        message: `failed to query badge; make sure the id is correct: ${id}`,
      });
    });
});

app.listen(port, () => {
  console.log(`server is listening at port ${port}`);
});

export default app;

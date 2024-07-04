import { Hono } from "hono";
import stock from "./stock";
import trade from "./trade";

const app = new Hono().basePath("/api");

app.route("stocks", stock);
app.route("trades", trade);

export default app;

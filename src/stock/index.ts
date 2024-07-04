import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { codeRule } from "../../config/regex";
import { stockTable } from "../../drizzle/schema";
import { stockSchema } from "../../lib/validations/stock";

const stock = new Hono<{ Bindings: { DB: D1Database } }>();

stock
  .get("/", async (c) => {
    try {
      const db = drizzle(c.env.DB);
      const res = await db.select().from(stockTable);
      if (res.length === 0) {
        return c.json({ error: "登録データがありません" }, 404);
      }
      return c.json(res);
    } catch (e) {
      return c.json({ error: e }, 500);
    }
  })
  .post("/", zValidator("json", stockSchema), async (c) => {
    const stock = c.req.valid("json");
    try {
      const db = drizzle(c.env.DB);
      await db.insert(stockTable).values(stock);
      return c.json({ message: "登録しました" }, 201);
    } catch (e) {
      return c.json({ error: "すでに登録されています" }, 500);
    }
  })
  .get(`/:code{${codeRule}}`, async (c) => {
    try {
      const db = drizzle(c.env.DB);
      const code = c.req.param("code");
      const res = await db
        .select()
        .from(stockTable)
        .where(eq(stockTable.code, code));
      if (res.length === 0) {
        return c.json({ error: "登録データがありません" }, 404);
      }
      return c.json(res);
    } catch (e) {
      return c.json({ error: e }, 500);
    }
  })
  .put(`/:code{${codeRule}}`, zValidator("json", stockSchema), async (c) => {
    try {
      const db = drizzle(c.env.DB);
      const code = c.req.param("code");
      const stock = c.req.valid("json");
      await db.update(stockTable).set(stock).where(eq(stockTable.code, code));
      return c.json({ message: "更新しました" }, 200);
    } catch (e) {
      return c.json({ error: e }, 500);
    }
  })
  .delete(`/:code{${codeRule}}`, async (c) => {
    try {
      const db = drizzle(c.env.DB);
      const code = c.req.param("code");
      await db.delete(stockTable).where(eq(stockTable.code, code));
      return c.json({ message: "削除しました" }, 200);
    } catch (e) {
      return c.json({ error: e }, 500);
    }
  });

export default stock;

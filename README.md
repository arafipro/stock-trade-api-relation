# 【Cloudflare Workers】Bun+HonoでREST APIを作成　drizzleを使ってデータベースのリレーションを実現！！

## YouTube

[!["【Cloudflare Workers】Bun+HonoでREST APIを作成　drizzleを使ってデータベースのリレーションを実現！！"](https://i.ytimg.com/vi/oVF_WaLQnUw/maxresdefault.jpg)](https://youtu.be/oVF_WaLQnUw)

## 技術選定

- Bun
- TypeScript
- Hono
- Drizzle
- Zod
- Cloudflare Workers
- Cloudflare D1

## 初期設定

### NodeModule をインストール

```bash
bun install
```

### データベースを作成

```bash
npx wrangler d1 create stock-trade-db
```

### wrangler.toml に追記

```toml
[[d1_databases]]
binding = "DB"
database_name = "stock-trade-db"
database_id = "<unique-ID-for-your-database>"
```

`<unique-ID-for-your-database>`はデータベースを作成したときに出力されるID

### テーブルのスキーマを作成

```bash
npx drizzle-kit generate
```

### ローカルデータベースにテーブルを作成

```bash
npx wrangler d1 migrations apply stock-trade-db --local
```

### リモートデータベースにテーブルを作成

```bash
npx wrangler d1 migrations apply stock-trade-db --remote
```

### ローカルデータベースにダミーデータを登録

```bash
npx wrangler d1 execute stock-trade-db --local --file=./drizzle/dummy-data.sql
```

### リモートデータベースにダミーデータを登録

```bash
npx wrangler d1 execute stock-trade-db --remote --file=./drizzle/dummy-data.sql
```

## テーブル

### テーブル名 stock_table

| カラム名   | データ型 | 主キー | 備考       |
| ---------- | -------- | :----: | ---------- |
| code       | text     |   ○    | 証券コード |
| stock_name | text     |        | 銘柄名     |
| market     | text     |   　   | 市場       |

### テーブル名 trade_table

| カラム名     | データ型 | 主キー | 備考       |
| ------------ | -------- | :----: | ---------- |
| id           | integer  |   ○    | ID         |
| code         | integer  |        | 証券コード |
| shares       | integer  |        | 株数       |
| price        | real     |        | 株価       |
| buy_sell     | text     |        | 売買       |
| trading_date | text     |        | 取引日時   |

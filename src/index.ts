import { Hono } from "hono";
import { Database } from "bun:sqlite";

const app = new Hono();
const db = new Database("poems.db", { readonly: true });

function generateVal(){
  const currentDate = new Date();
  const day = currentDate.getUTCDate();
  const month = currentDate.getUTCMonth() + 1; // Months are zero-based, so add 1
  const year = currentDate.getUTCFullYear();

  const seed = day + month + year;
  const range = 13845;
  const randomValue = (seed % range) + 1;
  return randomValue;
}

type Poem = {
  id: number;
  title: string;
  poem: string;
  poet: string;
  tags: string;
};

app.get("/poem", (c) => {
  const val = generateVal();
  const query = db.query(`SELECT * FROM poems WHERE id = ${val} `);
  const payload = query.all() as Poem[];
  console.log(payload)
  return c.json(payload);
});

export default app;

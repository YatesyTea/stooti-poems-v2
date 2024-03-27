import { Hono } from "hono";
import { Database } from "bun:sqlite";

const app = new Hono();
const db = new Database("poems.db", { readonly: true });

function generateVal() {
  const currentDate = new Date();
  const day = currentDate.getUTCDate();
  const month = currentDate.getUTCMonth() + 1;
  const year = currentDate.getUTCFullYear();

  const seed = day + month + year;
  const range = 13845;
  const randomValue = (seed % range) + 1;
  return randomValue;
}

interface Poem {
  id: number;
  title: string;
  poem: string;
  poet: string;
  tags: string;
}

app.get("/", (c) => {
  const val = generateVal();
  const query = db.query(`SELECT * FROM poems WHERE id = ${val} `);
  const selectedData = query.get() as Poem;
  const today = new Date();
  return c.html(
    <html lang="en">
      <head>
        <title>Stooti's Random Poem of The Day</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Poem of the day for my wonderful girlfriend Stuti Pachisia <3."></meta>
        <link rel="icon" href="/public/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" href="./public/style.css" />
      </head>
      <body>
        <main>
          <img class="rounded-pic" src="/public/stooti.jpg" alt="stooti" />
          <h1>Stooti's Random Poem of the Day</h1>
          <p>
            Today's Date is {today.getUTCDate()}-{today.getUTCMonth() + 1}-{today.getUTCFullYear()}
          </p>
          <div class="display">
            <h2>
              Poem #{selectedData.id} - {selectedData.title}
            </h2>
            <h3>by {selectedData.poet}</h3>
            <p class="line-break-text">{selectedData.poem}</p>
            {selectedData.tags && <div class="listbox-display"><p>Tags: {selectedData.tags}</p></div>}
          </div>
        </main>
      </body>
    </html>
  );
});

export default app;

import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { Database } from "bun:sqlite";

const app = new Hono();
const db = new Database("poems.db", { readonly: true });

app.use("/favicon.ico", serveStatic({ path: "./src/assets/favicon.ico" }));
app.use("/style.css", serveStatic({ path: "./src/style.css" }));
app.use("/stooti.jpg", serveStatic({ path: "./src/assets/stooti.jpg" }));

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
  
  // Generate the HTML as a string
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Stooti's Random Poem of The Day</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Poem of the day for my wonderful girlfriend Stuti Pachisia <3."></meta>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <main class="centre-content">
          <img class="rounded-pic" src="/stooti.jpg" alt="stooti" />
          <h1>Stooti's Random Poem of the Day</h1>
          <p>Today's Date is ${today.getUTCDate()}-${today.getUTCMonth() + 1}-${today.getUTCFullYear()}</p>
          <div class="display centre-content">
            <h2>Poem #${selectedData.id} - ${selectedData.title}</h2>
            <h3>by ${selectedData.poet}</h3>
            <div class="centre-content">
              <p class="line-break-text">${selectedData.poem}</p>
            </div>
            ${selectedData.tags ? `<div class="listbox-display"><p>Tags: ${selectedData.tags}</p></div>` : ''}
          </div>
        </main>
      </body>
    </html>
  `;
  
  return c.html(htmlContent);
});

export default app;

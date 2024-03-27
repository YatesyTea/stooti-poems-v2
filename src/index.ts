import { Hono } from "hono";
import { Database } from "bun:sqlite";

const app = new Hono();
const db = new Database("poems.db", { readonly: true });

function generateVal() {
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

app.get("/", (c) => {
  const val = generateVal();
  const query = db.query(`SELECT * FROM poems WHERE id = ${val} `);
  const payload = query.all() as Poem[];
  const htmlPayload = constructHtml(payload[0]);
  return c.html(htmlPayload);
});

function constructHtml(selectedData: Poem) {
  let htmlString =
    "<html>\n<head>\n<title>Stooti's Random Poem of The Day</title>\n<link rel='icon' href='/favicon.ico' type='image/x-icon'>\n</head>\n<body>";
  const today = new Date();
  const dateString = `${today.getUTCDate()}-${
    today.getUTCMonth() + 1
  }-${today.getUTCFullYear()}`;
  const tagsList = constructTags(selectedData.tags);
  htmlString += `<main><img class='rounded-pic' src='/stooti.jpg' alt='stooti'/><h1>Stooti's Random Poem of the Day</h1><p>Today's Date is ${dateString}</p><div class='display'><h2>Poem #${selectedData.id} - ${selectedData.title}</h2><h3>by ${selectedData.poet}</h3><p class='line-break-text'>${selectedData.poem}</p>${tagsList}</div></main>`;
  return htmlString;
}

function constructTags(tags: string) {
  if (!tags.length) return "";
  return `<div class='listbox-display'><p>Tags: ${tags}</p></div>`;
}

export default app;

import { test, expect, describe } from "bun:test";
import app from "./index";

describe("Testing Routes", () => {
    test('GET /', async () => {
        const res = await app.request("/");
        expect(res.status).toBe(200);
    });
    test('GET Favicon', async () => {
        const res = await app.request("/favicon.ico");
        expect(res.status).toBe(200);
    });
    test('GET Style', async () => {
        const res = await app.request("/style.css");
        expect(res.status).toBe(200);
    });
    test('GET Stooti', async () => {
        const res = await app.request("/stooti.jpg");
        expect(res.status).toBe(200);
    });
})
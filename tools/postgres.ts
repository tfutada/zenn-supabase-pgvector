import { Client } from 'https://deno.land/x/postgres@v0.14.2/mod.ts';

const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!;

const client = new Client(databaseUrl);

try {
    await client.connect();
    const result = await client.queryObject(`SELECT * FROM "Product"`);
    const products = result.rows; // assuming rows like [{ id: 1, name: "Laptop" }, ...]
    console.log(products);
} catch (error) {
    console.error('An error occurred:', error);
} finally {
    await client.end();
}

import {serve} from 'https://deno.land/std@0.204.0/http/server.ts'
import {env, pipeline} from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0'
import {supabase} from "../_shared/pg-client.ts";

// Preparation for Deno runtime
env.useBrowserCache = false
env.allowLocalModels = false

console.log("loading function...")

// get embedding for the input
const pipe = await pipeline(
    'feature-extraction',
    'Supabase/gte-small',
)

// find similar documents using SQL directly
serve(async (req) => {
    const {query} = await req.json()

    const output = await pipe(query, {
        pooling: 'mean',
        normalize: true,
    })

    const embedding = Array.from(output.data)
    const embeddingStr = JSON.stringify(embedding)

    const q = `SELECT title, (embedding <#> '${embeddingStr}') * -1 AS inner_product FROM posts`;

    const result = await supabase.(q)
    const docs = result.rows
    console.log(docs)

    return new Response(JSON.stringify(docs), {
        headers: {'Content-Type': 'application/json'},
    })
})

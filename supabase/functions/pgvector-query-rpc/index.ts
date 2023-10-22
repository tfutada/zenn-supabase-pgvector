import {serve} from 'https://deno.land/std@0.170.0/http/server.ts'
import {env, pipeline} from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0'

import {supabase} from "../_shared/pg-client.ts";

// Preparation for Deno runtime
env.useBrowserCache = false
env.allowLocalModels = false


// get embedding for the input
const pipe = await pipeline(
    'feature-extraction',
    'Supabase/gte-small',
)

// find similar documents using stored procedure, match_documents_dot
serve(async (req: { json: () => PromiseLike<{ query: any; }> | { query: any; }; }) => {
    // Search query is passed in request payload
    const {query} = await req.json()

    const output = await pipe(query, {
        pooling: 'mean',
        normalize: true,
    })

    // Get the embedding output
    const embedding = Array.from(output.data)

    // In production, we should handle possible errors
    const {data: documents, error} = await supabase.rpc('match_documents_dot', {
        query_embedding: embedding,
        match_threshold: 0.00, // Choose an appropriate threshold for your data
        match_count: 10, // Choose the number of matches
    })

    if (error) {
        console.log(error)
        return new Response(JSON.stringify({error: error.message}), {
            headers: {'Content-Type': 'application/json'},
            status: 500,
        })
    }

    return new Response(JSON.stringify(documents), {
        headers: {'Content-Type': 'application/json'},
    })
})

import {serve} from 'https://deno.land/std@0.168.0/http/server.ts'
import {env, pipeline} from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0'
import {supabase} from "../_shared/pg-client.ts";

// Configuration for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;

console.log("loading function...")

const pipe = await pipeline(
    'feature-extraction',
    'Supabase/gte-small',
);

// generate a vector using Transformers.js
serve(async (req) => {
    const {title, body} = await req.json();

    // Generate the embedding from the user input
    const output = await pipe(body, {
        pooling: 'mean',
        normalize: true,
    });

    // Extract the embedding output
    const embedding = Array.from(output.data);

    const {error} = await supabase.from('posts').insert({
        title,
        body,
        embedding,
    })

    if (error) {
        return new Response(
            JSON.stringify({error}),
            {
                headers: {'Content-Type': 'application/json'},
                status: 500,
            }
        );
    }

    // Return the embedding
    return new Response(
        JSON.stringify({embedding}),
        {headers: {'Content-Type': 'application/json'}}
    );
});
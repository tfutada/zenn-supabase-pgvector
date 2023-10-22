import {serve} from 'https://deno.land/std@0.170.0/http/server.ts'
import {OpenAI} from "https://deno.land/x/openai/mod.ts";


console.log("loading function...")


// generate a vector using OpenAI API
serve(async (req) => {
    const {input} = await req.json();

    // Generate the embedding using OpenAI API
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!
    const openAI = new OpenAI(OPENAI_API_KEY);

    const embeddingResponse = await openAI.createEmbeddings({
        model: 'text-embedding-ada-002',
        input,
    })
    console.log(embeddingResponse)

    const d0 = embeddingResponse.data[0].embedding
    console.log(d0)

    // Extract the embedding output
    const embedding = Array.from(d0);

    // Return the embedding
    return new Response(
        JSON.stringify({embedding}),
        {headers: {'Content-Type': 'application/json'}}
    );
});
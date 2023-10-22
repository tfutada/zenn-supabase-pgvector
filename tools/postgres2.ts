import {env, pipeline} from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0';

// Configuration for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;

const body = 'Hello world!'

try {
    const pipe = await pipeline('feature-extraction', 'Supabase/gte-small')

    // Generate a vector using Transformers.js
    const output = await pipe(body, {
        pooling: 'mean',
        normalize: true,
    })

    const embedding = Array.from(output.data);

    console.log(embedding)

} catch (error) {
    console.error('An error occurred:', error);
} finally {

}

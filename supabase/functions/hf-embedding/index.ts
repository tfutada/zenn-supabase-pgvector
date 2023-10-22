import {serve} from 'https://deno.land/std@0.168.0/http/server.ts'
import {HfInference} from 'https://esm.sh/@huggingface/inference@2.3.2'

const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

serve(async (req) => {
    const {prompt} = await req.json()

    const embedding = await hf.featureExtraction({
        model: "cl-nagoya/unsup-simcse-ja-large",
        inputs: prompt,
    });

    return new Response(
        JSON.stringify({embedding}),
        {headers: {'Content-Type': 'application/json'}}
    );
})

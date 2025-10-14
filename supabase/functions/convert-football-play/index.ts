
// Supabase Edge Function for converting hand-drawn football plays to professional diagrams
// Deploy this function to your Supabase project

// deno-lint-ignore-file no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_BASE_URL = "https://api.openai.com/v1";

interface ConversionRequest {
  image: string; // base64 encoded image
  prompt?: string;
}

interface ConversionResponse {
  url?: string;
  image?: string; // base64 encoded result
  description?: string;
  duration_ms: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if OpenAI API key is configured
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key not configured",
          message: "Please add OPENAI_API_KEY to your Supabase secrets"
        }),
        { 
          status: 500, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          } 
        }
      );
    }

    const body = (await req.json()) as ConversionRequest;
    
    if (!body.image) {
      return new Response(
        JSON.stringify({ error: "Image data required" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          } 
        }
      );
    }

    const started = performance.now();

    // Use OpenAI's Vision API to analyze the hand-drawn play
    const analysisPrompt = body.prompt || 
      "Analyze this hand-drawn football play diagram. Identify all players, their positions, routes, and formations. Describe the play in detail including offensive and defensive formations, player movements, and strategic elements.";

    console.log("Analyzing image with OpenAI Vision API...");

    const visionResponse = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: analysisPrompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${body.image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error("OpenAI Vision API error:", errorText);
      return new Response(
        JSON.stringify({ 
          error: "Vision API error", 
          detail: errorText 
        }),
        { 
          status: 502,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    const visionData: any = await visionResponse.json();
    const playDescription = visionData.choices?.[0]?.message?.content || "";
    
    console.log("Play analysis complete:", playDescription);

    // Generate a professional diagram using DALL-E
    const imagePrompt = `Create a professional American football play diagram based on this description: ${playDescription}. 
    Use standard football notation with:
    - Clear player positions marked with circles and numbers
    - Offensive players in one color, defensive players in another
    - Arrows showing player routes and movements
    - Formation labels
    - Clean, professional style with a white background
    - Top-down view of the field
    Style: Technical diagram, clean lines, professional sports playbook aesthetic`;

    console.log("Generating professional diagram with DALL-E...");

    const imageResponse = await fetch(`${OPENAI_BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: imagePrompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
        response_format: "b64_json",
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error("DALL-E API error:", errorText);
      return new Response(
        JSON.stringify({ 
          error: "Image generation error", 
          detail: errorText 
        }),
        { 
          status: 502,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    const imageData: any = await imageResponse.json();
    const generatedImage = imageData.data?.[0]?.b64_json;

    if (!generatedImage) {
      return new Response(
        JSON.stringify({ error: "No image generated" }),
        { 
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    const duration_ms = Math.round(performance.now() - started);

    const response: ConversionResponse = {
      image: generatedImage,
      description: playDescription,
      duration_ms,
    };

    console.log(`Conversion complete in ${duration_ms}ms`);

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (e: any) {
    console.error("Unhandled error:", e);
    return new Response(
      JSON.stringify({ 
        error: "Unhandled error", 
        detail: String(e) 
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
});

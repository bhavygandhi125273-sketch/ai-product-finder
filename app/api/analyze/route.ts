import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return Response.json(
        { error: "No image was provided." },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
             text: `
Identify the main product the user is trying to find in this image.

Focus ONLY on the primary product.

Ignore:
- human hands
- people
- faces and body parts
- background objects
- furniture that is not the target product
- cables, screens, tables, floors, walls, and other surroundings
- unrelated objects

If a human hand is touching or holding the product, completely ignore the hand.

Return:
- Product name
- Brand, if visible
- Category
- Color
- Material, if visible
- Short description

The goal is to identify the product that should be searched for online, not the objects surrounding it.
`,
            },
            {
              type: "input_image",
              image_url: `data:${image.type};base64,${base64Image}`,
              detail: "auto",
            },
          ],
        },
      ],
    });

    return Response.json({
      result: response.output_text,
    });
  } catch (error) {
    console.error("OpenAI error:", error);

   return Response.json(
  {
    error: error instanceof Error ? error.message : String(error),
  },
  { status: 500 }
);
  }
}
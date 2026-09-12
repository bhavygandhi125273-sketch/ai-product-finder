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

   
const uploadForm = new FormData();
uploadForm.append("image", image);
uploadForm.append("api_key", process.env.SERPAPI_API_KEY || "");

const uploadResponse = await fetch(
  "https://serpapi.com/image",
  {
    method: "POST",
    body: uploadForm,
  }
);
    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok || !uploadData.image_id) {
      console.error("SerpApi image upload error:", uploadData);

      return Response.json(
        { error: "Could not upload image to SerpApi." },
        { status: 500 }
      );
    }

    const searchUrl = new URL("https://serpapi.com/search.json");

    searchUrl.searchParams.set("engine", "google_lens");
    searchUrl.searchParams.set("image_id", uploadData.image_id);
    searchUrl.searchParams.set("type", "products");
    searchUrl.searchParams.set("api_key", process.env.SERPAPI_API_KEY || "");

    const searchResponse = await fetch(searchUrl.toString());

    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      console.error("SerpApi search error:", searchData);

      return Response.json(
        { error: "Could not search for products." },
        { status: 500 }
      );
    }
const topProducts = (searchData.visual_matches || []).slice(0, 5);

return Response.json({
  products: topProducts,
});
  } catch (error) {
    console.error("SerpApi error:", error);

    return Response.json(
      { error: "Something went wrong while searching for products." },
      { status: 500 }
    );
  }
}
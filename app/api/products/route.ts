import sharp from "sharp";

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

    // Convert the uploaded image into a Buffer
    const bytes = await image.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    // Compress the image so it stays safely below SerpApi's 500 KB limit
    let quality = 80;
    let compressedBuffer = await sharp(inputBuffer)
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
        mozjpeg: true,
      })
      .toBuffer();

    // If the image is still too large, reduce JPEG quality
    while (compressedBuffer.length > 450 * 1024 && quality > 30) {
      quality -= 10;

      compressedBuffer = await sharp(inputBuffer)
        .resize({
          width: 1200,
          height: 1200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({
          quality,
          mozjpeg: true,
        })
        .toBuffer();
    }

    console.log(
      `Original image: ${(inputBuffer.length / 1024).toFixed(1)} KB`
    );

    console.log(
      `Compressed image: ${(compressedBuffer.length / 1024).toFixed(1)} KB`
    );

    // Create a Blob from the compressed image
    const compressedBlob = new Blob([compressedBuffer], {
      type: "image/jpeg",
    });

    // Prepare the image upload for SerpApi
    const uploadForm = new FormData();

    uploadForm.append("image", compressedBlob, "product.jpg");
    uploadForm.append(
      "api_key",
      process.env.SERPAPI_API_KEY || ""
    );

    // Upload the compressed image to SerpApi
    const uploadResponse = await fetch(
      "https://serpapi.com/image",
      {
        method: "POST",
        body: uploadForm,
      }
    );

   const uploadText = await uploadResponse.text();

let uploadData: any;

try {
  uploadData = JSON.parse(uploadText);
} catch {
  console.error("SerpApi returned non-JSON response:", uploadText);

  return Response.json(
    {
      error: `SerpApi error: ${uploadText}`,
    },
    { status: 500 }
  );
}

if (!uploadResponse.ok || !uploadData.image_id) {
  console.error("SerpApi image upload error:", uploadData);

  return Response.json(
    {
      error:
        uploadData.error ||
        "Could not upload image to SerpApi.",
    },
    { status: 500 }
  );
}

    // Search Google Lens for products
    const searchUrl = new URL(
      "https://serpapi.com/search.json"
    );

    searchUrl.searchParams.set(
      "engine",
      "google_lens"
    );

    searchUrl.searchParams.set(
      "image_id",
      uploadData.image_id
    );

    searchUrl.searchParams.set(
      "type",
      "products"
    );

    searchUrl.searchParams.set(
      "api_key",
      process.env.SERPAPI_API_KEY || ""
    );

    const searchResponse = await fetch(
      searchUrl.toString()
    );

    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      console.error("SerpApi search error:", searchData);

      return Response.json(
        { error: "Could not search for products." },
        { status: 500 }
      );
    }
console.log(
  "SerpApi product summary:",
  (searchData.visual_matches || []).slice(0, 5).map((product: any) => ({
    title: product.title,
    source: product.source,
    price: product.price,
    rating: product.rating,
    reviews: product.reviews,
    link: product.link,
    in_stock: product.in_stock,
  }))
);
    // Return only the top 5 products
    const topProducts = (
      searchData.visual_matches || []
    ).slice(0, 5);

    return Response.json({
      products: topProducts,
    });
  } catch (error) {
    console.error("SerpApi error:", error);

    return Response.json(
      {
        error:
          "Something went wrong while searching for products.",
      },
      { status: 500 }
    );
  }
}
"use client";

import { useState } from "react";

function CameraIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 7h3l1.5-2h7L17 7h3v12H4V7Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="10.8" cy="10.8" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 4h2l2.2 11h10.5l2-8H6" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
      <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M5.2 7.1A2.1 2.1 0 1 0 5.2 3a2.1 2.1 0 0 0 0 4.1ZM3.4 20.8h3.6V9.2H3.4v11.6ZM9.2 9.2h3.5v1.6h.1c.5-.9 1.7-2 3.6-2 3.8 0 4.5 2.5 4.5 5.8v6.2h-3.6v-5.5c0-1.3 0-3.1-1.9-3.1s-2.2 1.4-2.2 3v5.6H9.2V9.2Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.3-1.1.6-1.4-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.7 1 .7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export default function Home() {
const [image, setImage] = useState<string | null>(null);
const [imageFile, setImageFile] = useState<File | null>(null);
const [products, setProducts] = useState<any[]>([]);
const [aiResult, setAiResult] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

  function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
      setProducts([]);
    }
  }

  async function findProduct() {
  if (!imageFile) return;

  setLoading(true);
  setProducts([]);
  setAiResult(null);

  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    // Step 1: Ask OpenAI to identify the main product
    const analyzeResponse = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const analyzeData = await analyzeResponse.json();

    if (!analyzeResponse.ok) {
      throw new Error(
        analyzeData.error || "Could not analyze the image."
      );
    }

    setAiResult(analyzeData.result || null);

    // Step 2: Search for matching products using SerpApi
    const productsResponse = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    const productsData = await productsResponse.json();

    if (!productsResponse.ok) {
      throw new Error(
        productsData.error || "Could not find products."
      );
    }

    setProducts(productsData.products || []);
  } catch (error) {
    console.error(error);

    setProducts([
      {
        error:
          error instanceof Error
            ? error.message
            : "Sorry, we could not find products for this image.",
      },
    ]);
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen overflow-hidden bg-[#eee8dc] text-[#172019]">

      {/* TOP NAVIGATION */}
      <header className="relative z-20 border-b border-[#ddd6c8] bg-[#f8f5ee]/95 backdrop-blur">
        <div className="mx-auto flex h-[86px] max-w-[1400px] items-center justify-between px-7 lg:px-12">

          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-10 items-center justify-center rounded-lg border-2 border-[#172019]">
              <span className="text-2xl">♧</span>
            </div>

            <div>
              <div className="font-serif text-[25px] leading-none">
                Product Finder
              </div>

              <div className="mt-1 text-[9px] tracking-[0.28em] text-[#687065]">
                SEE IT. FIND IT. OWN IT.
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-10 text-[16px] md:flex">
            <a
              href="#home"
              className="border-b-2 border-[#40563d] pb-1 text-[#40563d]"
            >
              Home
            </a>

            <a
              href="#about"
              className="transition hover:text-[#40563d]"
            >
              About
            </a>
          </nav>

          <div className="rounded-full bg-[#efdfcd] px-5 py-3 text-sm text-[#514334]">
            ✦ &nbsp; AI Agent by{" "}
            <span className="font-semibold">
              Bhavy Gandhi
            </span>
          </div>
        </div>
      </header>

      {/* MAIN HERO */}
      <section
        id="home"
        className="relative min-h-[calc(100vh-86px)]"
      >

        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-[#ddd8c7] opacity-70 blur-3xl" />

          <div className="absolute bottom-0 left-[8%] h-[420px] w-[420px] rounded-full bg-[#c9c9b3] opacity-30 blur-3xl" />

          <div className="absolute -right-40 top-10 h-[700px] w-[700px] rounded-full bg-[#e0cdb9] opacity-60 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-[30%] w-full bg-gradient-to-t from-[#d7c7b0]/50 to-transparent" />

          <div className="absolute bottom-0 left-0 hidden h-[430px] w-[310px] rounded-tr-[180px] bg-[#d7c7b4]/60 lg:block" />

          <div className="absolute bottom-0 left-[90px] hidden h-[180px] w-[330px] rounded-t-[160px] bg-[#b89f7e]/30 lg:block" />

          <div className="absolute left-[55px] top-[150px] hidden h-[230px] w-[15px] rounded-full bg-[#3e3d35]/50 lg:block" />

          <div className="absolute left-[35px] top-[125px] hidden h-[70px] w-[75px] rounded-t-full bg-[#46453e] lg:block" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1400px] gap-10 px-7 py-12 md:grid-cols-[0.95fr_1.05fr] md:px-8 md:py-10">

          {/* LEFT SIDE */}
          <div className="flex flex-col justify-center">

            <div className="mb-5 text-[11px] font-medium tracking-[0.42em] text-[#65725f]">
              AI POWERED PRODUCT SEARCH
            </div>

            <h1 className="max-w-[600px] font-serif text-[62px] leading-[0.91] tracking-[-0.035em] md:text-[76px] lg:text-[82px]">
              Turn
              <br />
              Inspiration
              <br />
              into{" "}
              <span className="text-[#52684d]">
                Reality.
              </span>
            </h1>

            <p className="mt-7 max-w-[570px] text-[18px] leading-7 text-[#5d645d]">
              Upload a photo of any product and let AI find it for you.
              Discover similar products, brands, and where to buy,
              all in seconds.
            </p>

            {/* THREE STEPS */}
            <div className="mt-9 grid max-w-[560px] grid-cols-3 gap-4">

              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e2e1d3] text-[#30462f]">
                  <CameraIcon />
                </div>

                <p className="mt-3 text-sm leading-5">
                  Upload
                  <br />
                  a photo
                </p>
              </div>

              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e2e1d3] text-[#30462f]">
                  <SearchIcon />
                </div>

                <p className="mt-3 text-sm leading-5">
                  AI analyzes
                  <br />
                  the product
                </p>
              </div>

              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e2e1d3] text-[#30462f]">
                  <CartIcon />
                </div>

                <p className="mt-3 text-sm leading-5">
                  Get similar
                  <br />
                  products & links
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col justify-center">

            {/* UPLOAD CARD */}
            <div className="rounded-[22px] border border-white/80 bg-white/90 p-5 shadow-[0_25px_70px_rgba(60,55,42,0.14)] backdrop-blur md:p-7">

              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Upload a product photo
                </h2>

                <span className="text-xs text-[#7d817a]">
                  JPG, PNG or WEBP
                </span>
              </div>

              <label className="block cursor-pointer">
                <div className="flex min-h-[280px] items-center justify-center rounded-[17px] border-2 border-dashed border-[#c7c8bd] bg-[#fbfaf7] p-5 transition hover:border-[#677761]">

                  {image ? (
                    <div className="relative w-full">

                      <img
                        src={image}
                        alt="Uploaded product"
                        className="mx-auto max-h-[310px] w-full rounded-xl object-contain"
                      />

                      <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl shadow">
                        ×
                      </div>

                    </div>
                  ) : (
                    <div className="text-center">

                      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e7e7dc] text-[#40563d]">
                        <CameraIcon />
                      </div>

                      <p className="text-lg font-medium">
                        Drag & drop your image here
                      </p>

                      <p className="mt-2 text-sm text-[#858981]">
                        or click to browse
                      </p>

                      <div className="mt-5 inline-flex rounded-full bg-[#40563d] px-7 py-3 text-sm font-medium text-white">
                        Choose Image
                      </div>

                    </div>
                  )}

                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={findProduct}
                disabled={!imageFile || loading}
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-[#a4aa9d] px-6 py-4 text-base font-medium text-white transition hover:bg-[#40563d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SparkleIcon />

                {loading
                  ? "Finding Products..."
                  : "Find Similar Products"}
              </button>

            </div>
{/* AI IDENTIFICATION */}
{aiResult && (
  <div className="mt-5 rounded-[22px] border border-[#e2ded3] bg-[#f8f5ee] p-5 shadow-[0_15px_45px_rgba(60,55,42,0.08)]">
    <div className="mb-3 flex items-center gap-2">
      <span className="text-[#c8a32b]">✦</span>

      <h2 className="text-lg font-semibold text-[#283128]">
        AI Identified
      </h2>
    </div>

    <div className="rounded-[15px] bg-white p-4">
      <p className="whitespace-pre-wrap text-sm leading-6 text-[#5d645d]">
        {aiResult}
      </p>
    </div>
  </div>
)}

{/* PRODUCT RESULTS */}
            {/* PRODUCT RESULTS */}
            <div className="mt-5 rounded-[22px] border border-white/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(60,55,42,0.10)] backdrop-blur md:p-6">

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <span className="text-[#c8a32b]">✦</span>
                  Similar Products
                </div>

                {products.length > 0 && (
                  <span className="text-xs text-[#7d817a]">
                    Top {Math.min(products.length, 5)} matches
                  </span>
                )}
              </div>

              <div className="rounded-[17px] bg-[#faf9f5] p-4">

                {loading ? (

                  <div className="flex min-h-[180px] items-center justify-center">
                    <div className="text-center">

                      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#d8d8cf] border-t-[#40563d]" />

                      <p className="text-sm text-[#6f766e]">
                        Finding the best matches...
                      </p>

                    </div>
                  </div>

                ) : products.length > 0 ? (

                  <div className="space-y-3">

                    {products.slice(0, 5).map((product, index) => (

                      product.error ? (

                        <div
                          key={index}
                          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                          {product.error}
                        </div>

                      ) : (

                        <div
                          key={index}
                          className="flex gap-4 rounded-xl border border-[#e5e3dc] bg-white p-3 transition hover:shadow-md"
                        >

                          {product.thumbnail ? (

                            <img
                              src={product.thumbnail}
                              alt={product.title || "Product"}
                              className="h-24 w-24 shrink-0 rounded-lg object-cover"
                            />

                          ) : (

                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-[#eeeae1] text-xs text-[#858981]">
                              No image
                            </div>

                          )}

                          <div className="min-w-0 flex-1">

                            <h3 className="line-clamp-2 text-sm font-semibold text-[#283128]">
                              {product.title || "Product"}
                            </h3>

                            <p className="mt-1 text-xs text-[#737970]">
                              {product.source || "Online Store"}
                            </p>

                           <p className="mt-2 text-base font-semibold text-[#40563d]">
  {product.price
    ? typeof product.price === "object"
      ? product.price.value
      : product.price
    : "Price unavailable"}
</p>

                            {product.rating && (
                              <p className="mt-1 text-xs text-[#737970]">
                                ⭐ {product.rating}

                                {product.reviews
                                  ? ` (${product.reviews})`
                                  : ""}
                              </p>
                            )}

                            {product.link && (
                              <a
                                href={product.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-xs font-semibold text-[#40563d] underline underline-offset-2 transition hover:text-[#283d2b]"
                              >
                                View Product →
                              </a>
                            )}

                          </div>

                        </div>

                      )

                    ))}

                  </div>

                ) : (

                  <div className="flex min-h-[180px] items-center justify-center text-center">

                    <div>

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e7e7dc] text-[#40563d]">
                        <SearchIcon />
                      </div>

                      <p className="mt-4 text-sm leading-6 text-[#6f766e]">
                        Upload an image and click
                        <br />

                        <span className="font-medium">
                          "Find Similar Products"
                        </span>

                        <br />

                        to see product matches here.
                      </p>

                    </div>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SMALL FOOTER */}
      <footer
        id="about"
        className="relative z-10 border-t border-[#ddd8cd] bg-[#f8f5ee] px-7 py-5 lg:px-12"
      >

        <div className="mx-auto flex max-w-[1400px] items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-8 items-center justify-center rounded-md border border-[#172019]">
              <span className="text-lg">♧</span>
            </div>

            <div className="hidden sm:block">

              <div className="font-serif text-lg leading-none">
                Product Finder
              </div>

              <div className="mt-1 text-[7px] tracking-[0.25em] text-[#737970]">
                SEE IT. FIND IT. OWN IT.
              </div>

            </div>

          </div>

          <div className="text-sm text-[#646b63]">
            AI Agent by{" "}
            <span className="font-semibold text-[#30462f]">
              Bhavy Gandhi
            </span>
          </div>

          <div className="flex items-center gap-3">

            <a
              href="https://www.linkedin.com/in/bhavy-/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bhavy Gandhi on LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dedbd2] bg-white text-[#172019] transition hover:-translate-y-1 hover:bg-[#e8eadf]"
            >
              <LinkedInIcon />
            </a>

            <a
              href="https://github.com/bhavygandhi125273-sketch"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bhavy Gandhi on GitHub"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dedbd2] bg-white text-[#172019] transition hover:-translate-y-1 hover:bg-[#e8eadf]"
            >
              <GitHubIcon />
            </a>

            <a
              href="mailto:bhavya1999gandhi@gmail.com"
              aria-label="Email Bhavy Gandhi"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dedbd2] bg-white text-[#172019] transition hover:-translate-y-1 hover:bg-[#e8eadf]"
            >
              <MailIcon />
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}
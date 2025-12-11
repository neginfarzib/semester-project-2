import { getBlogListing as getBlogListing } from "./listing-details.js";
const options = { year: "numeric", month: "long", day: "numeric" };
const localDateTime = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false
};

function showListingDetailSkeleton(container) {
  container.innerHTML = `
    <div class="card shadow w-75 mx-auto my-5 p-4">
      <div class="placeholder-glow text-center mb-3">
        <!-- Title placeholder -->
        <h2 class="card-title mb-3">
          <span class="placeholder col-8"></span>
        </h2>
      </div>

      <!-- Image placeholder -->
      <div class="placeholder-glow mb-4">
        <span class="placeholder col-12" style="display:block; height:300px; border-radius:0.5rem;"></span>
      </div>

      <!-- Body text placeholder -->
      <div class="placeholder-glow mb-4">
        <p class="fs-5 mb-2">
          <span class="placeholder col-12 mb-1"></span>
          <span class="placeholder col-11 mb-1"></span>
          <span class="placeholder col-10 mb-1"></span>
          <span class="placeholder col-12 mb-1"></span>
          <span class="placeholder col-9"></span>
        </p>
      </
      div>

      <!-- Author and publish date placeholders -->

      <div class="d-flex jus
      tify-content-between mt-4 placeholder-glow">
        <div class="d-flex align-items-center">
          <span class="fw-bold me-1 fs-3">By:</span>

          <span class="placeholder col-3" style="height:1.5rem;"></span>
        </div>
        <div class="d-flex align-items-center">
          <span class="fw-bold me-1 fs-3">Published on:</span>
    
          <span class="placeholder col-4" style="height:1.5rem;"></span>
        </div>
      </div>

    </div>
  `;
}
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("blog-listing-id");

  const blogListingContainer = document.getElementById("blog-listing-container");

  // 🦴 Show skeleton immediately
  showListingDetailSkeleton(blogListingContainer);

  try {
    const blogListing = await getBlogListing(listingId);
    console.log(blogListing);

    // Replace skeleton with real content
    blogListingContainer.innerHTML = `
      <div class="card shadow w-75 mx-auto my-5 p-4">
        <h2 id="blog-listing-details-title" class="card-title mb-3 text-center"></h2>
        <img id="blog-listing-details-img" class="card-img-top rounded mb-4" src="" alt="">
        <div id="blog-listing-details-img-second" class="d-flex flex-wrap mb-4"></div>
        <div class="public-listing-text-container">
          <pre class="fs-5" id="blog-listing-details-body"></pre>
          <div class="d-flex justify-content-between mt-4">
            <div class="d-flex align-items-center">
              <span class="fw-bold me-1 fs-5">By:</span>
              <span id="blog-listing-details-author" class="fs-5 text-dark"></span>          
            </div>
            <div class="d-flex align-items-center">
              <span class="fw-bold me-1 fs-5">Published on:</span>
              <span id="blog-listing-details-publish-date" class="fs-5 text-secondary"></span>
            </div>
          </div>
          <div id="bids-container" class="mt-4">
            <h5 class="mt-4">Bids History:</h5>
            <ul id="bids-list" class="list-group list-group-flush">
            </ul>
        </div>
        </div>
      </div>
    `;

    // Fill data as before
    document.getElementById("blog-listing-details-title").textContent = blogListing.title;

    if (blogListing.media && blogListing.media.length > 0) {
      const mainImg = document.getElementById("blog-listing-details-img");
      mainImg.src = blogListing.media[0]?.url || "";
      mainImg.alt = blogListing.media[0]?.alt || "";

      const secondImgContainer = document.getElementById("blog-listing-details-img-second");
      if (blogListing.media.length > 1) {
        secondImgContainer.innerHTML = "";

        // Loop through remaining images
        for (let i = 1; i < blogListing.media.length; i++) {
          const item = blogListing.media[i];

          const thumb = document.createElement("img");
          thumb.src = item.url || "";
          console.log(thumb.src);

          thumb.alt = item.alt || "";
          console.log(thumb.alt);
          thumb.className = "rounded me-2 mt-2";
          thumb.style.width = "100px"; // small thumbnail width
          thumb.style.cursor = "pointer";

          thumb.addEventListener("click", () => {
            const oldSrc = mainImg.src;
            const oldAlt = mainImg.alt;

    
            mainImg.src = item.url;
            mainImg.alt = item.alt;

            item.url = oldSrc;
            item.alt = oldAlt;

            thumb.src = item.url;
            thumb.alt = item.alt;
          });

          secondImgContainer.appendChild(thumb);
        }
      }
    }

    document.getElementById("blog-listing-details-body").textContent = blogListing.description;
    document.getElementById("blog-listing-details-author").textContent = blogListing.seller.name;

    const date = new Date(blogListing.created);
    document.getElementById("blog-listing-details-publish-date").textContent = date.toLocaleDateString("en-US", localDateTime);
    document.getElementById("blog-listing-details-publish-date").textContent = dayjs(date).format("YYYY-MM-DD HH:mm");

    const bidsList = document.getElementById("bids-list");
    if (blogListing.bids && blogListing.bids.length > 0) {
      const blogListingSorted = blogListing.bids.sort((a, b) => b.amount - a.amount);

      blogListingSorted.forEach(bid => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        const formatedCreateDate = dayjs(bid.created).format("YYYY-MM-DD HH:mm");

        const bidderSpan = document.createElement("span");
        bidderSpan.textContent = bid.bidder.name;
        bidderSpan.style.minWidth = "150px";

        // Create a span for date with faded color and smaller text
        const dateSpan = document.createElement("span");
        dateSpan.textContent = formatedCreateDate;
        dateSpan.classList.add("text-muted", "small");

        // Append spans to list item
        listItem.appendChild(bidderSpan);
        listItem.appendChild(dateSpan);

        const bidsListSpan = document.createElement("span");
        bidsListSpan.classList.add("badge", "bg-primary", "rounded-pill");
        bidsListSpan.textContent = `${bid.amount} credit`;
        listItem.appendChild(bidsListSpan);

        bidsList.appendChild(listItem);
      });
    } else {
      const noBidsItem = document.createElement("li");
      noBidsItem.classList.add("list-group-item", "text-muted");
      noBidsItem.textContent = "No bids placed yet.";
      bidsList.appendChild(noBidsItem);
    }
  } catch (error) {
    console.error("Error loading listing details:", error);
    blogListingContainer.innerHTML = `<p class="alert alert-danger text-center">Failed to load post.</p>`;
  }
});

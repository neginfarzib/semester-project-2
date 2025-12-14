import { getBlogListing as getBlogListing } from "./listing-details.js";
import { fetchUserProfile } from "./profile.js";
import { placeBidAPI } from "./listing.js";

// @ts-ignore
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
  const userProfile = await fetchUserProfile();

  // Set credit
  const userCreditElement = document.getElementById("user-credit");
  if (userCreditElement && userProfile) {
    userCreditElement.classList.add("badge", "bg-success", "rounded-pill");
    userCreditElement.textContent = "credit: " + userProfile.credits;
  }

  // 🦴 Show skeleton immediately
  showListingDetailSkeleton(blogListingContainer);

  try {
    // @ts-ignore
    const blogListing = await getBlogListing(listingId);

    const createdDate = new Date(blogListing.created);
    const endDate = new Date(blogListing.endsAt);

    console.log(blogListing);
    // Replace skeleton with real content
    blogListingContainer.innerHTML = `
    <div class="row justify-content-center">
    <div class="col-12 col-lg-9">
      <div class="card shadow my-3 p-4">
        <h2 id="blog-listing-details-title" class="card-title mb-3 text-center"></h2>
        <img id="blog-listing-details-img" class="card-img-top rounded mb-4" src="" alt="">
        <div id="blog-listing-details-img-second" class="d-flex flex-wrap mb-4"></div>
        <div class="public-listing-text-container">
          <pre class="fs-5" id="blog-listing-details-body"></pre>
          <div class="d-flex flex-column justify-content-between mt-4">
            <div class="d-flex align-items-center">
              <span class="fw-bold me-1 fs-6">By:</span>
              <span id="blog-listing-details-author" class="fs-6 text-dark"></span>          
            </div>
            <div class="d-flex align-items-center">
              <span class="fw-bold me-1 fs-6">Published on:</span>
              <span id="blog-listing-details-publish-date" class="fs-6 text-secondary"></span>
            </div>
            <div class="d-flex align-items-center">
              <span class="fw-bold me-1 fs-6">End At:</span>
              <span id="blog-listing-details-end-date" class="fs-6 text-secondary"></span>
            </div>
          </div>
          <div id="bids-container" class="mt-4">
            <h5 class="mt-4">Bids History:</h5>
            <ul id="bids-list" class="list-group list-group-flush">
            </ul>
        </div>
        <form id="index-listing-bid-form">
          <div class="d-flex align-items-center gap-2 mt-4">
            <input type="hidden" id="index-listing-id">
            <button type="submit" class="btn btn-primary">Place a bid</button>
            <input type="number" id="bid-amount" class="form-control" placeholder="Enter your bid" min="1" style="width: 150px;">
        </div>
        <div class="row">
            <p id="errorMessage"></p>
        </div>
       </form>
      </div>
      </div>
      </div>
    `;

    // showing success message after placing bid
    const msg = localStorage.getItem("bidSuccess");
    if (msg) {
      const errorMessageElement = document.getElementById("errorMessage");
      errorMessageElement.classList.add("alert", "alert-success", "mt-4", "text-center");
      errorMessageElement.style.display = "block";
      errorMessageElement.innerHTML = msg;

      localStorage.removeItem("bidSuccess");
    }

    // Removing plece-bid for user self listing
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    if (blogListing.seller.name === name && blogListing.seller.email === email) {
      const indexListingBidForm = document.getElementById("index-listing-bid-form");
      indexListingBidForm.innerHTML = "";
    } else {
      // @ts-ignore
      document.getElementById("index-listing-id").value = listingId;
    }

    // checking end date
    const now = new Date();
    if (endDate < now || endDate == now) {
      const indexListingBidForm = document.getElementById("index-listing-bid-form");
      indexListingBidForm.innerHTML = "";
    }
    // Fill data as before
    document.getElementById("blog-listing-details-title").textContent = blogListing.title;

    if (blogListing.media && blogListing.media.length > 0) {
      const mainImg = document.getElementById("blog-listing-details-img");
      // @ts-ignore
      mainImg.src = blogListing.media[0]?.url || "";
      // @ts-ignore
      mainImg.alt = blogListing.media[0]?.alt || "";

      const secondImgContainer = document.getElementById("blog-listing-details-img-second");
      if (blogListing.media.length > 1) {
        secondImgContainer.innerHTML = "";

        // Loop through remaining images
        for (let i = 1; i < blogListing.media.length; i++) {
          const item = blogListing.media[i];

          const thumb = document.createElement("img");
          thumb.src = item.url || "";
          thumb.alt = item.alt || "";
          thumb.className = "rounded me-2 mt-2";
          thumb.style.width = "100px"; // small thumbnail width
          thumb.style.cursor = "pointer";

          thumb.addEventListener("click", () => {
            // @ts-ignore
            const oldSrc = mainImg.src;
            // @ts-ignore
            const oldAlt = mainImg.alt;

            // @ts-ignore
            mainImg.src = item.url;
            // @ts-ignore
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

    // @ts-ignore
    document.getElementById("blog-listing-details-publish-date").textContent = createdDate.toLocaleDateString("en-US", localDateTime);
    // @ts-ignore
    document.getElementById("blog-listing-details-publish-date").textContent = dayjs(createdDate).format("YYYY-MM-DD HH:mm");
    // @ts-ignore
    document.getElementById("blog-listing-details-end-date").textContent = dayjs(endDate).format("YYYY-MM-DD HH:mm");

    const bidsList = document.getElementById("bids-list");
    if (blogListing.bids && blogListing.bids.length > 0) {
      const blogListingSorted = blogListing.bids.sort((a, b) => b.amount - a.amount);

      blogListingSorted.forEach((bid) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        // @ts-ignore
        const formatedCreateDate = dayjs(bid.created).format("YYYY-MM-DD HH:mm");

        const bidderSpan = document.createElement("span");
        bidderSpan.textContent = bid.bidder.name;
        bidderSpan.style.minWidth = "90px";

        // Create a span for date with faded color and smaller text
        const dateSpan = document.createElement("span");
        dateSpan.textContent = formatedCreateDate;
        dateSpan.classList.add("text-muted", "small", "me-3");

        // Append spans to list item
        listItem.appendChild(bidderSpan);
        listItem.appendChild(dateSpan);

        const bidsListSpan = document.createElement("span");
        bidsListSpan.classList.add("text-muted", "small");
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

    // handling form submit
    const indexListingBidForm = document.getElementById("index-listing-bid-form");
    if (indexListingBidForm) {
      document.getElementById("index-listing-bid-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        // @ts-ignore
        const bidAmountStr = document.getElementById("bid-amount").value.trim();
        const bidAmount = Number(bidAmountStr);
        const isAllowedToPlaceBid = await checkBidAmount(bidAmount, blogListing, userProfile);
        if (isAllowedToPlaceBid) {
          try {
            await placeBidAPI(bidAmount, listingId);
            localStorage.setItem("bidSuccess", "Bid was placed successfully");
            window.location.reload();
          } catch (error) {
            const errorMessageElement = document.getElementById("errorMessage");
            errorMessageElement.classList.add("alert", "alert-danger", "mt-4", "text-center");
            errorMessageElement.style.display = "block";
            errorMessageElement.innerHTML = error;

            console.error("Error fetching data:", error);
          }
        }
      });
    }
  } catch (error) {
    console.error("Error loading listing details:", error);
    blogListingContainer.innerHTML = `<p class="alert alert-danger text-center">Failed to load post.</p>`;
  }
});

async function checkBidAmount(bidAmount, blogListing, userProfile) {
  const token = localStorage.getItem("accessToken");

  if (!token || token === "undefined" || token === "null") {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.classList.add("alert", "alert-danger", "mt-4", "text-center");
    errorMessageElement.style.display = "block";
    errorMessageElement.innerHTML = "You need to login first to be able place bid on a listing";
    return false;
  }

  if (!blogListing.seller) {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.classList.add("alert", "alert-danger", "mt-4", "text-center");
    errorMessageElement.style.display = "block";
    errorMessageElement.innerHTML = "Seller is unknown. Please contact support";
    return false;
  }

  if (!blogListing.seller.name === userProfile.name && blogListing.seller.email === userProfile.email) {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.classList.add("alert", "alert-danger", "mt-4", "text-center");
    errorMessageElement.style.display = "block";
    errorMessageElement.innerHTML = "You can not place a bid on one of your listings";
    return false;
  }

  if (typeof bidAmount !== "number" || Number.isNaN(bidAmount)) {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.classList.add("alert", "alert-danger", "mt-4", "text-center");
    errorMessageElement.style.display = "block";
    errorMessageElement.innerHTML = "Bid Amount should be number";
    return false;
  }

  if (!checkWithCredit(userProfile, bidAmount)) {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.classList.add("alert", "alert-danger", "mt-4", "text-center");
    errorMessageElement.style.display = "block";
    errorMessageElement.innerHTML = "Bid Amount exceed your credit";
    return false;
  }

  if (!shouldBeHigherThanHighestBid(bidAmount, blogListing)) {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.classList.add("alert", "alert-danger", "mt-4", "text-center");
    errorMessageElement.style.display = "block";
    errorMessageElement.innerHTML = "Bid Amount should be higher than highest bid";
    return false;
  }
  return true;
}
function checkWithCredit(userProfile, bidAmount) {
  if (bidAmount > userProfile.credits) {
    return false;
  }
  return true;
}

function shouldBeHigherThanHighestBid(bidAmount, blogListing) {
  const sortedBids = blogListing.bids.sort((a, b) => b.amount - a.amount);
  if (bidAmount <= sortedBids[0].amount) {
    return false;
  }
  return true;
}

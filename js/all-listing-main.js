import { allListings, searchListingAPI } from "./manage-all-listings.js";
import { fetchUserProfile } from "./profile.js";
const base_url = "https://v2.api.noroff.dev";
const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false
};

/**
 * Fetching all listings. Then sort them by date
 *
 * @return {Promise<object[]>} A promise that resolves to an array of listing objects sorted by date.
 * */
export async function dateSortedAllListings() {
  let listings = await allListings();
  // @ts-ignore
  let sortedAllListings = listings.data.sort((a, b) => new Date(b.endsAt) - new Date(a.endsAt));
  return sortedAllListings;
}

function showSkeletons(container, count = 3) {
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const skeletonCard = document.createElement("div");
    skeletonCard.classList.add("card", "w-75", "mx-auto", "shadow", "mb-4");
    skeletonCard.innerHTML = `
      <div class="card-body">
        <!-- Author placeholder -->
        <div class="d-flex align-items-center mb-2 placeholder-glow">
          <span class="placeholder rounded-circle me-2" style="width:32px; height:32px;"></span>
          <span class="placeholder col-4 mb-0"></span>
        </div>

        <!-- Date placeholder -->
        <p class="text-muted small mb-3 placeholder-glow">
          <span class="placeholder col-3"></span>
        </p>

        <!-- Title placeholder -->
        <h6 class="fw-semibold placeholder-glow">
          <span class="placeholder col-6"></span>
        </h6>

        <!-- Image placeholder -->
        <div class="placeholder-glow mb-2">
          <span class="placeholder col-12" style="height: 200px; display:block; border-radius:0.25rem;"></span>
        </div>

        <!-- Content placeholder -->
        <p class="card-text placeholder-glow">
          <span class="placeholder col-12 mb-1"></span>
          <span class="placeholder col-12 mb-1"></span>
          <span class="placeholder col-10"></span>
        </p>

        <!-- Read more placeholder -->
        <p class="text-primary fw-semibold placeholder-glow">
          <span class="placeholder col-3"></span>
        </p>
      </div>
    `;
    container.appendChild(skeletonCard);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const listingThumbnail = document.getElementById("listing-container");
  const userProfile = await fetchUserProfile();

  showSkeletons(listingThumbnail);

  const listings = await dateSortedAllListings();
  displayListings(listings);

  function displayListings(listings) {
    listingThumbnail.innerHTML = "";

    // Set credit
    const userCreditElement = document.getElementById("user-credit");
    if (userCreditElement && userProfile) {
      userCreditElement.classList.add("badge", "bg-success", "rounded-pill");
      userCreditElement.textContent = "credit: " + userProfile.credits;
    }

    const inputSearchListingsDiv = document.createElement("div");
    inputSearchListingsDiv.classList.add("w-75", "mx-auto", "mb-4", "my-4");

    const inputBtnSearchListingsDiv = document.createElement("div");
    inputBtnSearchListingsDiv.classList.add("d-flex");
    const inputSearchListings = document.createElement("input");
    inputSearchListings.type = "text";
    inputSearchListings.id = "searchListings";
    inputSearchListings.placeholder = "Search all listings ...";
    inputSearchListings.classList.add("form-control", "me-2");
    inputBtnSearchListingsDiv.appendChild(inputSearchListings);
    const searchListingsBtn = document.createElement("button");
    searchListingsBtn.classList.add("btn", "btn-primary", "px-4");
    searchListingsBtn.textContent = "Search";
    searchListingsBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      const searchInput = document.getElementById("searchListings").value.trim();

      showSkeletons(listingThumbnail);

      const searchListingsList = await searchListingAPI(searchInput);
      displayListings(searchListingsList);
    });
    inputBtnSearchListingsDiv.appendChild(searchListingsBtn);
    inputSearchListingsDiv.appendChild(inputBtnSearchListingsDiv);

    const editLineSeperator = document.createElement("div");
    editLineSeperator.classList.add("edit-line-separator", "my-4", "border-5");
    inputSearchListingsDiv.appendChild(editLineSeperator);

    listingThumbnail.appendChild(inputSearchListingsDiv);

    const maxListings = listings.length;
    const listingToShow = listings.slice(0, maxListings);

    const listingThumbnailContainer = document.createElement("div");
    listingThumbnailContainer.classList.add("container", "mt-5");

    const listingThumbnailContainerRow = document.createElement("div");
    listingThumbnailContainerRow.classList.add("row", "g-3", "justify-content-center");

    listingToShow.forEach(async (listing) => {
      const blogThumbnail = document.createElement("div");
      blogThumbnail.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3", "card", "mx-3", "shadow", "mb-4", "justify-content-center");

      const blogThumbnailDiv = document.createElement("div");
      blogThumbnailDiv.classList.add("card-body");

      const blogThumbnailHref = document.createElement("a");
      blogThumbnailHref.classList.add("text-decoration-none", "text-dark");
      blogThumbnailHref.href = "listing/index.html?blog-listing-id=" + listing.id;
      // blogThumbnailHref.target = '_blank';

      const listingTitle = document.createElement("h4");
      listingTitle.classList.add("fw-semibold", "card-title");
      listingTitle.textContent = listing.title;
      blogThumbnailHref.appendChild(listingTitle);

      if (listing.media) {
        const listingImage = document.createElement("img");
        listingImage.classList.add("card-img-top", "rounded", "mb-2");
        listingImage.src = listing.media[0]?.url || "";
        listingImage.alt = listing.media[0]?.alt || "";
        blogThumbnailHref.appendChild(listingImage);

        // listing.media.forEach(item => {
        //   const listingImage = document.createElement("img");
        //   listingImage.classList.add("card-img-top", "rounded", "mb-2");
        //   listingImage.src = item?.url || "";
        //   listingImage.alt = item?.alt || "";
        //   blogThumbnailHref.appendChild(listingImage);
        // });
      }

      if (listing.seller) {
        const sellerHref = document.createElement("a");
        sellerHref.classList.add("text-decoration-none", "text-dark", "d-flex", "align-items-center", "mb-2");

        const listingAuthorIcon = document.createElement("img");
        listingAuthorIcon.src = "assets/person-icon.svg";
        listingAuthorIcon.alt = "author-icon";
        listingAuthorIcon.width = "32";
        listingAuthorIcon.height = "32";
        listingAuthorIcon.classList.add("me-2");
        sellerHref.appendChild(listingAuthorIcon);

        const listingSeller = document.createElement("h6");
        listingSeller.classList.add("mb-0");
        listingSeller.textContent = listing.seller.name;
        sellerHref.appendChild(listingSeller);

        blogThumbnailHref.appendChild(sellerHref);
      }

      // End date
      const listingEndTimeDiv = document.createElement("div");
      listingEndTimeDiv.classList.add("d-flex", "align-items-center", "mb-3");

      const listingEndTimeText = document.createElement("p");
      listingEndTimeText.classList.add("bold", "smaller", "mb-0", "me-2");
      listingEndTimeText.textContent = "Ends at: ";
      listingEndTimeDiv.appendChild(listingEndTimeText);

      const listingEndTime = document.createElement("p");
      const date = new Date(listing.endsAt);
      const now = new Date();
      if (date > now) {
        listingEndTime.classList.add("text-muted", "small", "mb-0");
        listingEndTime.textContent = date.toLocaleDateString("en-US", options);
        listingEndTimeDiv.appendChild(listingEndTime);
      } else {
        listingEndTime.classList.add("small", "mb-0", "text-danger");
        listingEndTime.textContent = 'Ended !'
        listingEndTimeDiv.appendChild(listingEndTime);
      }

      blogThumbnailHref.appendChild(listingEndTimeDiv);

      // Bids
      const listingBidsDiv = document.createElement("div");
      listingBidsDiv.classList.add("align-items-center", "mb-3");

      if (listing.bids && listing.bids.length > 0) {
        const blogListingSorted = listing.bids.sort((a, b) => b.amount - a.amount);

        blogListingSorted.forEach((bid) => {
          const listItem = document.createElement("li");
          listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

          const bidderSpan = document.createElement("span");
          bidderSpan.textContent = bid.bidder.name;
          bidderSpan.classList.add("text-muted", "small", "mb-0");

          listItem.appendChild(bidderSpan);

          const bidsListSpan = document.createElement("span");
          bidsListSpan.classList.add("text-muted", "small", "mb-0");

          bidsListSpan.textContent = `${bid.amount} credit`;
          listItem.appendChild(bidsListSpan);

          listingBidsDiv.appendChild(listItem);
        });
      } else {
        const noBidsItem = document.createElement("li");
        noBidsItem.classList.add("list-group-item", "text-muted");
        noBidsItem.textContent = "No bids placed yet.";
        listingBidsDiv.appendChild(noBidsItem);
      }
      blogThumbnailHref.appendChild(listingBidsDiv);

      const listingContent = document.createElement("p");
      listingContent.classList.add("card-text");
      listingContent.textContent = listing.description?.split(/\s+/).slice(0, 50).join(" ") || "";
      blogThumbnailHref.appendChild(listingContent);

      const postReadMore = document.createElement("p");
      postReadMore.classList.add("text-primary", "fw-semibold");
      postReadMore.textContent = "Read more...";
      blogThumbnailHref.appendChild(postReadMore);
      blogThumbnailDiv.appendChild(blogThumbnailHref);

      blogThumbnail.appendChild(blogThumbnailDiv);
      // Append the product box to the container
      listingThumbnailContainerRow.appendChild(blogThumbnail);
    });
    listingThumbnailContainer.appendChild(listingThumbnailContainerRow);
    listingThumbnail.appendChild(listingThumbnailContainer);
  }
});

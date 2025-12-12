import { deleteBlogListing, allUsersListings, allUsersBids, allUsersWins } from "./manage-all-listings.js";
import { checkIfAuthenticated } from "./auth-check.js";
import { fetchUserProfile } from "./profile.js";

checkIfAuthenticated();

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
  const editListingsThumbnail = document.getElementById("edit-listings-thumbnail");
  editListingsThumbnail.classList.add("row");
  const userProfile = await fetchUserProfile();

  const nameUser = localStorage.getItem("name");

  showSkeletons(editListingsThumbnail);

  setProfileData(userProfile);

  // Set credit
  const userCreditElement = document.getElementById("user-credit");
  if (userCreditElement && userProfile) {
    userCreditElement.classList.add("badge", "bg-success", "rounded-pill");
    userCreditElement.textContent = "credit: " + userProfile.credits;
  }

  const listings = await allUsersListings(nameUser);
  if (listings != null && listings.data.length > 0) {
    displayListings(editListingsThumbnail, listings.data);
  } else {
    editListingsThumbnail.innerHTML = "";
    editListingsThumbnail.textContent = "No listings data";
  }

  const myBidsThumbnail = document.getElementById("my-bids-thumbnail");
  myBidsThumbnail.classList.add("row");
  const bidsListings = await allUsersBids(nameUser);

  if (bidsListings != null && bidsListings.data.length > 0) {
    console.log(bidsListings);
    displayProfileListing(myBidsThumbnail, bidsListings.data);
  } else {
    myBidsThumbnail.innerHTML = "";
    myBidsThumbnail.textContent = "No bids data";
  }

  const myWinsThumbnail = document.getElementById("my-wins-thumbnail");
  myWinsThumbnail.classList.add("row");
  const winsListings = await allUsersWins(nameUser);

  if (winsListings != null && winsListings.data.length > 0) {
    console.log(winsListings);
    displayListings(myWinsThumbnail, winsListings.data);
  } else {
    myWinsThumbnail.innerHTML = "";
    myWinsThumbnail.textContent = "No bids data";
  }

  function displayListings(ListingsThumbnail, listings) {
    ListingsThumbnail.innerHTML = "";
    listings.forEach((listing) => {
      const blogThumbnail = document.createElement("div");
      blogThumbnail.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3", "card", "mx-3", "shadow", "mb-4", "justify-content-center");

      const blogThumbnailDiv = document.createElement("div");
      blogThumbnailDiv.classList.add("card-body");

      const blogThumbnailHref = document.createElement("a");
      blogThumbnailHref.href = "../listing/index.html?blog-listing-id=" + listing.id;
      blogThumbnailHref.classList.add("text-decoration-none", "text-dark");
      // blogThumbnailHref.target = '_blank';

      const listingTitle = document.createElement("h4");
      listingTitle.classList.add("card-title");
      listingTitle.textContent = listing.title;
      blogThumbnailHref.appendChild(listingTitle);

      const listingImage = document.createElement("img");
      listingImage.classList.add("card-img-top", "rounded", "mb-2");
      listingImage.src = listing.media[0]?.url || "";
      listingImage.alt = listing.media[0]?.alt || "";
      blogThumbnailHref.appendChild(listingImage);

      const listingContent = document.createElement("p");
      listingContent.classList.add("card-text");
      listingContent.textContent = listing.body?.split(/\s+/).slice(0, 50).join(" ") || "";
      blogThumbnailHref.appendChild(listingContent);

      const listingReadMore = document.createElement("p");
      listingReadMore.classList.add("text-primary", "fw-semibold");
      listingReadMore.textContent = "Read more...";
      blogThumbnailHref.appendChild(listingReadMore);

      blogThumbnailDiv.appendChild(blogThumbnailHref);
      blogThumbnail.appendChild(blogThumbnailDiv);

      /* banner */
      const createListingThumbnailBannerDiv = document.createElement("div");
      createListingThumbnailBannerDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "gap-3", "p-2", "rounded");
      createListingThumbnailBannerDiv.style.backgroundColor = "#A8A3A7";

      const listingBannerHrefEdit = document.createElement("a");
      listingBannerHrefEdit.href = "../listing/edit.html?blog-listing-id=" + listing.id;
      listingBannerHrefEdit.classList.add("btn", "btn-outline-secondary", "btn-sm", "p-2");
      const listingImageBannerEdit = document.createElement("img");
      listingImageBannerEdit.classList.add("creat-listing-thumbnail-banner-img");
      listingImageBannerEdit.src = "../assets/pen.svg";
      listingImageBannerEdit.alt = "edit";
      listingImageBannerEdit.width = "20";
      listingImageBannerEdit.height = "20";
      listingBannerHrefEdit.appendChild(listingImageBannerEdit);
      createListingThumbnailBannerDiv.appendChild(listingBannerHrefEdit);

      const listingBannerHrefView = document.createElement("a");
      listingBannerHrefView.href = "../listing/index.html?blog-listing-id=" + listing.id;
      listingBannerHrefView.classList.add("btn", "btn-outline-secondary", "btn-sm", "p-2");
      // listingBannerHrefView.target = '_blank';
      const listingImageBannerView = document.createElement("img");
      listingImageBannerView.classList.add("creat-listing-thumbnail-banner-img");
      listingImageBannerView.src = "../assets/eye.svg";
      listingImageBannerView.alt = "view";
      listingImageBannerView.width = "20";
      listingImageBannerView.height = "20";
      listingBannerHrefView.appendChild(listingImageBannerView);
      createListingThumbnailBannerDiv.appendChild(listingBannerHrefView);

      const listingBannerHrefDelete = document.createElement("a");
      listingBannerHrefDelete.classList.add("btn", "btn-outline-secondary", "btn-sm", "p-2");
      listingBannerHrefDelete.href = "#rr";
      listingBannerHrefDelete.onclick = function (event) {
        event.preventDefault();

        deleteBlogListing(listing.id);
      };
      const listingImageBannerDelete = document.createElement("img");
      listingImageBannerDelete.classList.add("creat-listing-thumbnail-banner-img");
      listingImageBannerDelete.src = "../assets/bin.svg";
      listingImageBannerDelete.alt = "delete";
      listingImageBannerDelete.width = "20";
      listingImageBannerDelete.height = "20";
      listingBannerHrefDelete.appendChild(listingImageBannerDelete);
      createListingThumbnailBannerDiv.appendChild(listingBannerHrefDelete);

      blogThumbnail.appendChild(createListingThumbnailBannerDiv);

      // Append the product box to the container
      ListingsThumbnail.appendChild(blogThumbnail);
    });
    const errorMessageDiv = document.createElement("div");
    errorMessageDiv.classList.add("row");
    const errorMessageP = document.createElement("p");
    errorMessageP.id = "errorMessage";
    errorMessageDiv.appendChild(errorMessageP);
    ListingsThumbnail.appendChild(errorMessageDiv);
  }

  function displayProfileListing(ListingsThumbnail, profiles) {
    ListingsThumbnail.innerHTML = "";
    const profileListingIds = new Set();

    profiles.forEach((profile) => {
      if (profileListingIds.has(profile.listing.id)) {
        console.log("This listing already exist", profile.listing.id);
        return;
      }else{
        profileListingIds.add(profile.listing.id);
      }
      const blogThumbnail = document.createElement("div");
      blogThumbnail.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3", "card", "mx-3", "shadow", "mb-4", "justify-content-center");

      const blogThumbnailDiv = document.createElement("div");
      blogThumbnailDiv.classList.add("card-body");

      const blogThumbnailHref = document.createElement("a");
      blogThumbnailHref.href = "../listing/index.html?blog-listing-id=" + profile.listing.id;
      blogThumbnailHref.classList.add("text-decoration-none", "text-dark");
      // blogThumbnailHref.target = '_blank';

      const listingTitle = document.createElement("h4");
      listingTitle.classList.add("card-title");
      listingTitle.textContent = profile.listing.title;
      blogThumbnailHref.appendChild(listingTitle);

      const listingImage = document.createElement("img");
      listingImage.classList.add("card-img-top", "rounded", "mb-2");
      listingImage.src = profile.listing.media[0]?.url || "";
      listingImage.alt = profile.listing.media[0]?.alt || "";
      blogThumbnailHref.appendChild(listingImage);

      const listingContent = document.createElement("p");
      listingContent.classList.add("card-text");
      listingContent.textContent = profile.listing.description?.split(/\s+/).slice(0, 50).join(" ") || "";
      blogThumbnailHref.appendChild(listingContent);

      const listingReadMore = document.createElement("p");
      listingReadMore.classList.add("text-primary", "fw-semibold");
      listingReadMore.textContent = "Read more...";
      blogThumbnailHref.appendChild(listingReadMore);

      blogThumbnailDiv.appendChild(blogThumbnailHref);
      blogThumbnail.appendChild(blogThumbnailDiv);

      /* banner */
      const createListingThumbnailBannerDiv = document.createElement("div");
      createListingThumbnailBannerDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "gap-3", "p-2", "rounded");
      // Append the product box to the container
      ListingsThumbnail.appendChild(blogThumbnail);
    });
    const errorMessageDiv = document.createElement("div");
    errorMessageDiv.classList.add("row");
    const errorMessageP = document.createElement("p");
    errorMessageP.id = "errorMessage";
    errorMessageDiv.appendChild(errorMessageP);
    ListingsThumbnail.appendChild(errorMessageDiv);
  }
});

async function setProfileData(userProfile) {
  const usernameElement = document.getElementById("user-username");
  const userEmailElement = document.getElementById("user-email");
  const userBioElement = document.getElementById("user-bio");
  const userCreditElement = document.getElementById("user-credit");
  const userBannerElement = document.getElementById("profile-banner");
  const userAvatarElement = document.getElementById("profile-avatar");
  usernameElement.textContent = userProfile?.name;
  userEmailElement.textContent = userProfile?.email;
  userBioElement.textContent = userProfile?.bio;
  userCreditElement.textContent = "Credits: " + userProfile?.credits;
  userBannerElement.src = userProfile.avatar?.url;
  userBannerElement.alt = userProfile.avatar?.alt;
  userAvatarElement.src = userProfile.banner?.url;
  userAvatarElement.alt = userProfile.banner?.alt;
}

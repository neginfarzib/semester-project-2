const base_url = "https://v2.api.noroff.dev";
let postId = "";

/**
 * Edit Listing
 * @param {string} title - Listing title
 * @param {string} body - Listing content
 * @param {string} url - Listing url
 * @param {string} alt - Lisitng alt attribute
 * @param {string} tags - Listing tags
 * @param {string} listingId - Listing ID
 * @return {void}
 *
 * */
export async function editBlogListing(title, body, url,  tags, listingId, endAt) {
  const postData = {
    title: title
  };

  if (body) {
    postData.description = body;
  }

  if (tags && tags.length > 0) {
    postData.tags = [tags.trim()];
  }

  const urls = url.split("\n").filter(u => u.trim() !== "");
  
  postData.media = urls.map(urlAlt => ({
    alt: urlAlt.split("|")[1].trim(),
    url: urlAlt.split("|")[0].trim()
  }));
  
  // In the API there is not possible to update end date
  // postData.endsAt = endAt;


  try {
    let url = `${base_url}/auction/listings/${listingId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "4f20fb44-3b03-4fc3-bc21-5a7fb98d9816"
      },
      body: JSON.stringify(postData)
    });

    if (response.ok) {
      const result = await response.json();
      window.location.href = "../account/profile.html";
    } else {
      const error = await response.json();
      console.log("error.length:" + error.length + "error " + error);

      let messages = "";
      for (let i = 0; i < error.errors.length; i++) {
        messages += error.errors[i].message + "<br>";
      }

      messages = !messages || messages.length === 0 ? "An error occurred. Please try again " : messages;

      const errorMessageElement = document.getElementById("errorMessage");
      errorMessageElement.classList.add("alert", "alert-danger", "mt-4", "text-center");
      errorMessageElement.style.display = "block";
      errorMessageElement.innerHTML = messages;
    }
  } catch (err) {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.classList.add("alert", "alert-danger", "mt-4", "text-center");
    errorMessageElement.style.display = "block";
    errorMessageElement.innerHTML = err;

    console.error("An error occurred:", err);
  }
}

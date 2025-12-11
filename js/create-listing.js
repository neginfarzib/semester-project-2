const base_url = "https://v2.api.noroff.dev";

/**
 * Creating blog Listing
 * @param {string} title - blog listing title
 * @param {string} body - blog listing Description
 * @param {string} url - blog listing url
 * @param {string} alt - blog listing alt attribute
 * @param {string} tags - blog listing tags
 *
 * */
export async function createBlogListing(title, body, url, tags, endDateTime) {
  const postData = {
    title: title
  };

  if (body) {
    postData.body = body;
  }

  if (tags && tags.length > 0) {
    postData.tags = [tags.trim()];
  }

  const urls = url.split("\n").filter(u => u.trim() !== "");

  postData.media = urls.map(urlAlt => ({
    alt: urlAlt.split('|')[1].trim(), 
    url: urlAlt.split('|')[0].trim()
  }));

  postData.endsAt = endDateTime;

  try {
    console.log("Creating blog post...", postData);
    const nameUser = localStorage.getItem("name");
    if (nameUser == null) {
      throw new Error("Need to login again");
    }
    let url = `${base_url}/auction/listings`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "4f20fb44-3b03-4fc3-bc21-5a7fb98d9816"
      },
      body: JSON.stringify(postData)
    });

    if (response.ok) {
      console.log("Blog post created successfully.");
      const result = await response.json();
      window.location.href = "../account/profile.html";
    } else {
      console.log("Failed to create blog post.");
      const error = await response.json();
      console.error("error.length:", error.length, "error ", error);

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

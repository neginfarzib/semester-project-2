import { checkIfAuthenticated } from "./auth-check.js";
import { editBlogListing } from "./edit-listing.js";
import { deleteBlogListing } from "./manage-all-listings.js";
import { getBlogListing } from "./listing-details.js";
let postId = 0;

checkIfAuthenticated();

const spinner = document.getElementById("loading-spinner");

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  postId = params.get("blog-listing-id");

  const blogPost = await getBlogListing(postId);

  const blogPostDetailsTitle = document.getElementById("blog-post-edit-title");
  blogPostDetailsTitle.value = blogPost.title;

  const blogPostDetailsImgUrl = document.getElementById("blog-post-edit-image-urls");

  let imageUrlText = "";
  imageUrlText = blogPost.media.map(item => `${item.url}|${item.alt || ""}`).join("\n");
  blogPostDetailsImgUrl.textContent = imageUrlText;

  const blogPostDetailsBody = document.getElementById("blog-post-edit-body");
  blogPostDetailsBody.textContent = blogPost.description;

  const blogPostEditTags = document.getElementById("blog-post-edit-tags");
  blogPostEditTags.value = blogPost.tags;

  const blogPostEditDate = document.getElementById("blog-post-edit-date");
  // Get local components
  const endAtDate = new Date(blogPost.endsAt);
  const year = endAtDate.getFullYear();
  const month = String(endAtDate.getMonth() + 1).padStart(2, "0");
  const day = String(endAtDate.getDate()).padStart(2, "0");
  const hours = String(endAtDate.getHours()).padStart(2, "0");
  const minutes = String(endAtDate.getMinutes()).padStart(2, "0");
  const endAtLocalDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  blogPostEditDate.value = endAtLocalDateTime;
});

const editPostForm = document.getElementById("edit-post-form");
if (editPostForm) {
  document.getElementById("edit-post-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitter = e.submitter;

    if (submitter) {
      const action = submitter.value; // Retrieve the value of the clicked button

      if (action === "save") {
        spinner.classList.remove("d-none");
        editPostForm.querySelectorAll("input, button").forEach(el => (el.disabled = true));

        const postTitle = document.getElementById("blog-post-edit-title").value.trim();
        const postContent = document.getElementById("blog-post-edit-body").value.trim();
        const imageUrl = document.getElementById("blog-post-edit-image-urls").value;
        const tags = document.getElementById("blog-post-edit-tags").value;
        const endAt = document.getElementById("blog-post-edit-date").value;
        editBlogListing(postTitle, postContent, imageUrl, tags, postId, endAt);
      } else if (action === "delete") {
        if (confirm("Are you sure you want to delete?")) {
          spinner.classList.remove("d-none");
          await deleteBlogListing(postId);
        }
      }
    }
  });
}

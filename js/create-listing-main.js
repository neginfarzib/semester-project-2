import { checkIfAuthenticated } from './auth-check.js';
import { createBlogListing as createBlogListing } from './create-listing.js';

checkIfAuthenticated();
const spinner = document.getElementById('loading-spinner');

const createListingForm = document.getElementById('create-listing-form');
if (createListingForm) {
  document
    .getElementById('create-listing-form')
    .addEventListener('submit', function (e) {
      e.preventDefault();

      spinner.classList.remove('d-none');
      createListingForm
        .querySelectorAll('input, button')
        .forEach((el) => (el.disabled = true));

      const postTitle = document.getElementById('postTitle').value.trim();
      const postContent = document.getElementById('postContent').value.trim();
      const imageUrl = document.getElementById('imageUrl').value;
      const tags = document.getElementById('tags').value;
      const endDateTime = document.getElementById('dateTimeInput').value;

      createBlogListing(postTitle, postContent, imageUrl, tags, endDateTime);
    });
}

const base_url = 'https://v2.api.noroff.dev';
const options = { year: 'numeric', month: 'long', day: 'numeric' };

/**
 *  Fetching a blog listing by ID
 *  @param {number} blogListingId - ID of the blog listing want to fetch from API-server
 *  @return {Promise<object>} post - a listing object
 * */
export async function getBlogListing(blogListingId) {
  try {
    const url = `${base_url}/auction/listings/${blogListingId}?_seller=true&_bids=true`;

    
    const options = {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmVnaW4iLCJlbWFpbCI6Im5lZ2ZhcjQ5NzkxQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzU4ODgyOTk2fQ.G8SDRfET-9DE5XjOSWjDm2wZCRGwErGQnNPaiXgpWjs',
        'X-Noroff-API-Key': '4f20fb44-3b03-4fc3-bc21-5a7fb98d9816',
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching data:', error);

    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.classList.add(
      'alert',
      'alert-danger',
      'mt-4',
      'text-center'
    );
    errorMessageElement.style.display = 'block';
    errorMessageElement.innerHTML = error;
  }
}

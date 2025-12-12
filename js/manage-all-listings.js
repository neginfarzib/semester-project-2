const base_url = 'https://v2.api.noroff.dev';

/**
 * API call for deleting listing from the API-server
 * @param {number} blogListingId - ID of the blogPost which should be deleted
 * @return {void}
 * */
export async function deleteBlogListingServer(blogListingId) {
  try {
    const url = `${base_url}/auction/listings/${blogListingId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
        'X-Noroff-API-Key': '4f20fb44-3b03-4fc3-bc21-5a7fb98d9816',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      window.location.href = '../account/profile.html';
    }
  } catch (error) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.classList.add(
      'alert',
      'alert-danger',
      'mt-4',
      'text-center'
    );
    errorMessageElement.style.display = 'block';
    errorMessageElement.innerHTML = error;

    console.error('Error fetching data:', error);
  }
}

/**
 * Getting confirmation from the user then calling delete API call
 * @param {number} blogListingId - ID of the blog post which should be deleted
 * */
export async function deleteBlogListing(blogListingId) {
  if (confirm('Are you sure you want to delete?')) {
    await deleteBlogListingServer(blogListingId);
  }
}
/**
 * Fetching all blog posts from API-sever
 * @return {Promise<object[]>} array of post fetched from API-server
 * */
export async function allListings() {
  try {
    const options = {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmVnaW4iLCJlbWFpbCI6Im5lZ2ZhcjQ5NzkxQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzU4ODgyOTk2fQ.G8SDRfET-9DE5XjOSWjDm2wZCRGwErGQnNPaiXgpWjs',
        'X-Noroff-API-Key': '4f20fb44-3b03-4fc3-bc21-5a7fb98d9816',
      },
    };
    const url = `${base_url}/auction/listings?_seller=true&_bids=true`;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.classList.add(
      'alert',
      'alert-danger',
      'mt-4',
      'text-center'
    );
    errorMessageElement.style.display = 'block';
    errorMessageElement.innerHTML = error;

    console.error('Error fetching data:', error);
  }
}

/**
 * Searching in posts for the input term
 * @param {string} searchInput - input term to search
 * @return {Promise<object[]>} array of post fetched from API-server
 * */
export async function searchListingAPI(searchInput) {
  try {
    const options = {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmVnaW4iLCJlbWFpbCI6Im5lZ2ZhcjQ5NzkxQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzU4ODgyOTk2fQ.G8SDRfET-9DE5XjOSWjDm2wZCRGwErGQnNPaiXgpWjs',
        'X-Noroff-API-Key': '4f20fb44-3b03-4fc3-bc21-5a7fb98d9816',
      },
    };
    const url = `${base_url}/social/posts/search?q=${searchInput}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.classList.add(
      'alert',
      'alert-danger',
      'mt-4',
      'text-center'
    );
    errorMessageElement.style.display = 'block';
    errorMessageElement.innerHTML = error;

    console.error('Error fetching data:', error);
  }
}

/**
 * Fetching all listing belonging to the given user from API-sever
 * @param {string} nameOfUser - name of user
 * @return {Promise<object[]>} array of post fetched from API-server
 * */
export async function allUsersListings(nameOfUser) {
  try {
    const options = {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmVnaW4iLCJlbWFpbCI6Im5lZ2ZhcjQ5NzkxQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzU4ODgyOTk2fQ.G8SDRfET-9DE5XjOSWjDm2wZCRGwErGQnNPaiXgpWjs',
        'X-Noroff-API-Key': '4f20fb44-3b03-4fc3-bc21-5a7fb98d9816',
      },
    };

    const url = `${base_url}/auction/profiles/${nameOfUser}/listings`;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.classList.add(
      'alert',
      'alert-danger',
      'mt-4',
      'text-center'
    );
    errorMessageElement.style.display = 'block';
    errorMessageElement.innerHTML = error;

    console.error('Error fetching data:', error);
  }
}

/**
 * Fetching all bids belonging to the given user from API-sever
 * @param {string} nameOfUser - name of user
 * @return {Promise<object[]>} array of post fetched from API-server
 * */
export async function allUsersBids(nameOfUser) {
  try {
    const options = {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmVnaW4iLCJlbWFpbCI6Im5lZ2ZhcjQ5NzkxQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzU4ODgyOTk2fQ.G8SDRfET-9DE5XjOSWjDm2wZCRGwErGQnNPaiXgpWjs',
        'X-Noroff-API-Key': '4f20fb44-3b03-4fc3-bc21-5a7fb98d9816',
      },
    };

    const url = `${base_url}/auction/profiles/${nameOfUser}/bids?_listings=true`;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.classList.add(
      'alert',
      'alert-danger',
      'mt-4',
      'text-center'
    );
    errorMessageElement.style.display = 'block';
    errorMessageElement.innerHTML = error;

    console.error('Error fetching data:', error);
  }
}
/**
 * Fetching all wins belonging to the given user from API-sever
 * @param {string} nameOfUser - name of user
 * @return {Promise<object[]>} array of post fetched from API-server
 * */
export async function allUsersWins(nameOfUser) {
  try {
    const options = {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmVnaW4iLCJlbWFpbCI6Im5lZ2ZhcjQ5NzkxQHN0dWQubm9yb2ZmLm5vIiwiaWF0IjoxNzU4ODgyOTk2fQ.G8SDRfET-9DE5XjOSWjDm2wZCRGwErGQnNPaiXgpWjs',
        'X-Noroff-API-Key': '4f20fb44-3b03-4fc3-bc21-5a7fb98d9816',
      },
    };

    const url = `${base_url}/auction/profiles/${nameOfUser}/wins`;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.classList.add(
      'alert',
      'alert-danger',
      'mt-4',
      'text-center'
    );
    errorMessageElement.style.display = 'block';
    errorMessageElement.innerHTML = error;

    console.error('Error fetching data:', error);
  }
}

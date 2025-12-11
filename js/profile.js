const base_url = 'https://v2.api.noroff.dev';
/**
 *  Fetching users profile based on name
 *  @return {object} profile - user profile
 * */
export async function fetchUserProfile() {
  try {
    const nameUser = localStorage.getItem('name');
    const url = `${base_url}/auction/profiles/${nameUser}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
        'X-Noroff-API-Key': '4f20fb44-3b03-4fc3-bc21-5a7fb98d9816',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data || Object.keys(data).length === 0) {
      throw new Error(`Profile for "${nameUser}" was empty. `);
    }
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

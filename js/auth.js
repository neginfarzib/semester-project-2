const base_url = "https://v2.api.noroff.dev";

/**
 * Send authentication request (register or login).
 * @param {string} endpoint - The API endpoint (e.g., "/auth/register" or "/auth/login").
 * @param {Object} data - The payload (email, password, and optionally name).
 * @returns {Promise<void>}
 */
async function sendAuthRequest(endpoint, data) {
  try {
    const response = await fetch(base_url + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      const token = result.data.accessToken;
      const nameApi = result.data.name;
      const email = result.data.email;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.setItem("accessToken", token);
      localStorage.setItem("name", nameApi);
      localStorage.setItem("email", email);

      const callbackLocation = localStorage.getItem("callbackLocation");

      if (callbackLocation !== null) {
        localStorage.removeItem("callbackLocation");
        window.location.href = callbackLocation;
      } else if (endpoint.includes("register")) {
        alert("Registration successful!");
        window.location.href = "../account/login.html";
      } else {
        window.location.href = "../index.html";
      }
    } else {
      const error = await response.json();
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
    console.error("An error occurred:", err);
    alert("An error occurred: " + err);
  }
}
/**
 * Send authentication request (register or login).
 * @param {string} endpoint - The API endpoint (e.g., "/auth/register" or "/auth/login").
 * @param {Object} data - The payload (email, password, and optionally name).
 * @returns {Promise<void>}
 */
async function sendAuthRequestUpdateUserProfile(endpoint, data) {
  try {
    const response = await fetch(base_url + endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "4f20fb44-3b03-4fc3-bc21-5a7fb98d9816"
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      const token = result.data.accessToken;
      const nameApi = result.data.name;

      window.location.href = "../account/profile.html";
    } else {
      const error = await response.json();
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
    console.error("An error occurred:", err);
    alert("An error occurred: " + err);
  }
}

/**
 * Register a new user.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} bio - The user's bio.
 * @param {string} avatarUrl - The user's avatarUrl.
 * @param {string} avatarAltText - The user's avatarAltText.
 * @param {string} bannerUrl - The user's bannerUrl.
 * @param {string} bannerAltText - The user's bannerAltText.
 * @returns {void}
 */
export function registerUser(name, email, password, bio, avatarUrl, avatarAltText, bannerUrl, bannerAltText) {
  const userData = {
    name,
    email,
    password
  };

  if (avatarUrl && avatarAltText) {
    userData.avatar = {
      url: avatarUrl,
      alt: avatarAltText
    };
  }

  if (bannerUrl && bannerAltText) {
    userData.banner = {
      url: bannerUrl,
      alt: bannerAltText
    };
  }

  if (bio) {
    userData.bio = bio;
  }

  return sendAuthRequest("/auth/register", userData);
}

/**
 * Log in an existing user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {void}
 */
export function loginUser(email, password) {
  return sendAuthRequest("/auth/login", { email, password });
}

/**
 * Register a new user.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} bio - The user's bio.
 * @param {string} avatarUrl - The user's avatarUrl.
 * @param {string} avatarAltText - The user's avatarAltText.
 * @param {string} bannerUrl - The user's bannerUrl.
 * @param {string} bannerAltText - The user's bannerAltText.
 * @returns {void}
 */
export function updateUserProfile(name, email, bio, avatarUrl, avatarAltText, bannerUrl, bannerAltText) {
  const userData = {};

  if (avatarUrl && avatarAltText) {
    userData.avatar = {
      url: avatarUrl,
      alt: avatarAltText
    };
  }

  if (bannerUrl && bannerAltText) {
    userData.banner = {
      url: bannerUrl,
      alt: bannerAltText
    };
  }

  if (bio) {
    userData.bio = bio;
  }

  return sendAuthRequestUpdateUserProfile(`/auction/profiles/${name}`, userData);
}

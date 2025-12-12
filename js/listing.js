// @ts-nocheck
const base_url = "https://v2.api.noroff.dev";
/**
 *  Placing bid
 * @param {number} bidAmount bid amount for the listing
 * @param {string} listingId Id of listing which want to place bid on it
 *  @return {object} listing - the listing which we put bid on
 * */
export async function placeBidAPI(bidAmount, listingId) {
  const nameUser = localStorage.getItem("name");
  if (!nameUser) {
    console.warn("User is not authenticated yet");
    return;
  }

  const userData = {
    amount: bidAmount
  };
  const url = `${base_url}/auction/listings/${listingId}/bids`;
  console.log("ØØØØØØ", JSON.stringify(userData));
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "X-Noroff-API-Key": "4f20fb44-3b03-4fc3-bc21-5a7fb98d9816"
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    console.error("HTTP error:", response.status, response.statusText);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  if (!data || Object.keys(data).length === 0) {
    throw new Error(`Error while placing bid for user "${nameUser}". ListingId: ${listingId}`);
  }
  return data.data;
}

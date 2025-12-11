/**
 * Check if user is logged in.
 * Redirects to login page if not.
 */
export function checkIfAuthenticated(){
    const token = localStorage.getItem('accessToken');

    if (!token || token === 'undefined' || token === 'null') {
        alert('You must be logged in to view this page.');
        window.location.href = '../account/login.html';
    }
}
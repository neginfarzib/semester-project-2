import {fetchUserProfile} from './profile.js';
import {updateUserProfile} from "./auth.js";


let userProfile = await fetchUserProfile();
document.getElementById('profile-name').value = userProfile.name;
document.getElementById('profile-email').value = userProfile.email;

document.getElementById('profile-bio').value =  userProfile.bio;
if (userProfile.avatar){
    document.getElementById('profile-avatarUrl').value = userProfile.avatar.url;
    document.getElementById('profile-avatarAltText').value = userProfile.avatar.alt;
}
if (userProfile.banner){
    document.getElementById('profile-bannerUrl').value = userProfile.banner.url;
    document.getElementById('profile-bannerAltText').value = userProfile.banner.url;
}


const form = document.getElementById('profile-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if(confirm('Are you to update user profile?')) {
        const name = document.getElementById('profile-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        // const password = document.getElementById('profile-password').value;

        const bio = document.getElementById('profile-bio').value.trim();
        const avatarUrl = document.getElementById('profile-avatarUrl').value.trim();
        const avatarAltText = document.getElementById('profile-avatarAltText').value;

        const bannerUrl = document.getElementById('profile-bannerUrl').value.trim();
        const bannerAltText = document.getElementById('profile-bannerAltText').value.trim();
        updateUserProfile(name, email, bio, avatarUrl, avatarAltText, bannerUrl, bannerAltText);
    }

});

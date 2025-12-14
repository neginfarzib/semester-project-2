import { loginUser } from './auth.js';

const form = document.getElementById('login-form');
const spinner = document.getElementById('loading-spinner');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  spinner.classList.remove('d-none');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  loginUser(email, password);
});

import { loginUser } from './auth.js';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

const form = document.getElementById('login-form');
const spinner = document.getElementById('loading-spinner');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  spinner.classList.remove('d-none');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  loginUser(email, password);
});

// should be empty because httpOnly cookie is used
const cookie = document.cookie;
// call GET /api/me to get the logged in user
(async () => {
  const response = await fetch('/api/me');
  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    return;
  }

  const userInfo = document.querySelector('.kb-profile');
  const avatar = userInfo.querySelector('#profile-img');
  const username = userInfo.querySelector('#username');
  const email = userInfo.querySelector('#email');

  avatar.src = data.avatar;
  username.textContent = data.username;
  email.textContent = data.email;

  userInfo.style.display = 'block';

  const loginContainer = document.getElementById('login-container');
  const logoutContainer = document.getElementById('logout-container');

  if (data.username) {
    loginContainer.style.display = 'none';
    logoutContainer.style.display = 'block';
  } else {
    loginContainer.style.display = 'block';
    logoutContainer.style.display = 'none';
  }
})();

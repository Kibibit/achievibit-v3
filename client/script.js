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

  const showReposContainerElement = document.getElementById('show-repos-container');
  const showReposLinkElement = showReposContainerElement.querySelector('a');
  const userReposView = document.getElementById('user-repos-view');

  showReposLinkElement.addEventListener('click', async () => {
    // hide profile view
    userInfo.style.display = 'none';
    const reposResponse = await fetch('/api/me/integrations/all/available');
    const reposData = await reposResponse.json();

    if (!reposResponse.ok) {
      console.error(reposData);
      return;
    }

    userReposView.innerHTML = '';
    const reposList = document.createElement('ul');
    reposList.classList.add('kb-repos-list');
    userReposView.appendChild(reposList);

    reposData.forEach((repo) => {
      const repoElement = document.createElement('li');
      repoElement.classList.add('kb-repo');
      repoElement.classList.add(repo.system);
      repoElement.classList.add(repo.private ? 'private' : 'public');

      const nameSpan = document.createElement('div');
      // create a <i class="visibility-icon></i> to put in the beginning of the nameSpan
      const visibilityIcon = document.createElement('i');
      visibilityIcon.classList.add('visibility-icon');
      nameSpan.textContent = repo.name;
      nameSpan.classList.add('kb-repo-name');
      nameSpan.append(visibilityIcon);
      repoElement.appendChild(nameSpan);

      const fullNameSpan = document.createElement('div');
      fullNameSpan.textContent = repo.full_name;
      fullNameSpan.classList.add('kb-repo-full-name');
      repoElement.appendChild(fullNameSpan);

      reposList.appendChild(repoElement);
    });
  });
})();

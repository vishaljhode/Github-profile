window.onload = () => {
    const searchBox = document.querySelector('#search');
    
    searchBox.addEventListener('focusout', () => {
        formSubmit();
    });

     getUser("vishaljhode");
}

const formSubmit = () => {
    const searchBox = document.querySelector('#search');
    const username = searchBox.value.trim();
    if (username !== "") {
        showLoading();
        getUser(username);
        searchBox.value = "";
    }
    return false;
}

const showLoading = () => {
    const main = document.querySelector('#main');
    main.innerHTML = `<p style="color: #fff; font-size: 18px;">Loading...</p>`;
}

const getUser = async (username) => {
    const API_URL = "https://api.github.com/users";
    const main = document.querySelector('#main');

    try {
        const response = await fetch(`${API_URL}/${username}`);
        if (!response.ok) {
            throw new Error("User not found");
        }

        const data = await response.json();

        const bio = data.bio ? truncateText(data.bio, 150) : "No bio available";

        const card = `
            <div class="card">
                <div>
                    <img class="avatar" src=${data.avatar_url} alt="dp">
                </div>
                <div class="user">
                    <h2>${data.name || data.login}</h2>
                    <p>${bio}</p>

                    <ul>
                        <li>${data.following}<strong> Following</strong></li>
                        <li>${data.followers}<strong> Followers</strong></li>
                        <li>${data.public_repos}<strong> Repos</strong></li>
                    </ul>

                    <div id="repos"></div>
                </div>
            </div>
        `;

        main.innerHTML = card;
        getRepos(API_URL, username);

    } catch (error) {
        main.innerHTML = `<p style="color: red; font-size: 18px;">${error.message}</p>`;
    }
}

const getRepos = async (API_URL, username) => {
    const reposContainer = document.querySelector('#repos');

    try {
        const response = await fetch(`${API_URL}/${username}/repos`);
        const repos = await response.json();

        if (Array.isArray(repos)) {
            repos.slice(0, 6).forEach(repo => {
                const element = document.createElement('a');
                element.classList.add('repo');
                element.href = repo.html_url;
                element.innerText = repo.name;
                element.target = "_blank";
                reposContainer.appendChild(element);
            });
        }
    } catch (error) {
        reposContainer.innerHTML = `<p style="color: orange;">Could not load repositories.</p>`;
    }
}

// Utility: Truncate long text
const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

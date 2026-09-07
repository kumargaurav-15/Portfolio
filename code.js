const gallery = document.querySelector('.project-gallery');
const searchInput = document.querySelector('#search-box');
const hardBtn = document.querySelector('#filter-hard-btn');
const allBtn = document.querySelector('#show-all-btn');
const themeButton = document.querySelector('#theme-button');

const loginScreen = document.getElementById('login-screen');
const mainContent = document.getElementById('main-content');

const loginBtn = document.getElementById('login-btn');
const skipBtn = document.getElementById('skip-btn');


let myProjects = [];


// ===============================
// LOAD PROJECTS
// ===============================

async function loadAllProjects() {
    try {
        gallery.innerHTML = "<p>Loading your amazing work...</p>";

        const githubResponse = await fetch(
            'https://api.github.com/users/kumargaurav-15/repos'
        );

        const localResponse = await fetch('projects.json');

        if (!githubResponse.ok || !localResponse.ok) {
            throw new Error("One of the data sources failed to load.");
        }

        const repos = await githubResponse.json();
        const localData = await localResponse.json();

        const githubMapped = repos.map(repo => ({
            name: repo.name,
            tech: repo.language || "Web Tech",
            link: repo.html_url,
            difficulty: "Hard"
        }));

        myProjects = [...localData, ...githubMapped];

        displayProject(myProjects);

    } catch (error) {
        console.error("Merge Error:", error);

        gallery.innerHTML = `
            <p style="color:red;">
                Error loading projects.
            </p>
        `;
    }
}


// ===============================
// DISPLAY PROJECTS
// ===============================

function displayProject(data) {

    gallery.innerHTML = "";

    if (data.length === 0) {
        gallery.innerHTML = `
            <div class="no-results">
                <p>No projects match your search. 🔍</p>
            </div>
        `;
        return;
    }

    data.forEach(project => {

        const cardHTML = `
            <div class="card">

                <h3>${project.name}</h3>

                <p>
                    <strong>Tech:</strong>
                    ${project.tech}
                </p>

                <p>
                    <strong>Level:</strong>
                    ${project.difficulty}
                </p>

                ${
                    project.link
                    ? `<a href="${project.link}" target="_blank">
                        View Project
                       </a>`
                    : ""
                }

            </div>
        `;

        gallery.innerHTML += cardHTML;
    });
}


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener('input', (e) => {

    const searchText = e.target.value.toLowerCase().trim();

    const filteredProjects = myProjects.filter(project => {

        return (
            project.name.toLowerCase().includes(searchText) ||
            project.tech.toLowerCase().includes(searchText)
        );

    });

    displayProject(filteredProjects);
});


// ===============================
// HARD PROJECT FILTER
// ===============================

hardBtn.addEventListener('click', () => {

    const hardProjects = myProjects.filter(project => {
        return project.difficulty.toLowerCase() === "hard";
    });

    displayProject(hardProjects);
});


// ===============================
// SHOW ALL
// ===============================

allBtn.addEventListener('click', () => {

    displayProject(myProjects);

    // Search box bhi clear kar do
    searchInput.value = "";
});


// ===============================
// THEME
// ===============================

function setTheme(isDark) {

    document.body.classList.toggle(
        'dark-mode-active',
        isDark
    );

    themeButton.textContent = isDark
        ? "Light"
        : "Dark";

    localStorage.setItem(
        'themePreference',
        isDark ? 'enabled' : 'disabled'
    );
}


themeButton.addEventListener('click', () => {

    const isDark =
        document.body.classList.contains('dark-mode-active');

    setTheme(!isDark);

});


// Saved theme load karo
const savedTheme = localStorage.getItem('themePreference');

if (savedTheme === 'enabled') {
    setTheme(true);
} else {
    setTheme(false);
}


// ===============================
// LOGIN / SKIP
// ===============================

function unlockPortfolio() {

    loginScreen.style.display = 'none';
    mainContent.style.display = 'block';

    localStorage.setItem(
        'userStatus',
        'entered'
    );
}


loginBtn.addEventListener('click', unlockPortfolio);
skipBtn.addEventListener('click', unlockPortfolio);


// ===============================
// CHECK USER STATUS
// ===============================

const entryStatus =
    localStorage.getItem('userStatus');

if (entryStatus === 'entered') {

    loginScreen.style.display = 'none';
    mainContent.style.display = 'block';

}


// ===============================
// START
// ===============================

loadAllProjects();
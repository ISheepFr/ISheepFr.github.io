document.getElementById('home_page').addEventListener('click', function() {
            window.location.href = '../../index.html';  
});

if(document.getElementById('projects_page') != null)
{
    document.getElementById('projects_page').addEventListener('click', function() {

    let currentPath = window.location.pathname;
    let pageName = currentPath.split("/").pop().split(".")[0];
    window.location.href = `../../recap.html#${pageName}`;
    });
}




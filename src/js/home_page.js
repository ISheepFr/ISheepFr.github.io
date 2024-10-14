document.getElementById('home_page').addEventListener('click', function() {
            window.location.href = '../../index.html';  
});

if(document.getElementById('projects_page') != null)
{
    document.getElementById('projects_page').addEventListener('click', function() {
    window.location.href = '../../recap.html';  
    });
}


const dropdownButton = document.getElementById('dropdownMenuButton');
const cardsSection = document.getElementById('cont_cards');

if(dropdownButton != null && cardsSection != null)
{
   // Ajouter un événement pour détecter lorsque la dropdown s'ouvre
dropdownButton.addEventListener('click', function () {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    console.log(dropdownMenu.classList.contains('show'));
    if (dropdownMenu.classList.contains('show')) {
        cardsSection.style.marginTop = '120px';
    } else {
        // Ajouter de l'espace lorsque le menu est ouvert
        cardsSection.style.marginTop = '0px';  // Ajustez cette valeur selon vos besoins
    }
}); 
}




const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.col-6')
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter')
        projects.forEach(project => {
            if (filter === 'all' || project.classList.contains(filter)) {
                project.style.display = 'block'; // Show matching projects
            } else {
                project.style.display = 'none';  // Hide non-matching projects
            }
        });
    });
});
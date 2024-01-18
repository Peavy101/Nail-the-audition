const pieceTemplate = document.getElementById("data-piece-template")
const pieceContainer = document.getElementById("pieces-container")
const searchInput = document.getElementById("search")
const draggables = document.querySelectorAll('.list-piece')
const containers = document.querySelectorAll('.list-container')


let pieces = []

// Retrieves all UL elements in the Nav Bar
const nav_links = document.querySelectorAll('ul')
// Retrieve all Section elements which are the 'pages' of our app
const sections = document.querySelectorAll('section')

// Callback function to handle the Navigation in our app
const handleNav = (nav_link) => {
    const section_id = nav_link.innerHTML.replaceAll(' ', '-');
    sections.forEach(section => {
        if(section.id === section_id) return section.classList.remove('hide')
        section.classList.add('hide')
    })
}

// Attach event listeners to each nav link for handling page switches
nav_links.forEach(
    nav_link => {
        nav_link.addEventListener('click', () => {
            handleNav(nav_link)
        })
    }
)

searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    pieces.forEach((piece, index) => {
        if (!piece || !piece.element) {
            console.error(`Invalid piece structure at index ${index}:`, piece);
            return;
        }

        const isVisible =
            (piece.title && piece.title.toLowerCase().includes(value)) ||
            (piece.composer && piece.composer.toLowerCase().includes(value)) ||
            (piece.genre && piece.genre.toLowerCase().includes(value));

        // Check if piece.element is defined before calling classList.toggle
        if (piece.element.classList && typeof piece.element.classList.toggle === 'function') {
            piece.element.classList.toggle("hide", !isVisible);
        } else {
            console.error(`Invalid classList at index ${index}:`, piece.element);
        }
    });
});

fetch("https://api.npoint.io/d1c2bc93f272778194a3")
    .then(res => res.json())
    .then(data => {
        pieces = data.map(pieceData => {
            // Clone the template from our HTML layout
            const pieceNode = pieceTemplate.content.cloneNode(true);

            // Extract the actual element from the DocumentFragment
            const pieceElement = pieceNode.querySelector('.piece');

            // Grab each of the component elements of our 'piece card' to work with
            const pieceTitle = pieceElement.querySelector('.title');
            const pieceComposer = pieceElement.querySelector('.composer');
            const pieceGenre = pieceElement.querySelector('.genre');
            const pieceSheet = pieceElement.querySelector('.sheet');

            // Apply Data from the API to each of the component elements
            pieceTitle.innerHTML = pieceData.title;
            pieceComposer.innerHTML = pieceData.composer;
            pieceGenre.innerHTML = pieceData.genre;

            // Attach the PDF link from the API into the 'src' attribute of our template's iframe
            //pieceSheet.setAttribute('src', pieceData.link);

            pieceContainer.appendChild(pieceNode);
            return { title: pieceData.title, composer: pieceData.composer, genre: pieceData.genre, element: pieceElement };
        });

        let accordions = document.querySelectorAll('.piece');

        accordions.forEach((accoTrigger) => {
            accoTrigger.addEventListener('click', () => {
                console.log("woot!");
                const content = accoTrigger.querySelector('.accordion-content')
                content.classList.toggle('hide');
            });
        });
    });


draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging')
    })
})

containers.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(container, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            container.appendChild(draggable)
        } else {
            container.insertBefore(draggable, afterElement)
        }
    })
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
        } else {
        return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
    }
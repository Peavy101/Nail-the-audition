const pieceTemplate = document.getElementById("data-piece-template")
const pieceContainer = document.getElementById("pieces-container")
const searchInput = document.getElementById("search")

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
            pieceSheet.setAttribute('src', pieceData.link);

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


//the old version before changing it to elements rather than nodes
// fetch("https://api.npoint.io/d1c2bc93f272778194a3")
// .then(res => res.json())
// .then(data => {
//     pieces = data.map(piece => {
//         // Clone the template from our HTML layout
//         const pieceNode = pieceTemplate.content.cloneNode(true)
        
//         // Grab each of the component elements of our 'piece card' to work with
//         const pieceTitle = pieceNode.querySelector('.title')
//         const pieceComposer = pieceNode.querySelector('.composer')
//         const pieceGenre = pieceNode.querySelector('.genre')
//         const pieceSheet = pieceNode.querySelector('.sheet')
        
//         // Apply Data from the API to each of the component elements
//         pieceTitle.innerHTML = piece.title
//         pieceComposer.innerHTML = piece.composer
//         pieceGenre.innerHTML = piece.genre
        
//         // Attach the PDF link from the API into the 'src' attribute of our template's iframe
//         //pieceSheet.setAttribute('src', piece.link)
        
//         pieceContainer.appendChild(pieceNode)
//         return {title: piece.title, composer: piece.composer, genre: piece.genre, element: pieceNode}
//     })
//     let accordions = document.querySelectorAll('.piece');

//     accordions.forEach((accoTrigger) => {
//         accoTrigger.addEventListener('click', () => {
//             console.log("woot!");
//             const content = accoTrigger.querySelector('.accordion-content')
//             content.classList.toggle('hide');
//         })
//     })
// })

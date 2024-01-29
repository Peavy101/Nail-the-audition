const pieceTemplate = document.getElementById("data-piece-template")
const pieceContainer = document.getElementById("pieces-container")
const searchInput = document.getElementById("search")
const draggables = document.querySelectorAll('.list-piece')
const listContainer = document.getElementById("list-container")
const removePieceButtons = document.querySelectorAll('.removePiece')

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

            pieceElement.addEventListener('click', () => {
                if(!isMouseOverButton){
                    console.log("woot!");
                    const content = pieceElement.querySelector('.accordion-content')
                    content.classList.toggle('hide');
                }
            });

            let isMouseOverButton = false;

            const pieceButton = pieceElement.querySelector('.addPiece')

            pieceButton.addEventListener('mouseenter', () => {
                isMouseOverButton=true;
            })

            pieceButton.addEventListener('mouseleave', () => {
                isMouseOverButton=false;
            })

            pieceButton.addEventListener('click', () => {
                pieceComposerText = pieceComposer.textContent;
                pieceTitleText = pieceTitle.textContent;
    
                const listPiece_id = Math.random(1000).toString(36).substring(7);
                const pieceWrapper = document.createElement("div");
                pieceWrapper.setAttribute('id', listPiece_id);
                pieceWrapper.setAttribute('class', "list-piece");
                pieceWrapper.setAttribute('draggable', true);
                
                const pieceText = document.createElement("p");
                pieceText.innerText = pieceComposerText + " " + pieceTitleText;
    
                const removePieceButton = document.createElement("button");
                removePieceButton.innerText = "x";
                removePieceButton.setAttribute('class', "removePiece");
    
                pieceWrapper.appendChild(pieceText);
                pieceWrapper.appendChild(removePieceButton);

                listContainer.appendChild(pieceWrapper);

                removePieceButton.addEventListener('click', () => {
                    console.log('youre on to something')
            
                    const parentElement = removePieceButton.parentNode;
                    parentElement.remove();
                })
                drag();
            })
            return { title: pieceData.title, composer: pieceData.composer, genre: pieceData.genre, element: pieceElement };
        });
    });

///THIS IS ALL GOING INTO THE ADD PIECE FUNCTION THING
// function drag() {
//     pieceWrapper = document.querySelectorAll('.list-piece')

//     pieceWrapper.forEach(pieceWrapper => {
//         pieceWrapper.addEventListener('dragstart', () => {
//             pieceWrapper.classList.add('dragging')
//         })
    
//         pieceWrapper.addEventListener('dragend', () => {
//             pieceWrapper.classList.remove('dragging')
//         })
//     })

//     listContainer.addEventListener('dragover', e => {
//         e.preventDefault()
//         const afterElement = getDragAfterElement(listContainer, e.clientY)
//         console.log(afterElement)
//         const draggable = document.querySelector('.dragging')
//         if (afterElement == null) {
//             listContainer.appendChild(draggable)
//         } else {
//             listContainer.insertBefore(draggable, afterElement)
//         }
//     })
    
//     function getDragAfterElement(container, y) {
//         const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
    
//         return draggableElements.reduce((closest, child) => {
//             const box = child.getBoundingClientRect()
//             const offset = y - box.top - box.height / 2
//             if (offset < 0 && offset > closest.offset) {
//             return { offset: offset, element: child }
//             } else {
//             return closest
//             }
//         }, { offset: Number.NEGATIVE_INFINITY }).element
//         }
// }


function drag() {
    const pieceWrappers = document.querySelectorAll('.list-piece');
    let draggedElement = null;

    pieceWrappers.forEach(pieceWrapper => {
        pieceWrapper.addEventListener('dragstart', () => {
            draggedElement = pieceWrapper;
            pieceWrapper.classList.add('dragging');
        });

        pieceWrapper.addEventListener('dragend', () => {
            pieceWrapper.classList.remove('dragging');
            draggedElement = null;
        });
    });

    listContainer.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(listContainer, e.clientY);
        const draggable = document.querySelector('.dragging');

        if (afterElement) {
            afterElement.parentNode.insertBefore(draggable, afterElement.nextSibling);
        } else {
            listContainer.appendChild(draggable);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.list-piece:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            console.log(offset)

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}

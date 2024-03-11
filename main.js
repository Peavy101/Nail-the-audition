const { PDFDocument } = PDFLib

const pieceTemplate = document.getElementById("data-piece-template")
const pieceContainer = document.getElementById("pieces-container")
const searchInput = document.getElementById("search")
const draggables = document.querySelectorAll('.list-piece')
const listContainer = document.getElementById("list-container")
const removePieceButtons = document.querySelectorAll('.removePiece')
const auditionList = document.getElementById('auditionList');
const downloadPDFButton = document.getElementById('downloadPDF');

let pieces = []

const sample_array = [0, {a: 1, b: 2}, 2, 3]

const sample_object = {a: 1, b: 2 }

// PROBLEM 1: Need to identify the piece by the id of the overall object

// PROBLEM 2: Need to store ALL excerpt variations for a particular piece
// along with a text representation of that excerpt type
// Piece_name: 
//  excerpt_1 -> values for excerpt 1

// Problem 3: Need to cleanly iterate through each key value pair for each excerpt
// to dynamically generate the required options in our select

let piece_excerpts = 
{
    'sample_piece': [
        {full_piece: null},
        {excerpt_1: [3]},
        {excerpt_2: [3, 4]},
        {excerpt_3: [3, 4, 5]}
    ],
    './scores/BachConcertoForViolin2Emajor.pdf': [
        {Full_Piece: [0,1,2,3,4]},
        {Adagio: [3]}
    ],
    './scores/BachMagnificat.pdf': [
        {Full_Piece: [0,1,2,3,4,5]},
        {No_2_Et_Exultavita: [1]}
    ],
    './scores/BachOrchestralSuite2.pdf': [
        {Full_Piece: [0,1,2,3]},
        {Badinerie: [3]}
    ],
    './scores/BartokConcertoForOrchestra.pdf': [
        {Full_Piece: [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
        {First_Page: [1]}
    ],
    './scores/BartokConcertoForOrchestra.pdf': [
        {Full_Piece: [1,2,3,4,5,6,7,8,9,10,11,12]},
        {Rehearsal_35: [1,2]}
    ],
    './scores/BeethovenSymphony3.pdf': [
        {Full_Piece: [0,1,2,3,3,4,5,6,7,8,9,10,11,12,13,14,15]},
        {Scherzo: [9]}
    ],
    './scores/BeethovenSymphony5.pdf': [
        {Full_Piece: [0,1,2,3,4,5,6,7,8,9,10,11]},
        {Second_Movement: [4]},
        {Scherzo_and_Trio: [5,6,7]}
    ],
    './scores/BerliozSymphonieFantastique.pdf':[
        {Full_Piece: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
        {Second_Movement_Opening: [4]},
        {Third_Movement_41: [6,7]},
        {Fourth_Movement_First_Page: [8]},
        {Fourth_Movement_ShoeShine: [9,10]},
        {Witches_Round_Dance: [12]}
    ],
    './scores/BrahmsSymphony1.pdf': [
        {Full_Piece: [0,1,2,3,4,5,6,7,8,9,10]},
        {First_Page: [0]},
        {Letter_E: [1]}
    ],
    './scores/BrahmsSymphony2.pdf': [
        {Full_Piece: [0,1,2,3,4,5,6,7,8,9,10]},
        {Letter_E: [0,1]},
        {Second_Movement_Letter_C: [4]},
        {Fourth_Movement_Opening: [6,7]},
        {Fourth_Movement_Letter_L: [8,9]}
    ],
    './scores/MahlerSymphony1.pdf': [
        {Full_Piece: [0,1,2,3,4,5,6,7,8,9,10,11]},
        {Third_Movement_Solo: [5]}
    ],
    './scores/MahlerSymphony2.pdf': [
        {Full_Piece: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]},
        {First_Page: [0]}
    ],
    './scores/MozartSymphony39.pdf': [
        {Full_Piece: [0,1,2,3,4,5,6]},
        {First_Page: [0]},
        {Fourth_Movement: [5,6]}
    ],
    './scores/MozartSymphony40.pdf': [
        {Full_Piece: [0,1,2,3,4,5,6,7]},
        {Measure_114: [1]},
        {Measure_191: [1,2]},
        {Fourth_Movement: [6,7]}
    ],
    './scores/MussorgskyRavelPicturesAtAnExhibition.pdf': [
        {Full_Piece: [0,1,2,3,4,5,6,7]},
        {VI_Samuel_Goldenberg_und_Schmuyle: [4]}
    ],
    './scores/StraussDonJuan.pdf': [
        {Full_Piece: [0,1,2,3,4]},
        {First_Page: [0]},
        {Letter_F: [1]},
        {Page_4: [3]}
    ],
    './scores/StraussHeldenleben.pdf': [
        {Full_Piece: [0,1,2,3,4,5,6,7,8,9,10]},
        {Rehearsal_9: [1]},
        {Rehearsal_51: [5]}
    ]

}

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


            //commented sections are for implementing a highlight feature which I may implement later but for now prefer without//
            pieceButton.addEventListener('click', () => {
                auditionList.classList.remove('hide');
                // pieceElement.classList.add('highlight');
                pieceComposerText = pieceComposer.textContent;
                pieceTitleText = pieceTitle.textContent;
    
                const pieceContent = document.createElement("div");
                pieceContent.setAttribute('class', "pieceContent");
                const buttonWrapper = document.createElement("div");
                buttonWrapper.setAttribute('class', "buttonWrapper");

                const upButton = document.createElement("button");
                upButton.setAttribute('class', "upButton");
                upButton.setAttribute('onclick', "moveElement(this, 'up')");
                upButton.innerText = "↑";
                const downButton = document.createElement("button");
                downButton.setAttribute('class', "downButton");
                downButton.setAttribute('onclick', "moveElement(this, 'down')");
                downButton.innerText = "↓";

                const listPiece_id = pieceData.link;
                const pieceWrapper = document.createElement("div");
                pieceWrapper.setAttribute('id', listPiece_id);
                pieceWrapper.setAttribute('class', "list-piece");
                pieceWrapper.setAttribute('draggable', true);
                
                const pieceText = document.createElement("p");
                pieceText.setAttribute('class', "pieceText")
                pieceText.innerText = pieceComposerText + " " + pieceTitleText;
    
                const removePieceButton = document.createElement("button");
                removePieceButton.innerText = "x";
                removePieceButton.setAttribute('class', "removePiece");
                const excerptSelect = document.createElement('select');
                excerptSelect.setAttribute('id', listPiece_id);
                const excerpt_options = piece_excerpts[listPiece_id] ?? [];
                excerpt_options.forEach(
                    excerpt_option => {
                        const option = document.createElement('option');
                        option.value = Object.values(excerpt_option)[0]
                        option.innerText = Object.keys(excerpt_option)[0]
                        excerptSelect.appendChild(option)
                    }
                )

                buttonWrapper.appendChild(upButton);
                buttonWrapper.appendChild(downButton);
                pieceContent.appendChild(pieceText);
                pieceContent.appendChild(excerptSelect);
                pieceContent.appendChild(removePieceButton);
                pieceWrapper.appendChild(pieceContent);
                pieceWrapper.appendChild(buttonWrapper);
                listContainer.appendChild(pieceWrapper);

                // pieceElement.remove()
                // pieceContainer.prepend(pieceElement);
                
                removePieceButton.addEventListener('click', () => {
                    const parentElement = removePieceButton.parentNode.parentNode;
                    pieceElement.classList.remove('highlight')
                    parentElement.remove();
                })
                drag();
            })
            return { title: pieceData.title, composer: pieceData.composer, genre: pieceData.genre, element: pieceElement };
        });
    });

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
            afterElement.parentNode.insertBefore(draggable, afterElement);
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

async function combinePDFS() {

    if (listContainer.innerHTML.trim() !== '') {
        const pieceSelects = listContainer.querySelectorAll('select')
        const piecesMetadata = [];

        pieceSelects.forEach(select => {

            const excerpt_values = []

            select.value.split(',').forEach(
                value => excerpt_values.push(Number(value))
            );

            const pieceInfo = {
                id: select.id,
                excerpt_value: excerpt_values,
            }
            piecesMetadata.push(pieceInfo);
        })

        const combinedPdfDoc = await PDFDocument.create();

        for (const metadata of piecesMetadata) {
            const donorPDFBytes = await fetch(metadata.id).then(res => res.arrayBuffer())
            const donorPdfDoc = await PDFDocument.load(donorPDFBytes)

            const indices_to_copy = metadata.excerpt_value;

            const donorPages = await combinedPdfDoc.copyPages(donorPdfDoc, indices_to_copy)

            donorPages.forEach(page => {
                combinedPdfDoc.addPage(page)
            })
        }

        const PDF_pages = await combinedPdfDoc.getPages()
        const pdfBytes = await combinedPdfDoc.save();

        const pdfIframe = document.getElementById('combinedPdfsFrame');
        pdfIframe.setAttribute('style', "display: block;")
        pdfIframe.setAttribute('src', URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })))
        
        downloadPDFButton.addEventListener('click', () => {
            download(pdfBytes, "combinedPDF", "application/pdf");
        })
    }
    else {
        alert("Add a piece to create your list!");
    }
}

function closeAuditionList() {
    auditionList.classList.add('hide');
}

function moveElement(button, direction) {
    const item = button.parentElement.parentElement;
    const container = item.parentElement;

    console.log(`Moving ${direction}: ${item.textContent}`);
    
    if (direction === 'up' && item.previousElementSibling) {
        container.insertBefore(item, item.previousElementSibling);
    } else if (direction === 'down' && item.nextElementSibling) {
        container.insertBefore(item.nextElementSibling, item);
    }
}
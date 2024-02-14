const { PDFDocument } = PDFLib

const pieceTemplate = document.getElementById("data-piece-template")
const pieceContainer = document.getElementById("pieces-container")
const searchInput = document.getElementById("search")
const draggables = document.querySelectorAll('.list-piece')
const listContainer = document.getElementById("list-container")
const removePieceButtons = document.querySelectorAll('.removePiece')

let pieces = []

const sample_array = [0, {a: 1, b: 2}, 2, 3]

const sample_object = {a: 1, b: 2 }

let piece_excerpts = {}

piece_excerpts["./scores/BachOrchestralSuite2.pdf"] = [3];
piece_excerpts["./scores/BeethovenSymphony5.pdf"] = [5, 6, 7];
piece_excerpts["./scores/BerliozSymphonieFantastique.pdf"] = [12];
piece_excerpts["./scores/BrahmsSymphony1.pdf"] = [1];
piece_excerpts["./scores/BrahmsSymphony2.pdf"] = [0, 1];
piece_excerpts["./scores/MahlerSymphony1.pdf"] = [5];
piece_excerpts["./scores/MahlerSymphony2.pdf"] = [0];
piece_excerpts["./scores/MozartSymphony39.pdf"] = [0];
piece_excerpts["./scores/MozartSymphony40.pdf"] = [1, 2];
piece_excerpts["./scores/MussorgskyRavelPicturesAtAnExhibition.pdf"] = [4];
piece_excerpts["./scores/StraussDonJuan.pdf"] = [0];
piece_excerpts["./scores/StraussHeldenleben.pdf"] = [1];


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

            pieceButton.addEventListener('click', () => {
                
                pieceComposerText = pieceComposer.textContent;
                pieceTitleText = pieceTitle.textContent;
    
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

                const checkBoxContainer = document.createElement("div");
                checkBoxContainer.setAttribute('class', "checkBoxContainer");
                const checkBoxText = document.createElement("p");
                checkBoxText.innerText = "Full Piece?";
                checkBoxText.setAttribute('class', "fullPieceText")
                const copyFullPDFCheckBox = document.createElement("input");
                copyFullPDFCheckBox.type = "checkbox";

                checkBoxContainer.appendChild(checkBoxText);
                checkBoxContainer.appendChild(copyFullPDFCheckBox);
    
                pieceWrapper.appendChild(pieceText);
                pieceWrapper.appendChild(checkBoxContainer);
                pieceWrapper.appendChild(removePieceButton);

                listContainer.appendChild(pieceWrapper);

                removePieceButton.addEventListener('click', () => {
                    const parentElement = removePieceButton.parentNode;
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
    const childDivs = listContainer.querySelectorAll('div')
    const piecesMetadata = [];

    childDivs.forEach(childDiv => {
        const pieceInfo = {
            id: childDiv.id,
            shouldCopyFullPiece: childDiv.querySelector('input[type="checkbox"]').checked,
        }
        piecesMetadata.push(pieceInfo);
    })

    const combinedPdfDoc = await PDFDocument.create();

    for (const metadata of piecesMetadata) {
        const donorPDFBytes = await fetch(metadata.id).then(res => res.arrayBuffer())
        const donorPdfDoc = await PDFDocument.load(donorPDFBytes)

        const indices_to_copy = metadata.shouldCopyFullPiece ? donorPdfDoc.getPageIndices() : piece_excerpts[metadata.id]

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
    //if you want it to download immediately uncomment below
    // download(combinedPdfDoc, "combinedPDF", "application/pdf");

    console.log(piecesMetadata.map(piece => piece.id));
}
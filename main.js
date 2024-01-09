const pieceTemplate = document.querySelector("[data-piece-template]")
const pieceContainer = document.querySelector("[pieces-container]")
const searchInput = document.querySelector("[data-search]")

let pieces = []

fetch("https://github.com/Peavy101/JSON-for-excerpts/blob/main/pieces.json")
.then(res => res.json())
.then(data => {
    pieces = data.map(piece => {
        const piece = pieceTemplate.textContent.cloneNode(true).children[0]
        const pieceTitle = piece.querySelector("[data-header]")
        const pdf = piece.querySelector("[data-body]")
        pieceTitle.textContent = piece.composer + piece.title
        //then i put in the link for the "pdf"
        pieceContainer.append(piece)
    })
})


const pieceTemplate = document.getElementById("data-piece-template")
const pieceContainer = document.getElementById("pieces-container")
const searchInput = document.getElementById("search")

let pieces = []

searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    piece.forEach(piece => {
        const isVisible = 
        piece.title.toLowerCase().includes(value) || 
        piece.composer.toLowerCase().includes(value)
        piece.element.classList.toggle("hide", !isVisible)
    })
})

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
        return{composer: piece.composer, title: piece.title}
        console.log(piece.composer);
    })
})


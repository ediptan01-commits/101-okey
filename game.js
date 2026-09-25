const hand = document.getElementById("hand");

const colors = ["Kırmızı", "Sarı", "Mavi", "Siyah"];

let playerTiles = [];

function createTiles() {
    const tiles = [];

    for (let copy = 0; copy < 2; copy++) {
        for (const color of colors) {
            for (let number = 1; number <= 13; number++) {
                tiles.push({
                    color: color,
                    number: number
                });
            }
        }
    }

    // 2 sahte okey
    tiles.push({ color: "Sahte", number: 0 });
    tiles.push({ color: "Sahte", number: 0 });

    return tiles;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function startGame() {
    let tiles = createTiles();

    shuffle(tiles);

    // Oyuncuya 21 taş dağıt
    playerTiles = tiles.splice(0, 21);

    showHand();

    alert("Oyun başladı! 21 taş dağıtıldı.");
}

function showHand() {
    hand.innerHTML = "";

    playerTiles.forEach(tile => {
        const tileElement = document.createElement("div");

        tileElement.className = "tile";

        if (tile.number === 0) {
            tileElement.textContent = "★";
        } else {
            tileElement.textContent = tile.number;
        }

        tileElement.title = tile.color;

        hand.appendChild(tileElement);
    });
}

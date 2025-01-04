// Go Fish Game Implementation with a Graphical Interface in JavaScript

// Deck of cards constructor
function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    const deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit });
        }
    }
    return deck;
}

// Shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Initialize game state
function initializeGame() {
    const deck = createDeck();
    shuffleDeck(deck);

    const playerHand = deck.splice(0, 7);
    const computerHand = deck.splice(0, 7);
    const drawPile = deck;
    const playerBooks = [];
    const computerBooks = [];

    return { playerHand, computerHand, drawPile, playerBooks, computerBooks };
}

// Check for books (four of a kind)
function checkForBooks(hand, books) {
    const rankCount = {};

    for (const card of hand) {
        rankCount[card.rank] = (rankCount[card.rank] || 0) + 1;
    }

    for (const rank in rankCount) {
        if (rankCount[rank] === 4) {
            books.push(rank);
            hand = hand.filter(card => card.rank !== rank);
        }
    }

    return hand;
}

// Take a turn (player or computer)
function takeTurn(askerHand, responderHand, rank, drawPile) {
    const matchingCards = responderHand.filter(card => card.rank === rank);
    if (matchingCards.length > 0) {
        askerHand.push(...matchingCards);
        responderHand = responderHand.filter(card => card.rank !== rank);
        return `${matchingCards.length} card(s) collected!`;
    } else if (drawPile.length > 0) {
        const drawnCard = drawPile.pop();
        askerHand.push(drawnCard);
        return drawnCard.rank === rank ? 'You drew the card you asked for!' : 'Go Fish!';
    } else {
        return 'No cards left to draw!';
    }
}

// Render the game interface
function renderGame(state) {
    const { playerHand, computerBooks, playerBooks, drawPile } = state;

    // Display player hand
    const playerHandDiv = document.getElementById('player-hand');
    playerHandDiv.innerHTML = '';
    playerHand.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.textContent = `${card.rank} of ${card.suit}`;
        playerHandDiv.appendChild(cardDiv);
    });

    // Display books
    document.getElementById('player-books').textContent = `Your books: ${playerBooks.join(', ')}`;
    document.getElementById('computer-books').textContent = `Computer books: ${computerBooks.join(', ')}`;

    // Display draw pile size
    document.getElementById('draw-pile').textContent = `Cards in draw pile: ${drawPile.length}`;
}

// Handle player action
function playerAction(state) {
    const rankInput = document.getElementById('rank-input');
    const rank = rankInput.value;
    rankInput.value = '';

    const message = takeTurn(state.playerHand, state.computerHand, rank, state.drawPile);
    state.playerHand = checkForBooks(state.playerHand, state.playerBooks);

    document.getElementById('message').textContent = message;
    renderGame(state);

    // Computer turn
    setTimeout(() => {
        const computerRank = state.computerHand[Math.floor(Math.random() * state.computerHand.length)].rank;
        const computerMessage = takeTurn(state.computerHand, state.playerHand, computerRank, state.drawPile);
        state.computerHand = checkForBooks(state.computerHand, state.computerBooks);

        document.getElementById('message').textContent = `Computer asks for: ${computerRank}. ${computerMessage}`;
        renderGame(state);
    }, 1000);
}

// Initialize and start the game
function startGame() {
    const state = initializeGame();
    renderGame(state);

    document.getElementById('ask-button').addEventListener('click', () => playerAction(state));
}

// HTML setup for the game
document.body.innerHTML = `
    <div id="game">
        <div id="player-area">
            <h2>Your Hand</h2>
            <div id="player-hand" class="hand"></div>
            <input id="rank-input" type="text" placeholder="Enter a rank (e.g., Ace, 7)">
            <button id="ask-button">Ask</button>
        </div>
        <div id="info-area">
            <p id="message">Welcome to Go Fish!</p>
            <p id="player-books"></p>
            <p id="computer-books"></p>
            <p id="draw-pile"></p>
        </div>
    </div>
`;

// CSS styling for the game
document.head.innerHTML += `
    <style>
        #game {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: Arial, sans-serif;
        }
        .hand {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .card {
            border: 1px solid black;
            padding: 10px;
            border-radius: 5px;
            background-color: white;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
        }
        #info-area {
            margin-top: 20px;
            text-align: center;
        }
        #rank-input {
            margin: 10px 0;
            padding: 5px;
        }
    </style>
`;

// Start the game
startGame();

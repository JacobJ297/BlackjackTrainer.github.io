var dealerSum = 0;
var yourSum = 0;
var count = 0;
var dealerAceCount = 0;
var yourAceCount = 0;
var hidden;
var deck;
var runningCount = 0;
var canHit = true; //allows the player (you) to draw while yourSum <= 21
var money = 10000;
var bet = 100;
var defaultBet = 100;

window.onload = function () {
  buildDeck();
  shuffleDeck();
  startGame();
  buttons1();
};

function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let types = ["C", "D", "H", "S"];
  deck = [];
  for (let k = 0; k < 6; k++) {
    // 6 deck shoe
    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < values.length; j++) {
        deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
      }
    }
    // console.log(deck);
  }
}
function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log(deck);
}

function startGame() {
  dealerAceCount = 0;
  yourAceCount = 0;
  dealerSum = 0;
  yourSum = 0;
  bet = defaultBet;
  canHit = true;
  document.getElementById("money").innerText = money;
  document.getElementById("bet").innerText = bet;
  document.getElementById("dbet").innerText = defaultBet;

  /* include for USA blackjack with hole card
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    let hiddenImg=document.createElement("img");
    hiddenImg.src="./cards/back.png";
    document.getElementById("dealer-cards").append(hiddenImg);
    */
  document.getElementById("money").innerText = money;

  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  document.getElementById("dealer-cards").append(cardImg);

  //Deal player two cards
  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
  }
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("dealer-sum").innerText = dealerSum;
  //Check for blackjack
  if (dealerSum == 21 && yourSum !== 21) {
    canHit = false;
    document.getElementById("results").innerText = "Dealer blackjack, you lose";
  }
  if (yourSum == 21 && dealerSum !== 21) {
    canHit = false;
    document.getElementById("results").innerText = "Blackjack! You win";
    money += 2.5 * bet;
  }
  if (yourSum == 21 && dealerSum == 21) {
    canHit = false;
    document.getElementById("results").innerText = "Push";
    money += 1 * bet;
  }
  //buttons
}

function hit() {
  if (canHit === false) {
    return;
  } else {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    document.getElementById("your-sum").innerText = yourSum;

    if (reduceAce(yourSum, yourAceCount) >= 21) {
      stay();
    }
  }
}

function stay() {
  while (dealerSum < 17) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);
  }

  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  canHit = false;
  //document.getElementById("hiddenImg").src="./cards/" + hidden + ".png";
  let message = "";
  if (yourSum > 21) {
    message = " Bust you Lose!";
  } else if (dealerSum > 21) {
    message = " You Win!";
    money += 2 * bet;
  } else if (yourSum == dealerSum) {
    message = "Push";
    money += 1 * bet;
  } else if (yourSum > dealerSum) {
    message = " You win!";
    money += 2 * bet;
  } else if (yourSum < dealerSum) {
    message = " You lose!";
  }

  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("your-sum").innerText = yourSum + message;
  document.getElementById("results").innerText = message;
}

function getValue(card) {
  let data = card.split("-");
  let value = data[0];

  if (isNaN(value)) {
    // A J Q or K
    if (value == "A") {
      value = 11;
    } else {
      value = 10;
    }
  }

  // Running count -1 0 or +1
  console.log(parseInt(value));
  if (2 <= parseInt(value) && parseInt(value) <= 6) {
    runningCount += 1;
  } else if (7 <= parseInt(value) && parseInt(value) <= 9) {
    runningCount += 0;
  } else if (parseInt(value) == 10 || parseInt(value) == 11) {
    runningCount -= 1;
  }

  console.log(runningCount);
  return parseInt(value);
}

function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  } else {
    return 0;
  }
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}
function newHand() {
  var imagex = document.getElementById("dealer-cards");
  imagex.innerHTML = "";
  //imagex.parentNode.removeChild(imagex);

  var imagey = document.getElementById("your-cards");
  imagey.innerHTML = "";
  //imagey.parentNode.removeChild(imagey);
}
function count2() {
  window.alert("The count is " + runningCount);
}
function basicStrategy() {
  var action = 2;
  // see if double down
  if (yourAceCount == 1) {
    if (yourSum >= 13 && yourSum <= 16 && (dealerSum == 5 || dealerSum == 6)) {
      action = "double down";
    }
    if ((yourSum == 17 || yourSum == 18) && dealerSum < 7) {
      action = "double down";
    }
  } else {
    if (yourSum == 9 && dealerSum < 7) {
      action = "double down";
    }
    if (yourSum == 10 && dealerSum < 10) {
      action = "double down";
    }
    if (yourSum == 11) {
      action = "double down";
    }
  }
  // hit or stay
  if (yourAceCount == 1) {
    if (yourSum < 18) {
      action = "hit";
    }
    if (yourSum > 18) {
      action = "stay";
    }
    if (yourSum < 12) {
      action = "hit";
    }
  }
  if (dealerSum < 7) {
    if (yourSum == 12 && (dealerSum == 2 || dealerSum == 3)) {
      action = "hit";
    } else {
      action = "stay";
    }
  } else {
    if (yourSum < 17) {
      action = "hit";
    } else {
      action = "stay";
    }
  }
  window.alert(action);
}

function addMoney(amount) {
  money -= 100;
  defaultBet += 100;
  document.getElementById("money").innerText = money;
  document.getElementById("dbet").innerText = defaultBet;
}
function addMoney2(amount) {
  money -= 1000;
  defaultBet += 1000;
  document.getElementById("money").innerText = money;
  document.getElementById("dbet").innerText = defaultBet;
}

function resetBet() {
  defaultBet = 100;
  document.getElementById("dbet").innerText = defaultBet;
}

function buttons1() {
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
  document.getElementById("new").addEventListener("click", newHand);
  document.getElementById("new").addEventListener("click", startGame);
  document.getElementById("count").addEventListener("click", count2);
  document.getElementById("strategy").addEventListener("click", basicStrategy);
  document.getElementById("ten").addEventListener("click", addMoney);
  document.getElementById("thousand").addEventListener("click", addMoney2);
  document.getElementById("reset").addEventListener("click", resetBet);
}

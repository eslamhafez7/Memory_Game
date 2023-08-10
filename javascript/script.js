let timeInterval;
let timeLimit = 140;
let timeoutBox = document.querySelector(".timeout");
let correctAttemptsBox = document.querySelector(".correct-attempts");
let wrongAttemptsBox = document.querySelector(".wrong-attempts");


function updatename(newName) {
    let nameSpan = document.querySelector(".name span");
    nameSpan.textContent = newName;
    let speech = new SpeechSynthesisUtterance(`Hello ${newName}`);
    speech.rate = 1.5;
    window.speechSynthesis.speak(speech);
}


function theName() {
    let yourName = prompt('What\'s Your Name');
    if(yourName == null || yourName == '') {
        updatename();
        document.querySelector(".name span").innerHTML = 'Undefined'
    }else {
        updatename(yourName);
        document.querySelector(".name span").innerHTML = yourName;
    }
}


window.addEventListener("load", () => {
    Swal.fire({
        icon: 'question',
        title: 'Memory Game',
        confirmButtonText: 'Start Game',
    }).then((result) => {
        if (result.isConfirmed) {
            theName();
            document.querySelector(".overlay").remove();
            startTimer();
        }
    });
})


function startTimer() {
    timeInterval = setInterval(() => {
        timeLimit--;
        document.querySelector(".timeout span").innerHTML = timeLimit;
        if(timeLimit <= 20) {
            timeoutBox.style.backgroundColor = '#ff00007d';
        } 
        if(timeLimit <= 0) {
            clearInterval(timeInterval)
            endGame();
        }
    }, 1000);
}


const duration = 1000;
const gameContainer = document.querySelector(".game-container");
const gameBoxs = Array.from(gameContainer.children);
const range = [...Array(gameBoxs.length).keys()];
shuffle(range);


gameBoxs.forEach((card, index) => {
    card.style.order = range[index];
    card.addEventListener("click", () => {
        flipCard(card);
    });
});




function flipCard(selectedCard) {
    selectedCard.classList.add("is-flipped");
    let allFlipped = gameBoxs.filter(flippedCard => flippedCard.classList.contains("is-flipped"));
    if(allFlipped.length === 2) {
        stopClicking();
        checkMatched(allFlipped[0], allFlipped[1]);
    }
} 



function stopClicking() {
    gameContainer.classList.add("unable-to-click")
    setTimeout(() => {
        gameContainer.classList.remove("unable-to-click")
    }, duration);
}


function checkMatched(firstCard, secondCard) {
    const wrongTries = document.querySelector(".wrong-attempts span");
    if(firstCard.dataset.technology === secondCard.dataset.technology) {
        const correctTries = document.querySelector(".correct-attempts span");
        correctTries.innerHTML = parseInt(correctTries.innerHTML) + 1;
        if(parseInt(correctTries.innerHTML) >= 1) {
            correctAttemptsBox.style.backgroundColor = '#00800070';
        }
        if(parseInt(correctTries.innerHTML) >= 14) {
            winGame();
        }
        firstCard.classList.remove("is-flipped");
        secondCard.classList.remove("is-flipped");
        firstCard.classList.add("matching");
        secondCard.classList.add("matching");
        document.getElementById("success").play();
    }else {
        wrongTries.innerHTML = parseInt(wrongTries.innerHTML) + 1;
        if(parseInt(wrongTries.innerHTML) >= 30) {
            wrongAttemptsBox.style.backgroundColor = '#ff00007d';
        } 
        if(parseInt(wrongTries.innerHTML) >= 40) {
            endGame();
        }
        setTimeout(() => {
            firstCard.classList.remove("is-flipped");
            secondCard.classList.remove("is-flipped");
        }, duration);
        document.getElementById("fail").play();
    }
}


function shuffle(array) {
    let current = array.length,
    temp,
    random;
    while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }
    return array;
}


function endGame() {
    Swal.fire({
        icon: 'error',
        title: 'Oops..Game Over',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-redo"></i> New Game',
        cancelButtonText: '<i class="fas fa-times"></i> Exit',
        showCloseButton: false,
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            window.location.reload();
        }
    });
    document.getElementById("lose").play();
}


function winGame() {
    Swal.fire({
        icon: 'success',
        title: 'Congratulations!',
        text: 'You guessed the correct Cards',
        confirmButtonText: 'New Game',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });
    document.getElementById("win").play();
};

function getData() {
    let date = new Date().getFullYear();
    document.querySelector(".copyright span").innerHTML = date;
}
getData();
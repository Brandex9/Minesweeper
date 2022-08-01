document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  //dynamic width for difficulty changes
  let width = 10;
  //loop bombAmount to increase difficulty. tie it to subtext to notify player the new bomb amount.
  let bombAmount = Math.floor(Math.random() * 10) + 20;
  bombLeft = document.querySelector(".subtext");
  bombLeft.textContent = " Bombs Left:" + "" + bombAmount;
  //ability to give moreor less flags
  let flags = 0;
  let squares = [];
  let isGameOver = false;

  //create board
  function createBoard() {
    //combine two arrays bomb and empty to make game array then shufle it
    const bombArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("good");

    const gameArray = bombArray.concat(emptyArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      //listens to the clicks on the grid
      square.addEventListener("click", function (e) {
        click(square);
        e.stopPropagation();
      });

      //flag right click
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    //add numbers to the empty array
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      // borders make the visual aspect of the grid match the next number in the array.
      const leftBorder = i % width === 0;
      const rightBorder = i % width === width - 1;
      //change magic numbers so that it isnt hard coded in a 10 by 10 game format
      // defines where bombs can be and cant be. Border signifys visual edge.
      if (squares[i].classList.contains("good")) {
        if (i > 0 && !leftBorder && squares[i - 1].classList.contains("bomb"))
          total++;
        if (
          i > 9 &&
          !rightBorder &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++;
        if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
        if (
          i > 11 &&
          !leftBorder &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          total++;
        if (i < 98 && !rightBorder && squares[i + 1].classList.contains("bomb"))
          total++;
        if (
          i < 90 &&
          !leftBorder &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++;
        if (
          i < 88 &&
          !rightBorder &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++;
        if (i < 89 && squares[i + width].classList.contains("bomb")) total++;
        squares[i].setAttribute("data", total);
        console.log(squares[i]);
      }
    }
  }

  //Ability to flag bombs to keep track of location you think bombs reside/ right click
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("verified") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "🚩";
        flags++;
        checkWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
      }
    }
  }

  //click on square prints a log/thers data
  function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("verified") ||
      square.classList.contains("flag")
    )
      return;
    if (square.classList.contains("bomb")) {
      gameOver();
    } else {
      let total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("verified");
        if (total == 1) square.classList.add("one");
        if (total == 2) square.classList.add("two");
        if (total == 3) square.classList.add("three");
        if (total == 4) square.classList.add("four");
        if (total == 5) square.classList.add("five");
        if (total == 6) square.classList.add("six");
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("verified");
  }

  //checking for squares near by once clicked
  function checkSquare(square, currentId) {
    const leftBorder = currentId % width === 0;
    const rightBorder = currentId % width === width - 1;
    setTimeout(() => {
      if (currentId > 0 && !leftBorder) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !rightBorder) {
        const newId = parseInt(currentId) + 1 - width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 10) {
        const newId = parseInt(currentId) - width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 11 && !leftBorder) {
        const newId = parseInt(currentId) - 1 - width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 98 && !rightBorder) {
        const newId = parseInt(currentId) + 1 - width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90 && !leftBorder) {
        const newId = parseInt(currentId) - 1 + width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 88 && !rightBorder) {
        const newId = parseInt(currentId) + 1 + width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89) {
        const newId = parseInt(currentId) + width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  function gameOver(square) {
    if ((isGameOver = true)) {
      alert("Game Over!");
    }
    isGameOver = true;
    //Shows all bombs
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
      }
    });
  }

  //check for win
  function checkWin() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bombAmount) {
        alert("You Win");
        isGameOver = true;
      }
    }
  }

  createBoard();
});

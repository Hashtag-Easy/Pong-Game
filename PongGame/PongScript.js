//ustawianie obiektów
const canvas = document.getElementById("myGame");
const ctx = canvas.getContext("2d");
let canvasTop = canvas.offsetTop;
window.addEventListener("keypress", keyPress);
window.addEventListener("mousemove", mouseMove);
//ustawianie canvasWidth / canvasHeight / gameStart / gameFrameRate / scoreboard
canvas.width = 1100;
canvas.height = 550;
const cW = canvas.width;
const cH = canvas.height;
let gameStart = 0;
let gameFrameRate = 120;
let scoreboard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let interval;
//ustawianie wielkości piłki / X piłki / Y piłki / przyśpieszenie piłki X /przyśpieszenie piłki Y
const bS = 20;
let ballX, ballY;
let accX, accY;
//ustawienie szerokość i wysykość paletek, ich X i Y
const paddleW = 20;
const paddleH = 100;
let paddle1X, paddle1Y;
let paddle2X, paddle2Y;
//ustawianie linia środkowa
const lineW = 4;
const lineH = 18;
const lineGap = 5;
//ustawianie tablic buffor / wynik / nowy wynik / liczba w tabeli 
let buffor;
let newScore = 0;
let newScoreBar;
let score;
let x;
let count;
//ustawienie gracz i SI
const playerName = "Gracz";
let playerPoints = 0;
let siPoints = 0;
let botDiffName = "Łatwy";
let botDiff = 1;
//tworzenie i wpisywanie nowej teablicy na stronę 
function scoreboardScore (scoreboard, newScore) {
  score = '<div id="scoreTableName">WYNIKI</div><br>';
  count = 1;
  for (a = 0; a <= 8; a++) {
    x = scoreboard[a].toString();
    x = 7-x.length;
    for (i = 0; i < x; i++) {
      scoreboard[a] = "0" + scoreboard[a];
    }
    score = score + "<br>" + count + "." + scoreboard[a];
    count += 1;
  }
  document.getElementById("scoreTable").innerHTML = score;
  console.log("Pong: Dodano nowy wynik do tablicy wyników: " + newScore);
}
//dodawanie nowego wyniku i jego segregowanie 
function scoreAdd (newScore) {
  scoreboard[9] = newScore;
  for (i = 9; i > 0; i--) {
    if (scoreboard[i] >= scoreboard[i-1])  { 
      buffor = scoreboard[i-1];
      scoreboard[i-1] = scoreboard[i];
      scoreboard[i] = buffor;
    }
  } 
  scoreboardScore(scoreboard, newScore);
  return scoreboard;
}
//reset wszysktich zmiennych po zakończonej rundzie i po wczytaniu stronu lub po naciśnięciu R
function reset (x) {
  newScore = 0;
  ballX = cW/2 - bS/2;
  ballY = cH/2 - bS/2;
  paddle1X = 70;
  paddle1Y = cH/2 - paddleH/2;
  paddle2X = cW - 70 - paddleW;
  paddle2Y = cH/2 - paddleH/2;
  if (x == true) {
    botDiff = 1;
    botDiffName = "Łatwy";
    document.getElementById("siName").innerHTML = botDiffName;
    playerPoints = 0;
    document.getElementById("playerScore").innerHTML = playerPoints;
    siPoints = 0;
    document.getElementById("siScore").innerHTML = siPoints;
  }
  if (Math.random() <= 0.5) {accX = -1.35} else {accX = 1.35}
  if (Math.random() <= 0.5) {accY = -1.35} else {accY = 1.35}
  animation(true);
  return ballX, ballY, paddle1X, paddle1Y, paddle2X, paddle2Y, accX, accY, score, botDiff, newScore, siPoints, botDiffName, playerPoints;
}
//rysowanie pilki
function ballRender () {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(ballX, ballY, bS, bS);	
}
//ruch piłki
function ballMove () {
  ballX += accX;
  ballY += accY;
}
//rysowanie boiska
function tableRender () {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cW, cH);
}
//rysowanie lini
function lineRender () {
  for (i = 14; i < cH; i += 36) {
    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(cW/2 - lineW/2, i, lineW, lineH);		
  }
}
//paletka nr 1
function paddle1 () {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(paddle1X, paddle1Y, paddleW, paddleH);
}
//paletka nr 2 
function paddle2 () {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(paddle2X, paddle2Y, paddleW, paddleH);
}
//kolizja
function colision () {
  //odbicie od ścian górna, dolna
  if (ballY <= 0 || ballY + bS >= cH) {
    accY = -accY;
    if (accX > 0) {
      accX += (2*Math.floor(Math.random()*10))/100;
      } else {
        accX -= (2*Math.floor(Math.random()*10))/100;
      }
    if (accY > 0) {
      accY += (1.25*Math.floor(Math.random()*10))/100;
      } else {
        accY -= (1.25*Math.floor(Math.random()*10))/100;
      }
    newScore += Math.floor(botDiff*2.5)*(Math.floor(10+((Math.abs(accX)+Math.abs(accY)/2)*10)));
  }
  //punkt dla SI (błąd w nazwach zmiennych)
  if (ballX <= 0) {
    gameStart = 0;
    clearInterval(interval);
    scoreAdd(newScore);
    playerPoints += 1;
    document.getElementById("playerScore").innerHTML = playerPoints;
    reset();
    console.log("Pong: Punkt dla SI!!!") 
  }
  //punkt dla Gracza (błąd w nazwach zmiennych)
  if (ballX + bS >= cW) {
    gameStart = 0;
    clearInterval(interval);
    scoreAdd(newScore);
    siPoints += 1;
    document.getElementById("siScore").innerHTML = siPoints;
    reset();
    console.log("Pong: Punkt dla Gracza!!!") 
  }
  //paletka gracza
  if (ballX <= paddle1X + paddleW && ballY + bS >= paddle1Y  && ballY <= paddle1Y + paddleH && ballX + bS >= paddle1X) {
    if (accX < 0) {
      accX = -accX;
      accX += (2*Math.floor(Math.random()*10))/100;
    }
    if (accY > 0) {
      accY += (1.25*Math.floor(Math.random()*10))/100;
    } else {
      accY -= (1.25*Math.floor(Math.random()*10))/100;
    }
    newScore += Math.floor(botDiff*2.5)*(Math.floor(10+((Math.abs(accX)+Math.abs(accY)/2)*10)));
  }
  //paletka SI
  if (ballX + bS >= paddle2X && ballY + bS >= paddle2Y  && ballY <= paddle2Y + paddleH && ballX <= paddle2X + paddleW ) {
    if (accX > 0) {
      accX = -accX;
      accX -= (2*Math.floor(Math.random()*10))/100;
    }
    if (accY > 0) {
      accY += (1.25*Math.floor(Math.random()*10))/100;
    } else {
      accY -= (1.25*Math.floor(Math.random()*10))/100;
    }
    newScore += Math.floor(botDiff*2.5)*(Math.floor(10+((Math.abs(accX)+Math.abs(accY)/2)*10)));
  }
  return ballY, ballX, accX, accY, gameStart, newScore;
}
//wywoływanie klatek animacji
function animation (x) {
  if (gameStart == 0 && x != true) {
    reset();
    console.log("Pong: Gra załadowana poprawnie!");
  }
  if (gameStart == 1) {
    ballMove();
  }	
  tableRender();
  lineRender();
  colision();
  ballRender();
  paddle1();
  paddle2();
  ai();
  x = newScore.toString();
  x = 7-x.length;
  newScoreBar = newScore;
  for (i = 0; i < x; i++) {
    newScoreBar = "0" + newScoreBar;
  }
  document.getElementById("scoreName").innerHTML = newScoreBar;	
}
function SIDiff (x) {
  //1 = Łatwy
  //1.5 = Średni
  //2 = Trudny
  //2.5 = Bardzo Trudny
  //3 = Ekstremalny
  botDiff += x; 
  if (botDiff < 1) {
    console.log("Nie można ustawić niższego poziomy trudności!");
    botDiff = 1;
  } else if (botDiff > 3) {
    console.log("Nie można ustawić wyższego poziomy trudności!");
    botDiff = 3;
  } else if (gameStart == 0) {
    switch(botDiff) {
      case 1:
        botDiffName = "Łatwy";
        break;
      case 1.5:
        botDiffName = "Średni";
        break;
      case 2:
        botDiffName = "Trudny";
        break;
      case 2.5:
        botDiffName = "Bardzo Trudny";
        break;
      case 3:
        botDiffName = "Ekstremalny";
        break;
      default:
        console.log("Pong: Błąd wybiernia poziomu trudności.");
        break;
    }
    console.log("Pong: Zmianna poziomu trudności SI na : " + botDiffName + "!");
  }
  document.getElementById("siName").innerHTML = botDiffName;
  return botDiffName, botDiff;
}
//szutczna inteligencja
function ai () {
  if (accX < 0 && ballX >= cW/1.3) {
    if (paddle2Y + paddleH/2 > ballY) {
      if (paddle2Y >= 0) {
        if (paddle2Y > ballY + bS || paddle2Y + paddleH < ballY) {
          paddle2Y = paddle2Y - 1.5*botDiff*2;	
        } else {
          paddle2Y = paddle2Y - 1.5*botDiff;
        }
      }
    }
    if (paddle2Y + paddleH/2 < ballY) {
      if (paddle2Y <= cH - paddleH) {
        if (paddle2Y > ballY + bS || paddle2Y + paddleH < ballY) {
          paddle2Y = paddle2Y + 1.5*botDiff*2;	
        } else {
          paddle2Y = paddle2Y + 1.5*botDiff;
        }
      }
    }
  }
  if (accX > 0 && ballX >= cW/5) {
    if (paddle2Y + paddleH/2 > ballY) {
      if (paddle2Y >= 0) {
        if (paddle2Y > ballY + bS || paddle2Y + paddleH < ballY) {
          paddle2Y = paddle2Y - 1.5*botDiff*2;	
        } else {
          paddle2Y = paddle2Y - 1.5*botDiff;
        }
      }
    }
    if (paddle2Y + paddleH/2 < ballY) {
      if (paddle2Y <= cH - paddleH) {
        if (paddle2Y > ballY + bS || paddle2Y + paddleH < ballY) {
          paddle2Y = paddle2Y + 1.5*botDiff*2;	
        } else {
          paddle2Y = paddle2Y + 1.5*botDiff;
        }
      }	
    }
  }
return paddle2Y;
}
//rejestrator klawiatury
function keyPress (e) {
  //space
  if (e.keyCode == 32) {
    if (gameStart == 0) {
      //start gry
      gameStart = 1;
      interval = setInterval(animation, 1000/gameFrameRate);
      console.log("Pong: Gra rozpoczęta.");
      console.log("Pong: Poziom trudności przeciwnika: " + botDiffName + ".");
      return gameStart;
    } else if (gameStart == 1) {
      //pauza gry
      gameStart = 2;
      clearInterval(interval);
      console.log("Pong: Gra wstrzymana.");
      return gameStart;
    } else if (gameStart == 2) {
      //wznowienie gry
      gameStart = 1;
      interval = setInterval(animation, 1000/gameFrameRate);
      console.log("Pong: Gra wznowiona.");
      return gameStart;
    }
  }
  //W
  /*if (e.keyCode == 119) {

  }
  //S
  if (e.keyCode == 115) {

  }*/
  //R
  if (e.keyCode == 114) {
    gameStart = 0;
    reset(true);
    clearInterval(interval);
    console.log("Pong: Gra zresetowana!");
    return gameStart;
  }
  //Z
  if (e.keyCode == 120 && gameStart == 0) {
    SIDiff(0.5);
    } else if (e.keyCode == 120 && gameStart != 0) {
      console.log("Pong: Nie można zminiać poziomu trudności ponieważ gra jest w toku.");
    }
  //X
  if (e.keyCode == 122 && gameStart == 0) {
    SIDiff(-0.5);
    } else if (e.keyCode == 122 && gameStart != 0) {
      console.log("Pong: Nie można zminiać poziomu trudności ponieważ gra jest w toku.");
    }	
}

function mouseMove (e) {
  paddle1Y = e.clientY - canvasTop;
  if(paddle1Y <= 0) {
    paddle1Y = 0;
  }
  if(paddle1Y >= cH - paddleH) {
    paddle1Y = cH - paddleH;
  }
  return paddle1Y;
}
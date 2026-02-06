/*
    Jogo desenvolvido como projeto de estudo de JavaScript e Canvas.
    Conceito, lógica e implementação feitos por mim, com apoio de IA para esclarecimento de dúvidas e estruturação do código.
*/

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const screenImg1 = new Image();
screenImg1.src = "imgs/lounge.jpg";

const screenImg2 = new Image();
screenImg2.src = "imgs/kitchen.jpg";

const screenImg3 = new Image();
screenImg3.src = "imgs/outside2.jpg";

const catImg = new Image();
catImg.src = "imgs/catIdle.png"; // tamanho 320 x 32

let currentScreen = 1; //tela atual
let dialogueIndex = 0;
let currentText = "";
let letterIndex = 0;
let isTyping = true;
const textSpeed = 1; // velocidade do texto

const dialogues = {
    1: [
        "Pode me ajudar a encontrar o meu gato?",
        "Não Consigo encontrar em lugar nenhum.",
        "Talvez esteja na cozinha ou no quintal?"
    ],
    2: [
        "Hmm... não vejo o gato aqui.",
        "Talvez ele tenha ido para fora."
    ],
    3: [
        "Tenho a impressão que vi ele passando por aqui.",
        "Espero que não tenha fugido para a vizinha...",
        "Onde será que ele está?"
    ]
};

const hotspots = {
    1: [ /* sala */
        {
            id: "plantas",
            x: 125, // posição horizontal
            y: 130, // posição vertical
            width: 80, // largura da superfície
            height: 200, // altura da superfície
            text: "Você olha atrás do vaso de plantas e... nada aqui."
        },
        {
            id: "almofadas",
            x: 440,
            y: 190,
            width: 100,
            height: 80,
            text: "Só almofadas e poeira."
        },
        {
            id: "abajur",
            x: 740,
            y: 20,
            width: 60,
            height: 80,
            text: "Poderia ser um bom lugar... mas não."
        },

    ],

    2: [/* cozinha */
        {
            id: "armario",
            x: 400,
            y: 20,
            width: 100,
            height: 130,
            text: "Um bom lugar para se esconder... mas não."
        },
        {
            id: "geladeira",
            x: 240,
            y: 120,
            width: 80,
            height: 130,
            text: "A geladeira está vazia. O gato não está aqui."
        },
        {
            id: "forno",
            x: 620,
            y: 185,
            width: 70,
            height: 130,
            text: "Dentro do forno? Talvez não.."
        },
    ],
    3: [ /* quintal */
        {
            id: "arbustos",
            x: 640,
            y: 220,
            width: 150,
            height: 120,
            text: "Você olha atrás do arbusto."
        }
    ]
};

let catLocation = {
    screen: null,
    hotspotId: null
};
let showCat = false;

// Criando botão next para passar para próxima tela
const nextButton = {
    x: 700,
    y: 250,
    width: 50,
    height: 50
};

// Criando botão prev para passar para tela anterior
const prevButton = {
    x: 75,
    y: 250,
    width: 50,
    height: 50
};

// Criando botão de restart
const restartButton = {
    x: 300,
    y: 260,
    width: 232,
    height: 50
}

// criando um chat para interagir com player
const newChat = {
    x: 100,
    y: 360,
    width: 600,
    height: 75
}

const catInfo = {
    x: 0, // posição horizontal inicial
    y: 0, // posição vertical inicial
    // Dimensão da imagem dos sprites 320x32, 1linha e 4colunas
    largura: 32, // 320px dividido por 10 colunas
    altura: 32, // 32px dividido por 1 linha
    frameX: 0, // qual imagem do spritesheet vai mostrar, no ponto vertical
    // AQUI  NÃO PRECISAMOS DO frameY PORQUE SÓ TEM 1 LINHA!
    veloc: 9, // quantos pixels por frame ele se move na aniação
    frameTimer: 0
}

// sortear lugares onde o gato pode estar
function randomCatLocation() {
    const screens = Object.keys(hotspots);
    const randomScreen = screens[Math.floor(Math.random() * screens.length)];

    const spots = hotspots[randomScreen];
    const randomSpot = spots[Math.floor(Math.random() * spots.length)];

    // só para teste - mostrar onde está o gato no console
    catLocation.screen = Number(randomScreen);
    catLocation.hotspotId = randomSpot.id;
    console.log("🐱 Gato está na tela", catLocation.screen, "no hotspot", catLocation.hotspotId);
}

/* *** AREA DE TELA *** */
// desenhando a primeira tela, com botão next e chat
function drawScreen1() {
    ctx.drawImage(screenImg1, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Sala de Estar", 50, 50);

    drawButton(">", nextButton);
    drawChat(newChat);
    // DEBUG - drawHotspotDebug();

    if (showCat && currentScreen === catLocation.screen) {
        catAnimation();
        drawRestartButton();
    };
}

// desenhando a segunda tela, com botão next e prev, e chat
function drawScreen2() {
    ctx.drawImage(screenImg2 ,0,0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Cozinha", 50,50);

    drawButton(">", nextButton);
    drawButton("<", prevButton);
    drawChat(newChat);
    // DEBUG - drawHotspotDebug();

    if (showCat && currentScreen === catLocation.screen) {
        catAnimation();
        drawRestartButton();
    };
}

// desenhando a terceira tela, com botão prev e chat
function drawScreen3() {
    ctx.drawImage(screenImg3,0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Quintal", 50, 50);

    drawButton("<", prevButton);
    drawChat(newChat);
    // DEBUG - drawHotspotDebug();

    if (showCat && currentScreen === catLocation.screen) {
        catAnimation();
        drawRestartButton();
    };
}

// função de desenhar botão na tela
function drawButton(text, btn) {
    ctx.fillStyle = "grey"; // fillStyle só vale para o próximo desenho
    ctx.fillRect(btn.x, btn.y, btn.width, btn.height);

    ctx.fillStyle = "white"; // aqui de novo para o próximo desenho
    ctx.font = "30px Arial";
    ctx.fillText(text, btn.x + 20, btn.y + 35);
}

// desenhando o botão de restart
function drawRestartButton() {
    ctx.fillStyle = "black";
    ctx.fillRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height);

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Jogar Novamente", restartButton.x + 20, restartButton.y + 32);
}


function catAnimation() {
    // só desenhar o gato se estiver carregado
    if (!catImg.complete) return;

    // Controlando velocidade da animação do gato
    catInfo.frameTimer++;

    if (catInfo.frameTimer >= catInfo.veloc) {
        catInfo.frameX++; // avançando imagem a cada frame
        catInfo.frameTimer = 0;

        if (catInfo.frameX >=10) {
            catInfo.frameX = 0;
        }
    }

    // Desenhando o gato na tela
    ctx.drawImage(catImg,
        catInfo.frameX * catInfo.largura, // corte horizontal no spritesheet
        0, // corte vertical no spritesheet (só tem 1 linha)
        catInfo.largura,
        catInfo.altura,
        catInfo.x,
        catInfo.y,
        catInfo.largura * 2, // gato muito pequeno, aumentar largura
        catInfo.altura * 2); // gato muito pequeno, aumentar altura

    // se passar todas as imagens da aniamção, volta do início da imagem para passar tudo de novo
    if (catInfo.frameX >=10) {
        catInfo.frameX = 0;
    }

}

// Posição do gato - de acordo com o hotspot
function placeCatOnSpot(spot) {
    catInfo.x = spot.x + spot.width / 2 - catInfo.largura;
    catInfo.y = spot.y + spot.height  / 2 - catInfo.altura;
};

/*
// DEBUG - Hotposts
function drawHotspotDebug() {
    const screenHotspots = hotspots[currentScreen];
    if (!screenHotspots) return;

    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    for (let spot of screenHotspots) {
        ctx.strokeRect(spot.x, spot.y, spot.width, spot.height);
    }

    ctx.restore();
};*/

/* *** AREA DOS TEXTOS **** */
// acelerar a escrita caso player clique no chat
function updateTyping(fullText) {
    if (isTyping) {
        currentText = fullText.slice(0, letterIndex);
        letterIndex += textSpeed;

        if (letterIndex > fullText.length) {
            isTyping = false;
        }
    }
}

// fazer com que as letras caibam todas dentro do chat
function drawWrappedText(text, x,y,maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let offsetY = 0;

    for (let i = 0; i< words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i> 0) {
            ctx.fillText(line, x, y + offsetY);
            line = words[i] + " ";
            offsetY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line,x,y + offsetY);
}

// desenhando o chat
function drawChat(chat) {
    ctx.save() //salva estado atual

    // caixa cinza
    ctx.fillStyle = "grey";
    ctx.fillRect(chat.x, chat.y, chat.width, chat.height);

    // texto na área cinza
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textBaseline = "top"; // letras escritas em cima da linha

    // definindo texto atual
    const fullText = dialogues[currentScreen][dialogueIndex] || "";
    updateTyping(fullText);

    // texto de caso encontre o gato
    if (showCat) {
        currentText = "Você encontrou o meu gato! 🐱🎉  Agora posso passear com ele! Muito obrigada!";
        isTyping = false;
    }

    // fazendo texto caber no chat
    drawWrappedText(
        currentText,
        chat.x + 15,
        chat.y + 15,
        chat.width - 30,
        26
    );

    ctx.restore(); // volta tudo ao normal
}


// Detectar Clique de mouse em qualquer um dos botões
canvas.addEventListener("click", (event) => {

    // dectectando os cliques
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // clicou no botão next?
    const clickedNext = 
        mouseX >= nextButton.x &&
        mouseX <= nextButton.x + nextButton.width &&
        mouseY >= nextButton.y &&
        mouseY <= nextButton.y + nextButton.height;

    // clicou no botão prev?
    const clickedPrev = 
        mouseX >= prevButton.x &&
        mouseX <= prevButton.x + prevButton.width &&
        mouseY >= prevButton.y &&
        mouseY <= prevButton.y + prevButton.height;
    
    // clicou no chat?
    const clickedChat =
        mouseX >= newChat.x &&
        mouseX <= newChat.x + newChat.width &&
        mouseY >= newChat.y &&
        mouseY <= newChat.y + newChat.height;

    const screenHotspots = hotspots[currentScreen];

    // se encontrar o gato, para tudo e mostra botão de jogar de novo
    if (showCat) {
        const clickRestart = 
            mouseX >= restartButton.x &&
            mouseX <= restartButton.x + restartButton.width &&
            mouseY >= restartButton.y &&
            mouseY <= restartButton.y + restartButton.height;
        
        if (clickRestart) {
            restartGame();
        }
        
        return; 
    };
    
    if (clickedNext && currentScreen < 3) {
        currentScreen++;

        dialogueIndex = 0;
        letterIndex = 0;
        currentText = "";
        isTyping = true;
    }

    if (clickedPrev && currentScreen > 1) {
        currentScreen--;

        dialogueIndex = 0;
        letterIndex = 0;
        currentText = "";
        isTyping = true;
    }


    if (clickedChat) {
        if (isTyping) {
            currentText = dialogues[currentScreen][dialogueIndex];
            isTyping = false; 
            isTyping = false; // termina o texto instantâneamente
        } else {
            dialogueIndex++; // próximo diálogo

            if( dialogueIndex >= dialogues[currentScreen].length) {
                dialogueIndex = dialogues[currentScreen].length - 1;
            }

            letterIndex = 0;
            currentText = "";
            isTyping = true;
        }
    };

    // verificando se Clicou em um hotspot
    if (screenHotspots) {
        for (let spot of screenHotspots) {
            const clickedSpot =
                mouseX >= spot.x &&
                mouseX <= spot.x + spot.width &&
                mouseY >= spot.y &&
                mouseY <= spot.y + spot.height;
            
            if (clickedSpot) {
                // clicou no gato?
                if (currentScreen === catLocation.screen && spot.id === catLocation.hotspotId) {
                    currentText = "MIAU!! Você encontrou o gato! 🐱";
                    isTyping = false;

                    placeCatOnSpot(spot);
                    showCat = true;

                    // DEBUG - Mensagem de vitória
                    console.log("🎉 VITÓRIA");
                } else {
                    currentText = spot.text;
                    dialogueIndex = 0;
                    isTyping = false;
            }
            break;
        }
    }
}})


// Game Loop
function gameLoop() {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    if (currentScreen === 1) drawScreen1();
    if (currentScreen === 2) drawScreen2();
    if (currentScreen === 3) drawScreen3();

    requestAnimationFrame(gameLoop);
}

// Gerando as imagens primeiro
let imagesLoaded = 0;
const total_images = 4;

screenImg1.onload = checkImagesLoaded;
screenImg2.onload = checkImagesLoaded;
screenImg3.onload = checkImagesLoaded;
catImg.onload = checkImagesLoaded;

function checkImagesLoaded(){
    imagesLoaded++;
    if (imagesLoaded === total_images){
        randomCatLocation();
        gameLoop(); // o jogo só começa quando as imagens forem geradas
    }
}

function restartGame() {
    showCat = false;

    currentScreen = 1;
    dialogueIndex = 0;
    letterIndex = 0;
    currentText = "";
    isTyping = true;

    randomCatLocation();

    // DEBUG - jogo reiniciou?
    console.log("🔄 Jogo reiniciado");
}
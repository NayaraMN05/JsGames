// Salvando o CANVAS do HTML como variável no JS
const canvas = document.getElementById('canvas1');
const canvasContext = canvas.getContext('2d');

canvas.width = 800; // não muda o que foi criado no CSS
canvas.height = 500; // não muda o que foi criado no CSS

const teclas = [];

//Informação sobre o jogador
const jogadorInfo = {
    x: 200, // posição horizontal inicial
    y: 150, // posição vertical inicial
    //Dimensões da imagem dos sprites: 160x288, 4linhas e  4colunas 
    altura: 72, // 288 dividido por 4!
    largura: 40, // 160 dividido por 4!
    framex: 0, // qual imagem do spritesheet vai mostrar, ponto horizontal
    framey: 0, // qual imagem do spritesheet vai mostrar, ponto vertical
    veloc: 9, // quantos pixels por frame anda na animação
    andando: false,
};

const jogadorSprite =  new Image();
jogadorSprite.src = 'sprites/chewie.png';

const imgFundo = new Image();
imgFundo.src = 'background.png';

// Desenhando sprites
function desenharSprite(img, sx, sy, sw, sh, dx, dy, dw, dh) {
    canvasContext.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
};



//teclas que o usuário vai pressionar
window.addEventListener("keydown", function(e) {
    teclas[e.keyCode] = true;
    jogadorInfo.andando = true;
});
window.addEventListener("keyup", function(e) {
    delete teclas[e.keyCode];
    jogadorInfo.andando = false;
});

function moverPlayer () {
    // código da tecla da seta para cima = 38
    if (teclas[38] && jogadorInfo.y > 100) {
        jogadorInfo.y -= jogadorInfo.veloc;
        jogadorInfo.framey = 3;
        jogadorInfo.andando = true;
    }
    // código da tecla da seta esquerda = 37
    if (teclas[37] && jogadorInfo.x > 0) {
        jogadorInfo.x -= jogadorInfo.veloc;
        jogadorInfo.framey = 1;
        jogadorInfo.andando = true;
    }
    // código para tecla da seta baixo = 40
    if (teclas[40] && jogadorInfo.y < canvas.height - jogadorInfo.altura){
        jogadorInfo.y += jogadorInfo.veloc;
        jogadorInfo.framey = 0;
        jogadorInfo.andando = true;
    }
    // código para tecla da seta direita = 39
    if (teclas[39] && jogadorInfo.x < canvas.width - jogadorInfo.largura){
        jogadorInfo.x += jogadorInfo.veloc;
        jogadorInfo.framey = 2;
        jogadorInfo.andando = true;
    }
};

function organizandoFrames () {
    if (jogadorInfo.framex < 3 && jogadorInfo.andando) jogadorInfo.framex++
    else jogadorInfo.framex = 0;
};

/*
// criando o loop para animações
function animacao() {
    canvasContext.clearRect(0,0, canvas.width, canvas.height);
    //.drawImage(o que queremos desenhar, coordenada inicial, coordenada final,largura, altura)
    canvasContext.drawImage(imgFundo, 0,0, canvas.width, canvas.height);
    desenharSprite(jogadorSprite, jogadorInfo.largura * jogadorInfo.framex, jogadorInfo.altura * jogadorInfo.framey, jogadorInfo.largura, jogadorInfo.altura, jogadorInfo.x, jogadorInfo.y, jogadorInfo.largura, jogadorInfo.altura);
    moverPlayer();
    organizandoFrames();
    requestAnimationFrame(animacao);
};
animacao();*/

let fps, fpsIntervalo, tempoInicial, agora, depois, decorrido;

function comeceAnimar(fps){
    fpsIntervalo= 1000/fps;
    depois = Date.now();
    tempoInicial = depois;
    animando();
};

function animando (){
    requestAnimationFrame(animando);
    agora = Date.now();
    decorrido = agora - depois;
    if (decorrido > fpsIntervalo){
        depois = agora - (decorrido % fpsIntervalo);
        canvasContext.clearRect(0,0, canvas.width, canvas.height);
        //.drawImage(o que queremos desenhar, coordenada inicial, coordenada final,largura, altura)
        canvasContext.drawImage(imgFundo, 0,0, canvas.width, canvas.height);
        desenharSprite(jogadorSprite, jogadorInfo.largura * jogadorInfo.framex, jogadorInfo.altura * jogadorInfo.framey, jogadorInfo.largura, jogadorInfo.altura, jogadorInfo.x, jogadorInfo.y, jogadorInfo.largura, jogadorInfo.altura);
        moverPlayer();
        organizandoFrames();
    }
};

comeceAnimar(10);






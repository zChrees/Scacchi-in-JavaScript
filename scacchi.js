document.addEventListener("DOMContentLoaded", function(){
    renderTable();

});

let board=[
    [{type:"rook", color:"black", arrocco:true},{type:"knight", color:"black"},{type:"bishop", color:"black"},{type:"queen", color:"black"},{type:"king", color:"black", arrocco:true},{type:"bishop", color:"black"},{type:"knight", color:"black"},{type:"rook", color:"black", arrocco:true}],
    [{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"}],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    [{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"}],
    [{type:"rook", color:"white", arrocco:true},{type:"knight", color:"white"},{type:"bishop", color:"white"},{type:"queen", color:"white"},{type:"king", color:"white", arrocco:true},{type:"bishop", color:"white"},{type:"knight", color:"white"},{type:"rook", color:"white", arrocco:true}]
];

let ultimaMossa={
    //mossa:0, 
    player:"", vecchiaRiga:0, vecchiaColonna:0, nuovaRiga:0, nuovaColonna:0, pezzoSpostato:"", pezzoCatturato:"", scacco:false, scaccoMatto:false, promozione:false, arrocco:false
};

let storicoMosse=[];

let currentPlayer="white";
let oldRow,oldCol,newRow,newCol, idTimer=false;
let selected=false;
const secondi=600;

document.getElementById("blackTimer").dataset.seconds=secondi;
document.getElementById("whiteTimer").dataset.seconds=secondi;


function fermailgioco(){
    console.log("gioco fermato");
    let bottoni=document.querySelectorAll("#table button");
    bottoni.forEach(bottone => {
        bottone.removeEventListener("click", mossa);
    });
}

document.getElementById("restart").addEventListener("click", restart);

document.getElementById("gameOverRestart").addEventListener("click", function(){
    let div=document.getElementById("gameOverScreen");
    div.classList.remove("pop");
    let divBottoni=document.querySelector(".buttonShow");
    divBottoni.classList="bottoni";
    let testo=document.getElementById("winnerText");
    testo.classList.remove("pop");
    restart();
});

function restart(){
    board=[
        [{type:"rook", color:"black", arrocco:true},{type:"knight", color:"black"},{type:"bishop", color:"black"},{type:"queen", color:"black"},{type:"king", color:"black", arrocco:true},{type:"bishop", color:"black"},{type:"knight", color:"black"},{type:"rook", color:"black", arrocco:true}],
        [{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"},{type:"pawn", color:"black"}],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        [{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"},{type:"pawn", color:"white"}],
        [{type:"rook", color:"white", arrocco:true},{type:"knight", color:"white"},{type:"bishop", color:"white"},{type:"queen", color:"white"},{type:"king", color:"white", arrocco:true},{type:"bishop", color:"white"},{type:"knight", color:"white"},{type:"rook", color:"white", arrocco:true}]
    ];

    ultimaMossa={
        player:"", vecchiaRiga:0, vecchiaColonna:0, nuovaRiga:0, nuovaColonna:0, pezzoSpostato:"", pezzoCatturato:"", scacco:false, scaccoMatto:false, promozione:false, arrocco:false
    };
    
    bloccaTempo(currentPlayer);
    currentPlayer="white";

    storicoMosse=[];

    let timer;
    timer=document.getElementById("blackTimer");
    timer.dataset.seconds=secondi;
    timer.textContent="10:00";
    timer.classList="timer";

    timer=document.getElementById("whiteTimer");
    timer.dataset.seconds=secondi;
    timer.textContent="10:00";
    timer.classList="timer";

    document.getElementById("gameOverScreen").classList.remove("show");

    document.getElementById("storicoMoves").innerHTML="";

    idTimer=false;

    selected=false;
    renderTable();
}
function renderTable(){
    let traverse=[8,7,6,5,4,3,2,1];
    let colonne=["a","b","c","d","e","f","g","h"];
    let table=document.getElementById("table");
    table.innerHTML="";
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            let casella=document.createElement("button");
            casella.dataset.row=i;
            casella.dataset.col=j;
            casella.dataset.pezzo="";
            casella.addEventListener("click", mossa);
            if((i+j)%2 === 0){
                casella.classList="spruce";
            }else{
                casella.classList="oak";
            }
            //primo span per le traverse
            if(j===0){
                let traversa=document.createElement("span");
                traversa.classList="traversa";
                if(i%2 === 0){
                    traversa.classList.add("oak-carattere")
                }else{
                    traversa.classList.add("spruce-carattere");
                }
                traversa.textContent=traverse[i];
                casella.appendChild(traversa); 
            }  
            //secondo span per il pezzo
            if(inserisciPezzo(board[i][j], i, j)){
                casella.appendChild(inserisciPezzo(board[i][j], i, j));
            }
            //terzo span per le colonne
            if(i===7){
                let colonna=document.createElement("span");
                colonna.classList="colonna";
                if(j%2 === 0){
                    colonna.classList.add("spruce-carattere")
                }else{
                    colonna.classList.add("oak-carattere");
                }
                colonna.textContent=colonne[j];
                casella.appendChild(colonna);
            }
            table.appendChild(casella);
        }
    }
    if(storicoMosse.length>0){
        evidenziaUltimaMossa(ultimaMossa);
    }
}

function inserisciPezzo(oggetto, row, col){
    if(oggetto === ""){
        return false;
    }
    let span=document.createElement("span");
    let colore=board[row][col].color;
    let pezzo=board[row][col].type;
    if(colore === "white"){
        span.classList.add("white", "piece");
        switch (pezzo) {
            case "rook":
                span.textContent="♜"; // pezzi bianchi ♖ ♘ ♗ ♕ ♔ ♙
                break;
            
            case "knight":
                span.textContent="♞";
                break;

            case "bishop":
                span.textContent="♝";
                break;

            case "queen":
                span.textContent="♛";
                break;

            case "king":
                span.textContent="♚";
                break;

            case "pawn":
                span.textContent="♟";
                break;
        
            default:
                return false;
        }
    }else{
        span.classList.add("black", "piece");
        switch (pezzo) {
            case "rook":
                span.textContent="♜"; // pezzi neri ♜ ♞ ♝ ♛ ♚ ♟
                break;
            
            case "knight":
                span.textContent="♞";
                break;

            case "bishop":
                span.textContent="♝";
                break;

            case "queen":
                span.textContent="♛";
                break;

            case "king":
                span.textContent="♚";
                break;

            case "pawn":
                span.textContent="♟";
                break;
        
            default:
                return false;
        }
    }

    return span;
}

function mossa(e){
    if(selected){
        arrivo(e);
    }else{
        selezione(e);
    }
}

function aggiornaUltimaMossa(pedoneCatt, arrocco, promozione){
    if(pedoneCatt !== false){
        ultimaMossa.pezzoCatturato=pedoneCatt;
    }else{
        ultimaMossa.pezzoCatturato=board[newRow][newCol];
    }
    ultimaMossa.player=currentPlayer;
    ultimaMossa.vecchiaRiga=Number(oldRow);
    ultimaMossa.vecchiaColonna=Number(oldCol);
    ultimaMossa.nuovaRiga=Number(newRow);
    ultimaMossa.nuovaColonna=Number(newCol);
    ultimaMossa.pezzoSpostato=board[oldRow][oldCol];
    ultimaMossa.arrocco=arrocco;
    ultimaMossa.promozione=promozione;
    if(ultimaMossa.pezzoSpostato.type === "rook" || ultimaMossa.pezzoSpostato.type === "king"){
        aggiornaStatoArrocco(oldRow, oldCol);
    }
    let avversario;
    if(currentPlayer==="white"){
        avversario="black";
    }else{
        avversario="white";
    }
    let pezzoNuovo=board[newRow][newCol];
    let pezzoVecchio=board[oldRow][oldCol];
    if(promozione!==false){
        board[newRow][newCol]=promozione;
    }else{
        board[newRow][newCol]=board[oldRow][oldCol];
    }
    board[oldRow][oldCol]="";
    let king=trovaKing(avversario);
    let kingRow=king[0];
    let kingCol=king[1];
    ultimaMossa.scacco=check(avversario, kingRow, kingCol);
    ultimaMossa.scaccoMatto=checkmate(avversario);
    board[newRow][newCol]=pezzoNuovo;
    board[oldRow][oldCol]=pezzoVecchio;
    addToStoricoMosse();
}

function addToStoricoMosse(){
    storicoMosse.push({...ultimaMossa});
    console.clear();
    for(let i=0; i<storicoMosse.length; i++){
        console.log(i+1, storicoMosse[i]);
    }
    //renderMosse();
}

function boardStamp(){
    for(let i=0; i<8; i++){
        console.log(board[i]);
    }
}

function selezione(e){
    if(idTimer === false){
        scorriTempo(currentPlayer);
    }
    renderTable();
    let casella=e.currentTarget;
    oldRow=Number(casella.dataset.row);
    oldCol=Number(casella.dataset.col);
    if(board[oldRow][oldCol]===""){
        selected=false;
        console.log("hai selezionato una casella vuota, seleziona un tuo pezzo");
        return;
    }else if(board[oldRow][oldCol].color !== currentPlayer){
        selected=false;
        console.log("hai selezionato un pezzo dell'avversario");
        return;
    }
    evidenziaPezzo(oldRow, oldCol);
    evidenziaMosseLegali(oldRow, oldCol);
    //console.log("pezzo selezionato: " + board[oldRow][oldCol].type);
    selected=true;
}

function evidenziaPezzo(oldR, oldC){
    let casella=document.querySelector(`button[data-row="${oldR}"][data-col="${oldC}"]`);
    casella.classList.remove(casella.classList);
    casella.classList="pezzoSelezionato";
}

function evidenziaMosseLegali(oldR, oldC){
    if(board[oldR][oldC] === ""){
        return;
    }
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(mossaValida(oldR, oldC, i, j)){
                if(mossaLegale(oldR, oldC, i, j)){
                    if(board[i][j] === ""){
                        let puntino=document.createElement("div");
                        puntino.classList="mossaLegale";
                        let casella=document.querySelector(`button[data-row="${i}"][data-col="${j}"]`);
                        casella.classList.add("mossalegale");
                        casella.appendChild(puntino);
                    }else{
                        let cattura=document.createElement("div");
                        cattura.classList="catturaPezzo";
                        let casella=document.querySelector(`button[data-row="${i}"][data-col="${j}"]`);
                        casella.classList.add("mossalegale");
                        casella.appendChild(cattura);
                    }
                }
            }
        }
    }
}

function evidenziaCheck(row, col){
    let casella=document.querySelector(`button[data-row="${row}"][data-col="${col}"]`);
    casella.classList.remove(casella.classList);
    casella.classList="check";
    casella.addEventListener("animationend", function(){
        renderTable();
    });
}

function evidenziaCheckMate(row, col){
    let casella=document.querySelector(`button[data-row="${row}"][data-col="${col}"]`);
    casella.classList.remove(casella.classList);
    casella.classList="checkMate";
}

function evidenziaUltimaMossa(oggetto){
    let oldR=Number(oggetto.vecchiaRiga);
    let oldC=Number(oggetto.vecchiaColonna);
    let newR=Number(oggetto.nuovaRiga);
    let newC=Number(oggetto.nuovaColonna);
    let casellaIniziale=document.querySelector(`button[data-row="${oldR}"][data-col="${oldC}"]`);
    let casellaFinale=document.querySelector(`button[data-row="${newR}"][data-col="${newC}"]`);
    casellaIniziale.classList.remove(casellaIniziale.classList);
    casellaIniziale.classList="casellaIniziale";
    casellaFinale.classList.remove(casellaFinale.classList);
    casellaFinale.classList="casellaFinale";
}

function arrivo(e){
    if(board[oldRow][oldCol] === ""){
        return;
    }
    let pedoneCatturato=false, Arrocco=false;
    let casella=e.currentTarget;
    newRow=Number(casella.dataset.row);
    newCol=Number(casella.dataset.col);
    let pezzo=board[oldRow][oldCol].type;
    let colorePezzo=board[oldRow][oldCol].color;
    //console.log(oldRow, oldCol, newRow, newCol);
    if(!mossaValida(oldRow, oldCol, newRow, newCol)){
        //console.log("questo pezzo non può spostarsi in questa direzione oppure è presente un ostacolo");
        if(board[oldRow][oldCol].color === currentPlayer){
            selezione(e);
        }
        return;
    }
    if(pezzo === "king"){
        if(Arrocco=arroccoValido(oldRow, oldCol, newRow, newCol)){
            console.log("eseguiamo l'arrocco");
            bloccaTempo(currentPlayer);
            aggiornaUltimaMossa(pedoneCatturato, Arrocco, false);
            arrocco(oldRow, oldCol, newRow, newCol);
            renderTable();
            renderMosse();
            changePlayer();
            scorriTempo(currentPlayer);
            if(checkmate(currentPlayer)){
                bloccaTempo(currentPlayer);
                fermailgioco();
                renderCheckmate();
                return;
            }
            let draw=stallo(currentPlayer);
            if(draw !== false){
                bloccaTempo(currentPlayer);
                fermailgioco();
                renderStallo(draw);
                return;
            }
            selected=false;
            return;
        }
    }
    if(!mossaLegale(oldRow, oldCol, newRow, newCol)){
        console.log("la mossa non è legale");
        let king=trovaKing(currentPlayer);
        let kingRow=king[0];
        let kingCol=king[1];
        if(check(currentPlayer, kingRow, kingCol)){
            console.log("sei sotto scacco");
            evidenziaCheck(kingRow, kingCol);
        }else{
            console.log("pezzo inchiodato");
        }
        return;
    }
    if(pezzo === "pawn" && ultimaMossa.pezzoSpostato.type === "pawn"){
        if(valore_assoluto(ultimaMossa.nuovaRiga, ultimaMossa.vecchiaRiga) == 2 && ultimaMossa.nuovaColonna === newCol && ultimaMossa.nuovaRiga === oldRow){
            pedoneCatturato=eliminaPedone(); //en passant
        }
    }
    if(pezzo === "pawn"){
        if(colorePezzo === "white"){
            if(newRow===0){
                Promozione(oldRow, oldCol, newRow, newCol);
                return;
            }
        }else{
            if(newRow===7){
                Promozione(oldRow, oldCol, newRow, newCol);
                return;
            }
        }
    }
    bloccaTempo(currentPlayer);
    aggiornaUltimaMossa(pedoneCatturato, Arrocco, false);
    board[newRow][newCol]=board[oldRow][oldCol];
    board[oldRow][oldCol]="";
    renderTable();
    renderMosse();
    changePlayer();
    scorriTempo(currentPlayer);
    if(checkmate(currentPlayer)){//checkmate(currentPlayer)
        console.log(currentPlayer +" ha perso, ha ricevuto scacco matto");
        bloccaTempo(currentPlayer);
        fermailgioco();
        renderCheckmate();
        return;
    }
    let draw=stallo(currentPlayer);
    if(draw !== false){//stallo(currentPlayer)
        bloccaTempo(currentPlayer);
        fermailgioco();
        renderStallo(draw);
        return;
    }
    selected=false;
}

function changePlayer(){
    if(currentPlayer === "white"){
        currentPlayer="black";
    }else{
        currentPlayer="white";
    }
}

function mossaValida(oldR, oldC, newR, newC){
    if(board[oldR][oldC] === ""){
        return false;
    }
    let pezzo=board[oldR][oldC].type;
    switch (pezzo) {
        case "rook":
                return rook(oldR, oldC, newR, newC);
        case "knight":
                return knight(oldR, oldC, newR, newC);
        case "bishop":
                return bishop(oldR, oldC, newR, newC);
        case "queen":
                return queen(oldR, oldC, newR, newC);   
        case "king":
                return king(oldR, oldC, newR, newC);
        case "pawn":
                return pawn(oldR, oldC, newR, newC)
        default:
            return false;
    }
}

function rook(oldR, oldC, newR, newC){
    let i,j;
    if(oldR===newR){//qui mi trovo sulla stessa riga
        if(newC<oldC){//verso sinistra
            j=oldC-1;
            while(j>=0 && j<8 && j>=newC){
                if(j === newC){
                    if(board[newR][newC]===""){
                        return true;
                    }else if(board[newR][newC].color !== board[oldR][oldC].color){
                        return true;
                    }
                }else if(board[newR][j] !== ""){
                    return false;
                }
                j--;
            }
        }else{//verso destra
            j=oldC+1;
            while(j>=0 && j<8 && j<=newC){
                if(j === newC){
                    if(board[newR][newC]===""){
                        return true;
                    }else if(board[newR][newC].color !== board[oldR][oldC].color){
                        return true;
                    }
                }else if(board[newR][j] !== ""){
                    return false;
                }
                j++;
            }
        }
    }else if(oldC=== newC){//cerco sulla colonna
        if(newR < oldR){//verso l'alto
            i=oldR-1;
            while(i>=0 && i<8 && i>=newR){
                if(i === newR){
                    if(board[newR][newC]===""){
                        return true;
                    }else if(board[newR][newC].color !== board[oldR][oldC].color){
                        return true;
                    }
                }else if(board[i][newC] !== ""){
                    return false;
                }
                i--;
            }
        }else{//verso il basso
            i=oldR+1;
            while(i>=0 && i<8 && i<=newR){
                if(i === newR){
                    if(board[newR][newC]===""){
                        return true;
                    }else if(board[newR][newC].color !== board[oldR][oldC].color){
                        return true;
                    }
                }else if(board[i][newC] !== ""){
                    return false;
                }
                i++;
            }
        }
    }
    return false;
}

function bishop(oldR, oldC, newR, newC){
    let i,j;
    if(newR<oldR && newC<oldC){//cerchiamo nella diagonale alto-sinistra
        i=oldR-1;
        j=oldC-1;
        while(i>=0 && i<8 && j>=0 && j<8){
            if(i === newR && j === newC){
                if(board[newR][newC]===""){
                    return true;
                }else if(board[newR][newC].color !== board[oldR][oldC].color){
                    return true;
                } 
            }else if(board[i][j]!==""){
                return false;
            }
            i--;
            j--;
        }
    }else if(newR<oldR && newC>oldC){//cerchiamo nella diagonale alto-destra
        i=oldR-1;
        j=oldC+1;
        while(i>=0 && i<8 && j>=0 && j<8){
            if(i === newR && j === newC){
                if(board[newR][newC]===""){
                    return true;
                }else if(board[newR][newC].color !== board[oldR][oldC].color){
                    return true;
                } 
            }else if(board[i][j]!==""){
                return false;
            }
            i--;
            j++;
        }
    }else if(newR>oldR && newC<oldC){//cerchiamo nella diagonale basso-sinistra
        i=oldR+1;
        j=oldC-1;
        while(i>=0 && i<8 && j>=0 && j<8){
            if(i === newR && j === newC){
                if(board[newR][newC]===""){
                    return true;
                }else if(board[newR][newC].color !== board[oldR][oldC].color){
                    return true;
                } 
            }else if(board[i][j]!==""){
                return false;
            }
            i++;
            j--;
        }
    }else if(newR>oldR && newC>oldC){//cerchiamo nella diagonale basso-destra
        i=oldR+1;
        j=oldC+1;
        while(i>=0 && i<8 && j>=0 && j<8){
            if(i === newR && j === newC){
                if(board[newR][newC]===""){
                    return true;
                }else if(board[newR][newC].color !== board[oldR][oldC].color){
                    return true;
                } 
            }else if(board[i][j]!==""){
                return false;
            }
            i++;
            j++;
        }
    }
    
    return false;
    
}

function queen(oldR, oldC, newR, newC){
    if(newR === oldR || newC === oldC){
        return rook(oldR, oldC, newR, newC);
    }else{
        return bishop(oldR, oldC, newR, newC);
    }
}

function king(oldR, oldC, newR, newC){
    if(newR === oldR){
        if(valore_assoluto(oldC, newC) === 2){
            if(arroccoValido(oldR, oldC, newR, newC)){
                return true;
            }
        }
    }
    for(let i=-1; i<2; i++){
        for(let j=-1; j<2; j++){
            if(newR === oldR+i && newC === oldC+j){
                if(board[newR][newC] === ""){
                    return true;
                }else if(board[newR][newC].color !== board[oldR][oldC].color){
                    return true;
                }
            }
        }
    }
    return false;
}

function knight(oldR, oldC, newR, newC){
    if(oldC === newC || oldR === newR){
        return false;
    }
    if(valore_assoluto(newR, oldR) + valore_assoluto(newC, oldC) === 3){
        if(board[oldR][oldC].color !== board[newR][newC].color){
            return true;
        }
    }
    return false;
}

function valore_assoluto(a,b){
    if(a-b >= 0){
        return a-b;
    }else{
        return b-a;
    }
}

function pawn(oldR, oldC, newR, newC){
    if(board[oldR][oldC] === ""){
        return false;
    }
    if(board[oldR][oldC].type !== "pawn"){
        return false;
    }
    let colore=board[oldR][oldC].color;
    if(colore === "white"){
        return whitePawn(oldR, oldC, newR, newC);
    }else{
        return blackPawn(oldR, oldC, newR, newC);
    }
}

function blackPawn(oldR, oldC, newR, newC){
    if(blackCattura(oldR, oldC, newR, newC)){
        return true;
    }
    if(newC !== oldC){
        return false;
    }
    if(oldR === 1){//prima mossa anche due caselle
        if(newR-oldR === 2 && board[2][oldC]==="" && board[3][oldC]===""){//due caselle
            return true;
        }else if(newR-oldR === 1 && board[2][oldC]===""){//una casella
            return true;
        }
    }else{
        if(newR-oldR === 1 && board[newR][newC]===""){
            return true;
        }
    }
}

function whitePawn(oldR, oldC, newR, newC){
    if(whiteCattura(oldR, oldC, newR, newC)){
        return true;
    }
    if(newC !== oldC){
        return false;
    }else if(oldR === 6){//prima mossa anche due caselle
        if(oldR-newR == 2 && board[5][oldC]==="" && board[4][oldC]===""){//due caselle
            return true;
        }else if(oldR-newR == 1 && board[5][oldC]===""){//una casella
            return true;
        }
    }else{
        if(oldR-newR === 1 && board[newR][newC]==""){
            return true;
        }
    }
}

function blackCattura(oldR, oldC, newR, newC){
    if(newR === oldR+1 && (newC === oldC-1 || newC === oldC+1)){
        if(board[newR][newC] !== ""){
            if(board[newR][newC].color !== board[oldR][oldC].color){
                return true;//cattura classica
            }
        }
        if(ultimaMossa.pezzoSpostato.color === "white" && ultimaMossa.pezzoSpostato.type === "pawn"){
            if(valore_assoluto(ultimaMossa.nuovaRiga, ultimaMossa.vecchiaRiga) == 2 && ultimaMossa.nuovaColonna === newC && ultimaMossa.nuovaRiga === oldR){
                return true; //en passant
            }
        }
    }
    return false;
}

function whiteCattura(oldR, oldC, newR, newC){
    if(newR === oldR-1 && (newC === oldC-1 || newC === oldC+1)){
        if(board[newR][newC] !== ""){
            if(board[newR][newC].color !== board[oldR][oldC].color){
                return true;//cattura classica
            }
        }
        if(ultimaMossa.pezzoSpostato.color === "black" && ultimaMossa.pezzoSpostato.type === "pawn"){
            if(valore_assoluto(ultimaMossa.nuovaRiga, ultimaMossa.vecchiaRiga) == 2 && ultimaMossa.nuovaColonna === newC && ultimaMossa.nuovaRiga === oldR){
                return true; //en passant
            }
        }
    }
    return false;
}

function eliminaPedone(){
    let pedoneCatturato=board[Number(ultimaMossa.nuovaRiga)][Number(ultimaMossa.nuovaColonna)];
    board[Number(ultimaMossa.nuovaRiga)][Number(ultimaMossa.nuovaColonna)]="";
    return pedoneCatturato;
}

function aggiornaStatoArrocco(row, col){
    console.log("mi trovo dentro la funzione aggiornaStatoArrocco");
    if(board[row][col].type !== "rook" && board[row][col].type !== "king"){
        console.log("stranamente sei in funzione aggiornastatoarrocco ma non hai selezionato ne re ne torre");
        return;
    }
    if(board[row][col].arrocco){
        console.log("stato dell'arrocco aggiornato");
        board[row][col].arrocco=false;
    }else{
        console.log("stato dell'arrocco già false");
    }
}

function arroccoValido(oldR, oldC, newR, newC){
    if(oldR !== newR){
        //console.log("riga vecchia diversa da riga nuova, dentro ArroccoValido");
        return false;
    }
    if(board[oldR][oldC].type !== "king"){
        //console.log("non hai selezionato il re");
        return false;
    }
    if(check(board[oldR][oldC].color, oldR, oldC)){
        //console.log("Non puoi arroccare mentre sei sotto scacco");
        return false;
    }
    if(!board[oldR][oldC].arrocco){
        //console.log("Hai già spostato il re, non puoi arroccare");
        return false;
    }
    if(!(valore_assoluto(oldC,newC) === 2)){
        return false;
    }
    let coloreRe=board[oldR][oldC].color;
    if(coloreRe === "white"){//arrocco white
        if(newC<oldC){//arrocco a sinistra
            if(board[7][0] !== ""){
                if(board[7][0].type === "rook" && board[7][0].color === "white"){
                    if(board[7][0].arrocco === true){
                        for(let i=newC-1; i<oldC; i++){
                            if(board[oldR][i] !== "" || (check(coloreRe, oldR, i) && i !== newC-1)){
                                //console.log("è presente un pezzo in mezzo oppure le caselle in mezzo sono sotto scacco");
                                return false;
                            }
                        }
                        return true;
                    }
                }
            }
        }else{//arrocco a destra
            if(board[7][7] !== ""){
                if(board[7][7].type === "rook" && board[7][7].color === "white"){
                    if(board[7][7].arrocco === true){
                        for(let i=oldC+1; i<=newC; i++){
                            if(board[oldR][i] !== "" || check(coloreRe, oldR, i)){
                                //console.log("è presente un pezzo in mezzo oppure le caselle in mezzo sono sotto scacco");
                                return false;
                            }
                        }
                        return true;
                    }
                }
            }
        }
    }else{//arrocco nero
        if(newC<oldC){//arrocco a sinistra
            if(board[0][0] !== ""){
                if(board[0][0].type === "rook" && board[0][0].color === "black"){
                    if(board[0][0].arrocco === true){
                        for(let i=newC-1; i<oldC; i++){
                            if(board[oldR][i] !== "" || (check(coloreRe, oldR, i) && i !== newC-1)){
                                //console.log("è presente un pezzo in mezzo oppure le caselle in mezzo sono sotto scacco");
                                return false;
                            }
                        }
                        return true;
                    }
                }
            }
        }else{//arrocco a destra
            if(board[0][7] !== ""){
                if(board[0][7].type === "rook" && board[0][7].color === "black"){
                    if(board[0][7].arrocco === true){
                        for(let i=oldC+1; i<=newC; i++){
                            if(board[oldR][i] !== "" || check(coloreRe, oldR, i)){
                                //console.log("è presente un pezzo in mezzo oppure le caselle in mezzo sono sotto scacco");
                                return false;
                            }
                        }
                        return true;
                    }
                }
            }
        }
    }
    //console.log("sono dentro la funzione arroccoValido ma return false");
    return false;
}

function arrocco(oldR, oldC, newR, newC){
    console.log("mi trovo dentro la funzione arrocco");
    let colore=board[oldR][oldC].color;
    //ultimaMossa.colore=colore;
    if(colore === "white"){
        if(newC<oldC){//arrocco bianco a sinistra
            board[7][2]={type:"king", color:"white", arrocco:false};
            board[7][3]={type:"rook", color:"white", arrocco:false};
            board[7][0]="";
            board[7][4]="";
        }else{//arrocco bianco a destra
            board[7][6]={type:"king", color:"white", arrocco:false};
            board[7][5]={type:"rook", color:"white", arrocco:false};
            board[7][7]="";
            board[7][4]="";
        }
    }else{
        if(newC<oldC){//arrocco nero a sinistra
            board[0][2]={type:"king", color:"black", arrocco:false};
            board[0][3]={type:"rook", color:"black", arrocco:false};
            board[0][0]="";
            board[0][4]="";
        }else{//arrocco nero a destra
            board[0][6]={type:"king", color:"black", arrocco:false};
            board[0][5]={type:"rook", color:"black", arrocco:false};
            board[0][7]="";
            board[0][4]="";
        }
    }
}

function check(colore, row, col){
    let coloreAvversario;
    if(colore === "white"){
        coloreAvversario="black";
    }else{
        coloreAvversario="white";
    }
    //cerchiamo sulla riga
    for(let j=col-1; j>=0; j--){//verso sinistra
        if(board[row][j]!==""){
                if(board[row][j].color === coloreAvversario){
                    if(board[row][j].type === "rook" || board[row][j].type === "queen"){
                        //console.log("scacco a SX");
                        return true;
                    }
                }
            break;
        }
    }
    
    for(let j=col+1; j<8; j++){//verso destra
        if(board[row][j]!==""){
                if(board[row][j].color === coloreAvversario){
                    if(board[row][j].type === "rook" || board[row][j].type === "queen"){
                        //console.log("scacco a DX");
                        return true;
                    }
                }
            break;
        }
    }
    //cerchiamo sulla colonna
    
    for(let i=row-1; i>=0; i--){//verso l'alto
        if(board[i][col]!==""){
            if(board[i][col].color === coloreAvversario){
                if(board[i][col].type === "rook" || board[i][col].type === "queen"){
                    //console.log("scacco in ALTO");
                    return true;
                }
            }
            break;
        }
    }

    for(let i=row+1; i<8; i++){//verso il basso
        if(board[i][col]!==""){
            if(board[i][col].color === coloreAvversario){
                if(board[i][col].type === "rook" || board[i][col].type === "queen"){
                    //console.log("scacco in BASSO ");
                    return true;
                }
            }
            break;
        }
    }
    //CONTROLLIAMO LE DIAGONALI
    //diagonale verso alto-sinistra
    let i=row-1;
    let j=col-1;
    while(i>=0 && j>=0 && i<8 && j<8){
        if(board[i][j]!==""){
                if(board[i][j].color === coloreAvversario){
                    if(board[i][j].type === "bishop" || board[i][j].type === "queen"){
                        //console.log("scacco diagonale alto-sinistra");
                        return true;
                    }
                }
                break;
            }
        i--;
        j--;
    }

    //diagonale in alto a destra
    i=row-1;
    j=col+1;
    while(i>=0 && j>=0 && i<8 && j<8){
        if(board[i][j]!==""){
                if(board[i][j].color === coloreAvversario){
                    if(board[i][j].type === "bishop" || board[i][j].type === "queen"){
                        //console.log("scacco diagonale alto-destra");
                        return true;
                    }
                }
                break;
            }
        i--;
        j++;
    }
    //diagonale in basso a sinistra
    i=row+1;
    j=col-1;
    while(i>=0 && j>=0 && i<8 && j<8){
        if(board[i][j]!==""){
                if(board[i][j].color === coloreAvversario){
                    if(board[i][j].type === "bishop" || board[i][j].type === "queen"){
                        //console.log("scacco diagonale basso-sinistra");
                        return true;
                    }
                }
                break;
            }
        i++;
        j--;
    }
    //diagonale in basso a destra
    i=row+1;
    j=col+1;
    while(i>=0 && j>=0 && i<8 && j<8){
        if(board[i][j]!==""){
                if(board[i][j].color === coloreAvversario){
                    if(board[i][j].type === "bishop" || board[i][j].type === "queen"){
                        //console.log("scacco diagonale basso-destra");
                        return true;
                    }
                }
                break;
            }
        i++;
        j++;
    }
    //cavallo
    let n=1;
    let contatore=0;
    for(let i=row-2; i<=row+2; i++){
        if(i>=0 && i<8){
            for(let j=col-n; j<=col+n; j++){
                if(j>=0 && j<8){
                    if(valore_assoluto(i,row) + valore_assoluto(j,col) === 3){
                        if(board[i][j] !== ""){
                            if(board[i][j].type === "knight" && board[i][j].color === coloreAvversario){
                                //console.log("scacco cavallo");
                                return true;
                            }
                        }
                    }
                }
            }
        }
        if(contatore<1){
            n++;
        }else if(contatore>2){
            n--;
        }
        contatore++;
    }
    //pedone
    if(colore==="white"){
        if(row>0 && col > 0){
            if(board[row-1][col-1] !== ""){
                if(board[row-1][col-1].color === "black" && board[row-1][col-1].type === "pawn"){
                    //console.log("scacco pedone nero");
                    return true
                }
            }
        }
        if(row > 0 && col<7){
            if(board[row-1][col+1] !== ""){
                if(board[row-1][col+1].color === "black" && board[row-1][col+1].type === "pawn"){
                    //console.log("scacco pedone nero");
                    return true;
                }
            }
        }
    }else{
        if(row<7 && col>0){
            if(board[row+1][col-1] !== ""){
                if(board[row+1][col-1].color === "white" && board[row+1][col-1].type === "pawn"){
                    //console.log("scacco pedone bianco ");
                    return true;
                }
            }
        }
        if(row<7 && col<7){
            if(board[row+1][col+1] !== ""){
                if((board[row+1][col+1].color === "white" && board[row+1][col+1].type === "pawn") && !(row===7 || col===7)){
                    //console.log("scacco pedone bianco");
                    return true;
                }
            }
        }
    }
    //king
    for(let i=row-1; i<=row+1; i++){
        if(i>=0 && i<8){
            for(let j=col-1; j<=col+1; j++){
                if(j>=0 && j<8){
                    if(board[i][j]!==""){
                        if(board[i][j].color === coloreAvversario){
                            if(board[i][j].type === "king"){
                                //console.log("c'è il Re che può mangiarti");
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }

    return false;
}

function mossaLegale(oldR, oldC, newR, newC){
    if(board[newR][newC]!==""){
        if(board[newR][newC].type === "king"){
            return false;
        }
    }
    let vecchioPezzo=board[oldR][oldC];
    let nuovoPezzo=board[newR][newC];
    let colore=board[oldR][oldC].color;
    let enPassant=false;
    let enPassantPiece;
    // prima simuliamo un en passant
    if(vecchioPezzo.type === "pawn" && nuovoPezzo === "" && (newC === oldC-1 || newC === oldC +1) && board[oldR][newC].type === "pawn"){ // possibile en passant
        enPassant=true;
        enPassantPiece=board[oldR][newC];
        board[oldR][newC]="";
    }
    // da qui non è più un en passant
    board[newR][newC]=vecchioPezzo;
    board[oldR][oldC]="";
    let king, kingRow, kingCol;
    if(!(king=trovaKing(colore))){
        board[oldR][oldC]=vecchioPezzo;
        board[newR][newC]=nuovoPezzo;
        if(enPassant){
            board[oldR][newC]=enPassantPiece;
        }
        return false;
    }
    kingRow=king[0];
    kingCol=king[1];
    if(!check(colore,kingRow, kingCol)){
        board[oldR][oldC]=vecchioPezzo;
        board[newR][newC]=nuovoPezzo;
        if(enPassant){
            board[oldR][newC]=enPassantPiece;
        }
        return true;
    }else{
        board[oldR][oldC]=vecchioPezzo;
        board[newR][newC]=nuovoPezzo;
        if(enPassant){
            board[oldR][newC]=enPassantPiece;
        }
        return false;
    }
}

function mosseLegali(colore){
    let contatore=0;
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(board[i][j] !== ""){
                if(board[i][j].color === colore){
                    for(let newi=0; newi<8; newi++){
                        for(let newj=0; newj<8; newj++){
                            if(mossaValida(i, j, newi, newj)){
                                if(mossaLegale(i,j,newi,newj)){
                                    contatore++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return contatore;
}

function checkmate(colore){
    let king=trovaKing(colore);
    let kingRow=king[0];
    let kingCol=king[1];
    if(check(colore, kingRow, kingCol)){
        if(mosseLegali(colore) === 0){
            evidenziaCheckMate(kingRow, kingCol);
            console.log(colore +" ha perso, ha ricevuto scacco matto");
            return true;
        }else{
            evidenziaCheck(kingRow, kingCol);
            console.log(colore + " sotto scacco");
        }
    }
    //console.log("Nessuno scacco");
    return false;
}

function stallo(colore){
    let king=trovaKing(colore);
    let kingRow=king[0];
    let kingCol=king[1];
    if(materialeInsufficiente()){
        return "DRAW BY INSUFFICIENT MATERIAL!";
    }
    if(cinquantaMosse()){
        return "DRAW BY 50-MOVE RULE!";
    }
    if(!check(colore, kingRow, kingCol) && mosseLegali(colore) === 0){
        console.log("Stallo, non ci sono mosse legali");
        return "DRAW BY STALEMATE!";
    }
    return false;
}

function materialeInsufficiente(){
    let contatore=0;
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(board[i][j] !== ""){
                contatore++;
                if(contatore>3){
                    return false;
                }
                if(board[i][j].type !== "bishop" && board[i][j].type !=="knight" && board[i][j].type !=="king"){
                    return false;
                }
            }
        }
    }
    console.log("Stallo, materiale insufficiente");
    return true;
}

function cinquantaMosse(){
    if(storicoMosse.length < 100){
        return false;
    }
    for(let i=storicoMosse.length-1; i >= storicoMosse.length - 100; i--){
        if(storicoMosse[i].pezzoCatturato !== "" || storicoMosse[i].pezzoSpostato.type === "pawn"){
            return false;
        }
    }
    console.log("Stallo, avete fatto 50 mosse senza catturare pezzi");
    return true;
}

function trovaKing(colore){
    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            if(board[i][j] !== ""){
                if(board[i][j].type === "king"){
                    if(board[i][j].color ===colore){
                        return [i,j];
                    }
                }
            }
        }
    }
    console.log("dentro la funzione trovaKing non ho trovato il re " +colore);
    return false;
}

function Promozione(oldR, oldC, newR, newC){
    //pezzi bianchi ♖ ♘ ♗ ♕
    //pezzi neri ♜ ♞ ♝ ♛
    if(oldR < 0 || oldR > 7 || oldC < 0 || oldC > 7){
        console.log("coordinate buggate");
        return;
    }
    if(board[oldR][oldC] === ""){
        return;
    }
    let colore=board[oldR][oldC].color;
    let schermataPezzi=document.getElementById("promozione");
    schermataPezzi.innerHTML="";
    let pezziBianchiBoard=[{type:"rook", color:"white", arrocco:true},{type:"knight", color:"white"},{type:"bishop", color:"white"},{type:"queen", color:"white"}];
    let pezziBianchi=["♜", "♞", "♝", "♛"];
    let pezziNeriBoard=[{type:"rook", color:"black", arrocco:false},{type:"knight", color:"black"},{type:"bishop", color:"black"},{type:"queen", color:"black"}];
    let pezziNeri=["♜", "♞", "♝", "♛"];
    if(colore==="black"){
        for(let i=0; i<4; i++){
            let button=document.createElement("button");
            button.dataset.type=pezziNeriBoard[i].type;
            button.dataset.color="black";
            button.dataset.coordinate=`${oldR}${oldC}${newR}${newC}`;
            button.textContent=pezziNeri[i];
            button.classList.add("btn-light","d-flex","align-items-center","justify-content-center", "promozione-btn", "piece");
            button.addEventListener("click", scambiaPezzo);
            schermataPezzi.appendChild(button);
        }
    }else{
        for(let i=0; i<4; i++){
            let button=document.createElement("button");
            button.dataset.type=pezziBianchiBoard[i].type;
            button.dataset.color="white";
            button.dataset.coordinate=`${oldR}${oldC}${newR}${newC}`;
            button.textContent=pezziBianchi[i];
            button.classList.add("btn-light","d-flex","align-items-center","justify-content-center", "promozione-btn", "piece", "white");
            button.addEventListener("click", scambiaPezzo);
            schermataPezzi.appendChild(button);
        }
    }
    fermailgioco();
    const modal = new bootstrap.Modal(
        document.getElementById("promozioneModal"),
        {
            backdrop: "static",
            keyboard: false
        }
    );

    modal.show();
}

function scambiaPezzo(e){
    let schermataPezzi=document.getElementById("promozione");
    let bottone=e.currentTarget;
    let pezzo=bottone.dataset.type;
    let colore=bottone.dataset.color;
    let pezzoBoard;
    if(pezzo === "rook"){
        pezzoBoard={type: pezzo, color: colore, arrocco:false};
    }else{
        pezzoBoard={type: pezzo, color: colore};
    }
    let coordinate=bottone.dataset.coordinate;
    let oldR=Number(coordinate[0]);
    let oldC=Number(coordinate[1]);
    let newR=Number(coordinate[2]);
    let newC=Number(coordinate[3]);
    //console.log(oldR, oldC,newR, newC, pezzoBoard);
    aggiornaUltimaMossa(false, false, pezzoBoard);
    board[newR][newC]=pezzoBoard;
    board[oldRow][oldCol]="";

    let modal = bootstrap.Modal.getInstance(
        document.getElementById("promozioneModal")
    );
    modal.hide();
    bloccaTempo(currentPlayer);
    renderTable();
    renderMosse();
    changePlayer();
    scorriTempo(currentPlayer);
    if(checkmate(currentPlayer)){
        bloccaTempo(currentPlayer);
        renderCheckmate();
        fermailgioco();
        return;
    }
    let draw=stallo(currentPlayer);
    if(draw !== false){
        bloccaTempo(currentPlayer);
        fermailgioco();
        renderStallo(draw);
        return;
    }
    schermataPezzi.innerHTML="";
    selected=false;
}

function renderMosse(){
    let traverse=[8,7,6,5,4,3,2,1];
    let colonne=["a","b","c","d","e","f","g","h"];

    let lista=document.getElementById("storicoMoves");
    lista.innerHTML="";
    let numeroMossa=1;
    for(let i=0; i<storicoMosse.length; i++){
        let colore=storicoMosse[i].pezzoSpostato.color;
        let oldR=Number(storicoMosse[i].vecchiaRiga);
        let oldC=Number(storicoMosse[i].vecchiaColonna);
        let newR=Number(storicoMosse[i].nuovaRiga);
        let newC=Number(storicoMosse[i].nuovaColonna);
        let pezzoSpostato=storicoMosse[i].pezzoSpostato.type;
        let scacco=storicoMosse[i].scacco;
        let scaccoMatto=storicoMosse[i].scaccoMatto;
        //console.log(scacco, scaccoMatto);
        let promozione=storicoMosse[i].promozione;
        let arrocco=storicoMosse[i].arrocco;
        pezzoSpostato=tornaCarattere(pezzoSpostato);
        let cattura;
        if(storicoMosse[i].pezzoCatturato !== ""){
            cattura="x";
        }else{
            cattura="";
        }
        if(scaccoMatto){
            scaccoMatto="#";
            scacco="";
        }else{
            if(scacco){
                scacco="+";
            }else{
                scacco="";
            }
            scaccoMatto="";
        }
        let riga;
        if(colore === "white"){
            riga=document.createElement("div");
            riga.classList.add("mossa");
            riga.textContent=`${numeroMossa}: `;
            riga.id=numeroMossa;
        }else{
            riga=document.getElementById(`${numeroMossa}`);
            riga.textContent+=" ";
        }
        if(arrocco){
            if(newC>oldC){//arrocco corto
                riga.textContent+="0-0"
            }else{//arrocco lungo
                riga.textContent+="0-0-0"
            }
        }else if(promozione !== false){
            let pezzoNuovo=tornaCarattere(promozione.type);
            console.log(pezzoNuovo);
            riga.textContent+=`${colonne[newC]}${traverse[newR]}=${pezzoNuovo}${scacco}${scaccoMatto}`;
        }else if(pezzoSpostato==="" && cattura==="x"){
            riga.textContent+=`${colonne[oldC]}${cattura}${colonne[newC]}${traverse[newR]}${scacco}${scaccoMatto}`; //DA AGGIUNGERE RISULTATO ${1-0, 0-1, 1/2-1/2}
        }else{
            riga.textContent+=`${pezzoSpostato}${cattura}${colonne[newC]}${traverse[newR]}${scacco}${scaccoMatto}`; //DA AGGIUNGERE RISULTATO ${1-0, 0-1, 1/2-1/2}
        }  
        if(colore === "black"){
            numeroMossa++;
        }
        lista.appendChild(riga);
    }
    lista.parentElement.scrollTop=lista.parentElement.scrollHeight;
}

function tornaCarattere(pezzo){
    if(pezzo==="pawn"){
        return "";
    }
    if(pezzo==="king"){
        return "K";
    }
    if(pezzo==="bishop"){
        return "B";
    }
    if(pezzo==="knight"){
        return "N";
    }
    if(pezzo==="queen"){
        return "Q";
    }
    if(pezzo==="rook"){
        return "R";
    }
    return "";
}

function scorriTempo(player){
    let timer=document.getElementById(`${player}Timer`);
    let tempoRimanente=Number(timer.dataset.seconds);
    if(tempoRimanente<=30){
        timer.classList.add("lowTime");
    }else{
        timer.classList.add("activeTimer");
    }
    idTimer=setInterval(() => {
        tempoRimanente--;
        timer.dataset.seconds=tempoRimanente;
        if(tempoRimanente<=30){
            timer.classList.remove("activeTimer");
            timer.classList.add("lowTime");
        }
        renderTempo(timer, tempoRimanente);
        if(tempoRimanente===0){
            renderTable();
            fermailgioco();
            bloccaTempo(currentPlayer);
            timer.classList.add("tempoFinito");
            renderWinnerForTime();
        }
    }, 1000);

}

function renderTempo(timer, tempo){
    let minuti=Math.floor(tempo/60);
    let secondi=tempo%60;
    if(secondi>9){
        timer.innerHTML=`${minuti}:${secondi}`;
    }else{
        timer.innerHTML=`${minuti}:0${secondi}`;
    }
}

function bloccaTempo(colore){
    clearInterval(idTimer);
    let timer=document.getElementById(`${colore}Timer`);
    timer.classList.remove("activeTimer");
    timer.classList.remove("lowTime");
}

function renderWinnerForTime(){
    let testo=document.getElementById("winnerText");
    let div=document.getElementById("gameOverScreen");
    div.classList.add("show","pop");
    testo.textContent=`OUT OF TIME!`;
}

function renderStallo(text){
    let testo=document.getElementById("winnerText");
    let div=document.getElementById("gameOverScreen");
    div.classList.add("show", "pop");
    testo.textContent=text;
}

function renderCheckmate(){
    let testo=document.getElementById("winnerText");
    let div=document.getElementById("gameOverScreen");
    div.classList.add("show","pop");
    testo.textContent=`CHECKMATE!`;
}


document.getElementById("gameOverScreen").addEventListener("animationend",function(){
    let vincitore="";
    let testo=document.getElementById("winnerText");
    let divBottoni=document.querySelector(".bottoni");
    divBottoni.classList.add("buttonShow","pop");
    switch (testo.textContent.trim()) {
        case "CHECKMATE!":
            testo.classList.add("pop");
            changePlayer();
            vincitore=currentPlayer.toUpperCase();
            testo.textContent=`${vincitore} WON!`;
            break;

        case "OUT OF TIME!":
            testo.classList.add("pop");
            changePlayer();
            vincitore=currentPlayer.toUpperCase();
            testo.textContent=`${vincitore} WON!`;
            break;

        default:
            break;
    }
});

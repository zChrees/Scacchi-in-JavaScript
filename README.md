# Scacchi in JavaScript

Una partita a scacchi per due giocatori sullo stesso computer, scritta in HTML, CSS e JavaScript, senza framework.

**[▶ Gioca subito](https://zchrees.github.io/Scacchi-in-JavaScript/scacchi.html)**

## Come provarlo

- **Online**: dal link qui sopra.
- **In locale**: scarica il repository e apri `scacchi.html` nel browser. Non c'è niente da installare.

## Regole implementate

- Movimento di tutti i pezzi, con il controllo che una mossa non lasci il proprio re sotto scacco
- Arrocco corto e lungo, solo se il re non è sotto scacco, re e torre non si sono mai mossi
  e il re non passa su case attaccate
- En passant
- Promozione del pedone, con scelta tra donna, torre, alfiere e cavallo
- Scacco, scacco matto e stallo

## Altre funzionalità

- Timer di 10 minuti per giocatore, che parte alla prima mossa: sotto i 30 secondi viene evidenziato
  e allo scadere la partita finisce
- Evidenziazione delle mosse possibili del pezzo selezionato, dell'ultima mossa e del re sotto scacco
- Storico delle mosse in notazione algebrica (es. `Nf3`, `exd5`, `Qxf7#`, `0-0`)
- Pulsante "New Game" per ricominciare

## Tecnologie

- HTML, CSS e JavaScript, senza framework e senza build
- Bootstrap 5.3 (da CDN) per una parte dello stile e per la finestra di promozione
- I pezzi sono caratteri Unicode (♔ ♕ ♖ ♗ ♘ ♙)

## Struttura del codice

- `scacchi.html`: la pagina (scacchiera, timer, storico delle mosse)
- `scacchi.js`: tutta la logica di gioco. La scacchiera è una matrice 8×8 di oggetti `{type, color}`
  e ogni pezzo ha una funzione che controlla se una mossa è valida (`rook`, `bishop`, `queen`,
  `king`, `knight`, `pawn`)
- `scacchi.css`: lo stile
- `sfondo-scacchi.jpg`: l'immagine di sfondo

## Il progetto

È nato per il corso di Web Front End, come parte di un sito di giochi sviluppato in gruppo.
La parte degli scacchi l'ho scritta io; in questo repository c'è solo quella.

Foto di sfondo: [Ian Panelo](https://www.pexels.com/@ian-panelo/) su Pexels.

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

ctx.textAlign = "center";
ctx.lineWidth = 3;

let w = canvas.width;
let l = canvas.width / 3;

let games;
let turn = 1;
let finished = false;

class Game {
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;

        this.l = w / 3;
        this.p = 10;

        this.playing = true;
        this.finished = false;

        this.grid = [
            [-1, -1, -1],
            [-1, -1, -1],
            [-1, -1, -1]
        ];


        this.winner = -1;

    }

    draw() {
        ctx.translate(this.x, this.y);

        ctx.lineWidth = 3;


        ctx.clearRect(0, 0, this.w, this.w);

        if (!this.finished && this.playing) {
            ctx.fillStyle = "rgba(10,100,200,0.2)";
            ctx.fillRect(0, 0, this.w, this.w);
        }


        ctx.strokeStyle = "rgb(200,200,200)";
        ctx.fillStyle = "rgb(200,200,200)";

        //draw grid
        ctx.beginPath();
        ctx.moveTo(this.l, 0);
        ctx.lineTo(this.l, this.w);
        ctx.moveTo(2 * this.l, 0);
        ctx.lineTo(2 * this.l, this.w);
        ctx.moveTo(0, this.l);
        ctx.lineTo(this.w, this.l);
        ctx.moveTo(0, 2 * this.l);
        ctx.lineTo(this.w, 2 * this.l);
        ctx.stroke();

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let x = j * this.l;
                let y = i * this.l;


                if (this.grid[i][j] == 0) {
                    ctx.beginPath();
                    ctx.arc(x + this.l / 2, y + this.l / 2, this.l / 2 - this.p, 0, 2 * Math.PI);
                    ctx.stroke();
                } else if (this.grid[i][j] == 1) {
                    ctx.beginPath();
                    ctx.moveTo(x + this.p, y + this.p);
                    ctx.lineTo(x + this.l - this.p, y + this.l - this.p);
                    ctx.moveTo(x + this.l - this.p, y + this.p);
                    ctx.lineTo(x + this.p, y + this.l - this.p);
                    ctx.stroke();
                }
            }
        }

        this.check();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    update(i, j) {

        if (!this.finished && this.playing) {
            if (this.grid[i][j] == -1) {
                this.grid[i][j] = turn;
                turn = Math.abs(turn - 1);

                this.draw();

                for (let I = 0; I < 3; I++) {
                    for (let J = 0; J < 3; J++) {
                        if (!games[i][j].finished) {
                            games[I][J].playing = false;
                            games[i][j].playing = true;
                        } else {
                            games[I][J].playing = true;
                        }
                        if (finished) {
                            games[I][J].playing = false;
                            games[I][J].finished = true;
                        }
                    }
                }

            } else {
                console.log("already played");
            }
        }

        this.draw();

    }

    stringToMoves(str) {
        let moves = str.match(/(..?)/g);
        for (let k = 0; k < moves.length; k++) {
            let i = moves[k][0];
            let j = moves[k][1];

            this.update(i, j);
        }
    }

    check() {

        //horizontal
        for (let i = 0; i < 3; i++) {
            if (this.grid[i].every((val, j, arr) => val === arr[0]) && this.grid[i][0] != -1) {
                this.winner = this.grid[i][0];

                ctx.strokeStyle = "red";
                ctx.beginPath();
                ctx.moveTo(0, i * this.l + this.l / 2);
                ctx.lineTo(this.w, i * this.l + this.l / 2);
                ctx.stroke();
            }

        }

        //vertical
        for (let j = 0; j < 3; j++) {
            if (this.grid[0][j] == this.grid[1][j] && this.grid[0][j] == this.grid[2][j] && this.grid[0][j] != -1) {
                this.winner = this.grid[0][j];

                ctx.strokeStyle = "red";
                ctx.beginPath();
                ctx.moveTo(j * this.l + this.l / 2, 0);
                ctx.lineTo(j * this.l + this.l / 2, this.w);
                ctx.stroke();
            }
        }

        //top-left to bottom-right
        if (this.grid[0][0] == this.grid[1][1] && this.grid[0][0] == this.grid[2][2] && this.grid[0][0] != -1) {
            this.winner = this.grid[0][0];
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(this.p, this.p);
            ctx.lineTo(this.w - this.p, this.w - this.p);
            ctx.stroke();
        }

        //top-right to bottom-left
        if (this.grid[2][0] == this.grid[1][1] && this.grid[2][0] == this.grid[0][2] && this.grid[2][0] != -1) {
            this.winner = this.grid[2][0];
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(this.w - this.p, this.p);
            ctx.lineTo(this.p, this.w - this.p);
            ctx.stroke();
        }


        if (!this.grid[0].some(val => val == -1) && !this.grid[1].some(val => val == -1) && !this.grid[2].some(val => val == -1) && this.winner == -1) {
            this.winner = 2;
        }

        if (this.winner != -1) {
            if (this.winner == 2) {
                ctx.fillStyle = "rgba(0,0,0,0.8)";
                ctx.strokeStyle = "rgb(200,200,200)";
                ctx.fillRect(0, 0, this.w, this.w);
                ctx.fillStyle = "rgb(200,200,200)";
                ctx.textAlign = "center";
                ctx.font = "40px monospace";
                ctx.fillText("TIE", this.w / 2, this.w / 2 + 15);

            } else {
                ctx.fillStyle = "rgba(0,0,0,0.8)";
                ctx.strokeStyle = "rgb(200,200,200)";
                ctx.fillRect(0, 0, this.w, this.w);


                let W;
                if (this.winner == 0) {
                    W = "O";

                    ctx.fillStyle = "transparent";
                    ctx.beginPath();
                    ctx.arc(this.w / 2, this.w / 2, this.w / 2 - this.p, 0, 2 * Math.PI);
                    ctx.stroke();
                } else if (this.winner == 1) {
                    W = "X";

                    ctx.beginPath();
                    ctx.moveTo(this.p, this.p);
                    ctx.lineTo(this.w - this.p, this.w - this.p);
                    ctx.moveTo(this.w - this.p, this.p);
                    ctx.lineTo(this.p, this.w - this.p);
                    ctx.stroke();
                }


            }

            this.finished = true;
        }
    }

    restart() {
        this.playing = true;
        this.finished = false;
        turn = 1;
        this.grid = [
            [-1, -1, -1],
            [-1, -1, -1],
            [-1, -1, -1]
        ];

        this.draw();
    }

    click(x, y) {
        let i;
        let j;


        if (x > 0 && x < this.l) {
            j = 0;
        } else if (x > this.l && x < 2 * this.l) {
            j = 1;
        } else if (x > 2 * this.l && x < this.w) {
            j = 2;
        }
        if (y > 0 && y < this.l) {
            i = 0;
        } else if (y > this.l && y < 2 * this.l) {
            i = 1;
        } else if (y > 2 * this.l && y < this.w) {
            i = 2;
        }


        this.update(i, j);
    }
}

let p = 20; //0.1 * l;
games = [
    [new Game(p / 2, p / 2, l - p), new Game(l + p / 2, p / 2, l - p), new Game(2 * l + p / 2, p / 2, l - p)],
    [new Game(p / 2, l + p / 2, l - p), new Game(l + p / 2, l + p / 2, l - p), new Game(2 * l + p / 2, l + p / 2, l - p)],
    [new Game(p / 2, 2 * l + p / 2, l - p), new Game(l + p / 2, 2 * l + p / 2, l - p), new Game(2 * l + p / 2, 2 * l + p / 2, l - p)]
];

function draw() {
    ctx.clearRect(0, 0, w, w);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            games[i][j].draw()
        }
    } for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            games[i][j].draw()
        }
    }


    ctx.lineWidth = 5;
    ctx.beginPath()
    ctx.moveTo(l, 0);
    ctx.lineTo(l, w);
    ctx.moveTo(2 * l, 0);
    ctx.lineTo(2 * l, w);
    ctx.moveTo(0, l);
    ctx.lineTo(w, l);
    ctx.moveTo(0, 2 * l);
    ctx.lineTo(w, 2 * l);
    ctx.stroke();

    check();
}
draw();

document.addEventListener("click", e => {
    if (!finished) {
        let x = e.clientX;
        let y = e.clientY;


        let i;
        let j;


        if (x > 0 && x < l) {
            j = 0;
        } else if (x > l && x < 2 * l) {
            j = 1;
        } else if (x > 2 * l && x < w) {
            j = 2;
        }
        if (y > 0 && y < l) {
            i = 0;
        } else if (y > l && y < 2 * l) {
            i = 1;
        } else if (y > 2 * l && y < w) {
            i = 2;
        }


        let X = x - j * l;
        let Y = y - i * l;

        if (X > p && X < l - p && Y > p && Y < l - p) {

            games[i][j].click(X, Y);
        }

        draw();
    }

});


function check() {
    let winner = -1;

    // //horizontal
    for (let i = 0; i < 3; i++) {
        if (games[i].every((val, j, arr) => val.winner === arr[0].winner) && games[i][0].winner != -1) {
            winner = games[i][0].winner;

            ctx.strokeStyle = "red";
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(0, i * l + l / 2);
            ctx.lineTo(w, i * l + l / 2);
            ctx.stroke();

        }
    }

    // //vertical
    for (let j = 0; j < 3; j++) {
        if (games[0][j].winner == games[1][j].winner && games[0][j].winner == games[2][j].winner && games[0][j].winner != -1) {
            winner = games[0][j].winner;


            ctx.strokeStyle = "red";
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(j * l + l / 2, 0);
            ctx.lineTo(j * l + l / 2, w);
            ctx.stroke();
        }
    }

    // //top-left to bottom-right
    if (games[0][0].winner == games[1][1].winner && games[0][0].winner == games[2][2].winner && games[0][0].winner != -1) {
        winner = games[0][0].winner;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w, w);
        ctx.stroke();
    }

    // //top-right to bottom-left
    if (games[2][0].winner == games[1][1].winner && games[2][0].winner == games[0][2].winner && games[2][0].winner != -1) {
        winner = games[2][0].winner;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(0, w);
        ctx.lineTo(w, 0);
        ctx.stroke();
    }


    if (!games[0].some(val => val.winner == -1) && !games[1].some(val => val.winner == -1) && !games[2].some(val => val.winner == -1) && winner == -1) {
        winner = 2;
    }

    if (winner != -1) {
        if (winner == 2) {

            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.strokeStyle = "rgb(200,200,200)";
            ctx.fillRect(0, 0, w, w);
            ctx.fillStyle = "rgb(200,200,200)";
            ctx.textAlign = "center";
            ctx.font = "80px monospace";
            ctx.fillText("TIE", w / 2, w / 2 + 15);


            console.log("%cTIE", "font-size:40px;");

        } else {

            let W;
            if (winner == 0) {
                W = "O";

            } else if (winner == 1) {
                W = "X";
            }

            console.log("%c" + W + " WON!!!!!!!", "font-size:40px;");

        }

        finished = true;
    }
}


document.addEventListener("keypress", e => {
    if (e.key == ' ') {
        games = [
            [new Game(p / 2, p / 2, l - p), new Game(l + p / 2, p / 2, l - p), new Game(2 * l + p / 2, p / 2, l - p)],
            [new Game(p / 2, l + p / 2, l - p), new Game(l + p / 2, l + p / 2, l - p), new Game(2 * l + p / 2, l + p / 2, l - p)],
            [new Game(p / 2, 2 * l + p / 2, l - p), new Game(l + p / 2, 2 * l + p / 2, l - p), new Game(2 * l + p / 2, 2 * l + p / 2, l - p)]
        ];
        turn = 1;
        finished = false;
        draw();
    }
})
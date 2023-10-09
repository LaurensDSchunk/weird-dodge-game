const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const maxSpeed = 8;
let player = {
    position:{
        x:window.innerWidth/2-5,
        y:window.innerHeight/2-5
    },
    velocity:{
        x:0,
        y:0
    }
}
let activeKeys = [];
let enemies = [];
let enemyCooldown = 0;
let cooldownLength = 20;
let rayCoolDown = 100;
let rayCoolDownLength = 100;
let playing = false;
let ray = [];
let score = 0;

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

document.addEventListener("keydown", function(key) {
    activeKeys[key.keyCode] = true;
    if (activeKeys[13] == true) {
        playing = true;
        enemies = [];
        ray = [];
        enemyCooldown = 0;
        cooldownLength = 20;
        rayCoolDown = 100;
        rayCoolDownLength = 100;
        score = 0;
        player = {
            position:{
                x:window.innerWidth/2-5,
                y:window.innerHeight/2-5
            },
            velocity:{
                x:0,
                y:0
            }
        }
    }
});
document.addEventListener("keyup", function(key) {
    activeKeys[key.keyCode] = false;
});
let loop = setInterval(tick, 20);
 

function tick() {
    if (playing) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //Rays
        if (enemyCooldown != 0) {
            enemyCooldown--;
        }
        if (enemyCooldown == 0) {
            enemyCooldown = cooldownLength;
            if (cooldownLength != 2) {
                cooldownLength--;
            }
            switch (Math.floor(Math.random()*4)) {
                case 0: //top
                    enemies.push([Math.floor(Math.random()*canvas.width),0,0,Math.floor(Math.random()*2)+1]);
                    break;
                case 1: //right
                    enemies.push([canvas.width,Math.floor(Math.random()*canvas.height),(Math.floor(Math.random()*2)+1)*-1,0]);
                    break;
                case 2: //bottom
                    enemies.push([Math.floor(Math.random()*canvas.width),canvas.height,0,Math.floor(Math.random()*2)*-1]);
                    break;
                case 3: //left
                    enemies.push([0,Math.floor(Math.random()*(canvas.height-10)),Math.floor(Math.random()*2)+1,0]);
                    break;
            }
        }
        if (rayCoolDown != 0) {
            rayCoolDown--;
        }
        if (rayCoolDown == 0) {
            rayCoolDown = rayCoolDownLength;
            ray = [player.position.x,player.position.y,0];
        }
        if (ray != 0) {
            ctx.fillStyle = "rgba(255,0,0,"+ray[2]+")";
            if (ray[2] >= 1) {
                ctx.fillStyle = "white";
                if ((player.position.x < ray[0]+10 && player.position.x+10 > ray[0]) || (player.position.y < ray[1]+10 && player.position.y+10 > ray[1])) {
                    gameOver();
                }
                score++;
                ray[2] = 0;
            }
            ctx.fillRect(ray[0],0,10,canvas.height);
            ctx.fillRect(0,ray[1],canvas.width,10);
            ray[2] += 0.011;
        }
        let currentIndex = 0;
        for (let enemy of enemies) {
            ctx.fillStyle = "red";
            ctx.fillRect(enemy[0],enemy[1],10,10);
            enemy[0]+=enemy[2];
            enemy[1]+=enemy[3];
            if (enemy[0] < -10 || enemy[0] > canvas.width + 10) {
                enemies.splice(currentIndex,1);
                currentIndex--;
            }else if (enemy[1] < -10 || enemy[1] > canvas.height + 10) {
                enemies.splice(currentIndex,1);
                currentIndex--;
            }
            if (player.position.x+10 > enemy[0] && player.position.x < enemy[0]+10 && player.position.y+10 > enemy[1] && player.position.y < enemy[1]+10) {
                gameOver();
            }
            currentIndex++;
        }

        //slow down
        if (player.velocity.y > 0) {
            player.velocity.y -= .10;
        }
        if (player.velocity.y < 0) {
            player.velocity.y += .10;
        }
        if (player.velocity.x > 0) {
            player.velocity.x -= .10;
        }
        if (player.velocity.x < 0) {
            player.velocity.x += .10;
        }
        //wall bounce
        if (player.position.y < 0) {
            player.position.y = 0;
            player.velocity.y *= -.5;
        }
        if (player.position.y+10 > canvas.height) {
            player.position.y = canvas.height-10;
            player.velocity.y *= -.5;
        }
        if (player.position.x < 0) {
            player.position.x = 0;
            player.velocity.x *= -.5;
        }
        if (player.position.x+10 > canvas.width) {
            player.position.x = canvas.width-10;
            player.velocity.x *= -.5;
        }
        //speed up
        if (activeKeys[87] || activeKeys[38]) {
            if (player.velocity.y > -maxSpeed) {
                player.velocity.y -= .5;
            }
        }
        if (activeKeys[83] || activeKeys[40]) {
            if (player.velocity.y < maxSpeed) {
                player.velocity.y += .5;
            }
        }
        if (activeKeys[65] || activeKeys[37]) {
            if (player.velocity.x > -maxSpeed) {
                player.velocity.x -= .5;
            }
        }
        if (activeKeys[68] || activeKeys[39]) {
            if (player.velocity.x < maxSpeed) {
                player.velocity.x += .5;
            }
        }
        player.position.x += player.velocity.x;
        player.position.y += player.velocity.y;
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(player.position.x, player.position.y, 10,10);
    }else if (playing == false) {
        ctx.fillStyle = "orange";
        ctx.font = '48px mono';
        ctx.fillText('Weird Dodge Game', 10, 50);
        ctx.font = "28 mono";
        ctx.fillText('Press enter to play.', 10, 100);
        ctx.font = "20 mono";
        ctx.fillText('Score: '+score,10,150)
    }
}

function gameOver() {
    playing = false;
}
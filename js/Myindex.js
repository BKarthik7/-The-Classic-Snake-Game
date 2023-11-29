function initial(){
    var x = document.getElementById("board");
    x.innerHTML="";
    for(i=1;i<=20;++i){
        wall = document.createElement('div');
        wall.classList.add('wall');
        wall.style.gridRowStart = 1;
        wall.style.gridColumnStart = i;
        x.appendChild(wall);
        wall = document.createElement('div');
        wall.classList.add('wall');
        wall.style.gridRowStart = 20;
        wall.style.gridColumnStart = i;
        x.appendChild(wall);
        wall = document.createElement('div');
        wall.classList.add('wall');
        wall.style.gridRowStart = i;
        wall.style.gridColumnStart = 1;
        x.appendChild(wall);
        wall = document.createElement('div');
        wall.classList.add('wall');
        wall.style.gridRowStart = i;
        wall.style.gridColumnStart = 20;
        x.appendChild(wall);
    }
    snakeElement = document.createElement('div');
    snakeElement.style.gridColumnStart = 2;
    snakeElement.style.gridRowStart = 2;
    snakeElement.classList.add('tail_r');
    x.appendChild(snakeElement);

    snakeElement = document.createElement('div');
    snakeElement.style.gridColumnStart = 3;
    snakeElement.style.gridRowStart = 2;
    snakeElement.classList.add('body_h');
    x.appendChild(snakeElement);

    snakeElement = document.createElement('div');
    snakeElement.style.gridColumnStart = 4;
    snakeElement.style.gridRowStart = 2;
    snakeElement.classList.add('head_r');
    x.appendChild(snakeElement);
}

document.getElementById("button").addEventListener("click",function(){
    let x = document.getElementById("button").innerHTML;
    if(x === "START")
        game();
    else{
        gameStopped = true;
    }
});

function change(){
    var x = document.getElementById("button");
    if(x.innerHTML === "START"){
        x.innerHTML = "STOP";
        x.setAttribute("class","stop");
    }
    else{
        x.innerHTML = "START";
        x.setAttribute("class","start");
    }
}

function lock (orientation) {
    let de = document.documentElement;
    if (de.requestFullscreen) { de.requestFullscreen(); }
    else if (de.mozRequestFullScreen) { de.mozRequestFullScreen(); }
    else if (de.webkitRequestFullscreen) { de.webkitRequestFullscreen(); }
    else if (de.msRequestFullscreen) { de.msRequestFullscreen(); }

    screen.orientation.lock(orientation);
}

function forMobile(){
    lock("portrait");
    let isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? true
        : false;

    if(isMobileDevice){
        controls.classList.add("controls");
        controls.innerHTML='<div class="blocks"></div><div class="blocks"><button id="ArrowUp">↑</button></div><div class="blocks"></div><div class="blocks"><button id="ArrowLeft">←</button></div><div class="blocks"><button id="ArrowDown">↓</button></div><div class="blocks"><button id="ArrowRight">→</button></div>';

        board.style.width="90vw";
        board.style.height="90vw";

        delay=10000;
    }
    else{
        controls.classList.remove("controls");
        controls.innerHTML="";

        board.style.width = "70vmin";
        board.style.height = "70vmin";
        delay=100000;
    }   
}

let delay=0;
let gameOver = false;
let gameStopped = false;
var h_sc=0;

const foodSound = new Audio("music/food.mp3");
const overSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");

function game(){
    if(overAlert.style.display==="block")
        return;

    const gameSound = new Audio("music/music.mp3");
    gameSound.play();
    change();
    let inputDir = [1,0]; 
    let snakeArr = [[4,2],[3,2],[2,2]];
    let speed = 7;
    let lastPaintTime = 0;
    let size = 20;
    let a=2;
    let b=size-1;
    let sc=0;

    let prevDirChange=0;
    let currCycle=0;

    food = [Math.round(a + (b-a)* Math.random()),Math.round(a + (b-a)* Math.random())];
    
    //check if mobile device
    forMobile();
    
    function main(ctime) {
        //Reset game if Game Over
        if(gameOver || gameStopped){
            gameSound.pause();
            inputDir =  [1,0]; 
            snakeArr = [[4,2],[3,2],[2,2]]; 
            change();  
            initial();
            score.innerHTML=0;
            if(gameOver){
                gameOver=false;
                i=0;
                while(i<delay)
                    i=i+0.003;
                overAlert.style.display="block";
            }
            gameStopped = false;
            return;
        }
        window.requestAnimationFrame(main);
        if((ctime - lastPaintTime)/1000 < 1/speed)
            return;
        lastPaintTime = ctime;
        gameEngine();
    }
    function isCollide(snake) {
        // If you bump into yourself 
        for (let i = 1; i < snakeArr.length; ++i)
            if(snake[i][0] === snake[0][0] && snake[i][1] === snake[0][1])
                return true;
        // If you bump into the wall
        if(snake[0][0] >= size || snake[0][0] <= 1 || snake[0][1] >= size || snake[0][1] <= 1)
            return true;        
        return false;
    }
    function gameEngine(){
        ++currCycle;
        if(isCollide(snakeArr)){
            overSound.play();
            board.classList.add("shake");      
            gameOver = true;
        }
        else{
            //Updating the snake array & Food
            //Building the wall
            board.innerHTML = "";
            for(i=1;i<=size;++i){
                wall = document.createElement('div');
                wall.style.gridColumnStart = i;
                wall.style.gridRowStart = 1;
                wall.classList.add('wall');
                board.appendChild(wall);
                wall = document.createElement('div');
                wall.classList.add('wall');
                wall.style.gridColumnStart = i;
                wall.style.gridRowStart = size;
                board.appendChild(wall);
                wall = document.createElement('div');
                wall.classList.add('wall');
                wall.style.gridColumnStart = 1;
                wall.style.gridRowStart = i;
                board.appendChild(wall);
                wall = document.createElement('div');
                wall.classList.add('wall');
                wall.style.gridColumnStart = size;
                wall.style.gridRowStart = i;
                board.appendChild(wall);
            }     
            // If you have eaten the food, increment the score and regenerate the food
            if(snakeArr[0][1] === food[1] && snakeArr[0][0] ===food[0]){
                foodSound.play();
                snakeArr[snakeArr.length] = [0,0];
                food = [Math.round(a + (b-a)* Math.random()),Math.round(a + (b-a)* Math.random())];
                let l=snakeArr.length;
                while(true){   
                    var i=0;             
                    while(i<l){
                        if(snakeArr[i][0]==food[0] && snakeArr[i][1]==food[1])
                            break;
                        ++i
                    }
                    if(i==l)
                        break;
                    food = [Math.round(a + (b-a)* Math.random()),Math.round(a + (b-a)* Math.random())];
                }
                ++sc;
                score.innerHTML = sc;
                if(sc>h_sc){
                    h_sc=sc;
                    highScore.innerHTML = h_sc;
                }
            }
            // Moving the snake
            for (let i = snakeArr.length - 2; i>=0; i--) { 
                snakeArr[i+1][0] = snakeArr[i][0];
                snakeArr[i+1][1] = snakeArr[i][1];
            }
            snakeArr[0][0] += inputDir[0];
            snakeArr[0][1] += inputDir[1];
            // Display the snake and Food
            for(let i=0;i<snakeArr.length;i++){
                snakeElement = document.createElement('div');
                snakeElement.style.gridRowStart = snakeArr[i][1];
                snakeElement.style.gridColumnStart = snakeArr[i][0];
                if(i === 0){
                    //for snake head
    	    		if(inputDir[0]==1)
                    	snakeElement.classList.add('head_r');
    	    		else if(inputDir[0]==-1)
                    	snakeElement.classList.add('head_l');
    	    		else if(inputDir[1]==1)
                    	snakeElement.classList.add('head_d');
    	    		else
                    	snakeElement.classList.add('head_u');
                }
                else if( i === (snakeArr.length -1) ){
                    //for snake tail
    	    		let prev=snakeArr[i-1];
    	    		let tail=snakeArr[i];
    	    		if(prev[0]===tail[0] && prev[1]===tail[1]-1)
    	    			snakeElement.classList.add('tail_u');
    	    		else if(prev[0]===tail[0] && prev[1]===tail[1]+1)
    	    			snakeElement.classList.add('tail_d');
    	    		else if(prev[1]===tail[1] && prev[0]===tail[0]-1)
    	    			snakeElement.classList.add('tail_l');
    	    		else
    	    			snakeElement.classList.add('tail_r');
                }
    	    	else{
                    //for snake body
    	    		let front = snakeArr[i-1];
    	    		let back = snakeArr[i+1];
    	    		let cur = snakeArr[i];
    	    		if(front[0]===back[0])
    	    			snakeElement.classList.add('body_v');
    	    		else if(front[1]===back[1])
    	    			snakeElement.classList.add('body_h');
    	    		else if(back[0]===front[0]-1 && back[1]===front[1]-1){
    	    			if(cur[0]===front[0])
    	    				snakeElement.classList.add('body_bl');
    	    			else
    	    				snakeElement.classList.add('body_tr');
    	    		}
    	    		else if(back[0]===front[0]+1 && back[1]===front[1]-1){
    	    			if(cur[0]===front[0])
    	    				snakeElement.classList.add('body_br');
    	    			else
    	    				snakeElement.classList.add('body_tl');
    	    		}
    	    		else if(back[0]===front[0]+1 && back[1]===front[1]+1){
    	    			if(cur[0]===front[0])
    	    				snakeElement.classList.add('body_tr');
    	    			else
    	    				snakeElement.classList.add('body_bl');
    	    		}
    	    		else{
    	    			if(cur[0]===front[0])	
    	    				snakeElement.classList.add('body_tl');
    	    			else
    	    				snakeElement.classList.add('body_br');
    	    		}
    	    	}
                board.appendChild(snakeElement);
            }
            // Display the food
            foodElement = document.createElement('div');
            foodElement.style.gridRowStart = food[1];
            foodElement.style.gridColumnStart = food[0];
            foodElement.classList.add('food')
            board.appendChild(foodElement);
        }   
    }

    window.requestAnimationFrame(main); 

    function moveSnake(e){
        if(prevDirChange === currCycle)
            return;
        prevDirChange = currCycle;
        moveSound.play();
        if(e=="ArrowUp" && inputDir[1]!=1){
            inputDir[0]=0;
            inputDir[1]=-1;
        }
        else if(e=="ArrowDown" && inputDir[1]!=-1){
            inputDir[0]=0;
            inputDir[1]=1;
        }
        else if(e=="ArrowLeft" && inputDir[0]!=1){
            inputDir[0]=-1;
            inputDir[1]=0;
        }
        else if(e=="ArrowRight" && inputDir[0]!=-1){
            inputDir[0]=1;
            inputDir[1]=0;
        }
    }
    //keyboard move
    window.addEventListener('keydown', e =>{
        moveSnake(e.key)
    });

    //buttons on phone move
    function handleButtonKeyMove(e) {
        const { id } = e.currentTarget;
        moveSnake(id);
    }

    const keyBtns = document.querySelectorAll('.controls button');
    keyBtns.forEach(keyBtn => {
        keyBtn.addEventListener('mousedown', handleButtonKeyMove);
        keyBtn.addEventListener('touchstart', handleButtonKeyMove);
    });

    //touch controls
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;                                                        
    var yDown = null;

    function getTouches(evt) {
    return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }                                                     
                                                                            
    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                            
    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
        /*most significant direction changing logic*/                      
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
            if (xDiff <= 0 && inputDir[0]!=-1 ) {
                inputDir[0]=1;
                inputDir[1]=0; 
            } else if(xDiff > 0 && inputDir[0]!=1){
                inputDir[0]=-1;
                inputDir[1]=0;
            }                       
        } else {
            if (yDiff <= 0 && inputDir[1]!=-1) {
                inputDir[0]=0;
                inputDir[1]=1; 
            } else if(yDiff > 0 && inputDir[1]!=1){ 
                inputDir[0]=0;
                inputDir[1]=-1;
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };
}
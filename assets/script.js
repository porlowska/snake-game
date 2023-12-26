$(document).ready(function(){
//def canvas variables
const canvas = $('#canvas')[0];
const ctx = canvas.getContext('2d');
const w = canvas.width;
const h =canvas.height;
const cellWidth = 10;//cell width
let direction = "right";
let food; //snake food
let score; //current score
let speed=200; //speed of snake in miliseconds
let snake; // snake length
let color = "green"

//initialaser
function init(){
    createSnake();
    createFood();
    score=0;
    //trigger the game
    if (typeof game_loop!="undefined"){
        clearInterval(game_loop)
    }
    game_loop = setInterval(animate, speed)

}

init()

//creates snake
function createSnake(){
    let length = 5; //initail length of the snake
    snake = [];
    for (var i=length-1; i >=0; i-- ){
        snake.push({x: i, y:0});
    }
}   
//create food in random place
function createFood(){
    food={
        x: Math.round(Math.random()*(w-cellWidth)/cellWidth),
        y: Math.round(Math.random()*(h-cellWidth)/cellWidth)
    }
}
//i will animate the snake on the canvas
function animate(){
    //paint the canvas
    ctx.fillStyle="black";
    ctx.fillRect(0,0,w,h)
    ctx.strokeStyle = "white";
    ctx.strokeRect(0,0,w,h)
    //movement of the snake 
    // food pops up snakes eats it and it pops up on the end of the tail
    
    //position of the snake
    let nx = snake[0].x
    let ny = snake[0].y
    //directio of the snake and decremataion on the axis
    if (direction=='right'){
        nx++
    } else if (direction=='left'){
        nx--
    }else if (direction=='up'){
        ny--
    }else if (direction=='down'){
        ny++
    }
    // Collide code
    if(nx==-1 || nx == w/cellWidth ||ny==-1||ny==h/cellWidth||checkCollision(nx,ny,snake)){
        //init();
        //insert Final score
        $('#finalScore').text(score)
        //show overlay
        $('#overlay').fadeIn(300)

        return;
    }
    let tail;
    // the food is added up to the snake as a head!
    //if the snake replaces food posuton
    if (nx == food.x && ny== food.y){
        tail = {x:nx, y:ny};
        score++;
        //crate new pice of food 
        createFood()
    }else{
        tail = snake.pop()
        tail.x= nx;
        tail.y=ny;
    }
    snake.unshift(tail)
    for (var i=0; i <snake.length; i++){
        let c =snake[i];
        paintCell(c.x, c.y)
    }
    //Paint Cell
    paintCell(food.x, food.y)
        
    //Check Score
    checkScore(score)

    //Display current score
    $('#current').text('Your score: '+score)

    
}
function paintCell(x, y){
    ctx.fillStyle=color;
    ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
    ctx.strokeStyle="white";
    ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth)
}
function checkCollision(x,y,arr){
    for(var i=0;i<arr.length;i++){
        if(arr[i].x==x && arr[i].y==y){
            return true;
        }
    }
    return false
}
function checkScore(score){
    let setHighscore = localStorage.getItem('highscore');
    if(setHighscore===null){
        //if there is no hogh score set to current
        localStorage.setItem('highscore', score)
    }else{
        //if there is a high score compare the scores save highest
        if(score>setHighscore){
            localStorage.setItem('highscore', score)
        }
    }
    $('#high').text('Highscore: '+ setHighscore)

}
//Keypress to move the snake
$(document).keydown(function(e){
    let key = e.which;
    if(key =='37' && direction !='right'){
        direction ='left'
    }else if (key =='38'&& direction !='down'){
        direction = 'up'
    }else if (key =='39' && direction !='left'){
        direction = 'right'
    }else if (key =='40' && direction !='up'){
        direction = 'down'
    }
})

})
$('#clear').click(function(){
    localStorage.clear()
})
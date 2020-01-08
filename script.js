// module aliases
var Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Bodies = Matter.Bodies,
	Body = Matter.Body;
	Constraint = Matter.Constraint;
var isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var mousePos;
var pmousePos;
var touching=false;
var dx=0,dy=0;
var engine = Engine.create();
var world = engine.world;
var lvls = [
	[[0,2,1],[0,3,1],[0,4,1],[2,5,1],[2,6,1],[0,7,1],[0,8,1],[1,9,1],[0,2,2],[0,2,3],[0,2,4],[0,2,5],[0,2,6],[4,-1,7],[0,2,7],[0,-4,8],[0,-3,8],[0,-2,8],[0,-1,8],[0,0,8],[0,1,8],[0,2,8]],
	[[4,-3,3],[3,4,4],[0,-4,5],[0,-3,5],[0,-2,5],[0,-1,5],[0,0,5],[0,1,5],[0,2,5],[0,3,5],[1,4,5],[0,5,5],[0,6,5]]
];
var players = [];
var walls = [];
// var boxes = [];
var spikes = [];
var flags = [];
var coins=[];
var ground;
var b;
var font;

function genWorld(w){
	engine = Engine.create();
	world = engine.world;
	walls = [new Ground(0,1000,10000,1000,"ground")];
	spikes = [];
	flags = [];
	boxes = [];
	coins = [];
	players = [new Player(0,100)]
	Engine.run(engine);
}

function checkMouse(x,y,p){
	if(x>50){
		p.extMove(1);
	} else if(x<-50){
		p.extMove(-1);
	}
	if(-y>50){
		p.extJump();
	}
}

function preload(){
	font=loadFont("media/font.ttf");
	coin=loadImage("media/coin.png");
}

function setup(){
	imageMode(CENTER);
	mousePos = createVector(mouseX, mouseY);
	pmousePos = createVector(mouseX, mouseY);
	for(let i=0;i<players.length;i++){
		players[k].init();
	}
	genWorld(0);
	createCanvas(window.innerWidth, window.innerHeight-4);
	
	background(147,187,236);
}

// function keyPressed() {
//   if (key == ' ') {
//   }
// }

// function mousePressed() {
	// circles.push(new Circle(mouseX, mouseY, random(5, 10)));
// }

function draw() {
	for(var k=0;k<players.length;k++){
		if(isMobile) checkMouse(dx,dy,players[k]);
		players[k].logic(walls,flags,players,coins);
		// coins++;
	}
	mousePos.x=mouseX;
	mousePos.y=mouseY;
	background(147,187,236);
	// background(255, 255, 255);
	Engine.update(engine);
	for (var i = 0; i < walls.length; i++) {
		walls[i].show(players);
	}
	for (var j = 0; j < flags.length; j++) {
		flags[j].show(players);
	}
	for (var l = 0; l < spikes.length; l++) {
		spikes[l].show(players);
	}
	for(var m=0;m<coins.length;m++){
		coins[m].show(players);
	}
	for(var k=0;k<players.length;k++){
		players[k].show();
	}
	if(touching&&isMobile){
		stroke(140,140,140,50);
		fill(150,150,150,90);
		circle(pmousePos.x, pmousePos.y, 30);
		circle(pmousePos.x, pmousePos.y, 45);
		circle(mousePos.x, mousePos.y, 30);
		circle(mousePos.x, mousePos.y, 45);
	}
	textFont(font,15);
	fill(255);
	text("MARIO x "+players[0].lives+"       x "+players[0].coins,40,40);
	image(coin,250,32,15,21);
	// for (var m = 0; m < boxes.length; m++) {
		// boxes[m].show(players);
	// }
}

function touchStarted() {
	pmousePos=createVector(mouseX,mouseY);
	touching=true;
}

function touchMoved() {
	dx=mousePos.x-pmousePos.x;
	dy=mousePos.y-pmousePos.y;
}

function touchEnded() {
	dx=0;
	dy=0;
	touching=false;
}
// module aliases
var Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Bodies = Matter.Bodies,
	Body = Matter.Body;
	Constraint = Matter.Constraint;
var mousePos;
var pmousePos;
var touching=false;
var dx=0,dy=0;
var engine = Engine.create();
var world = engine.world;
// var lvls = [
	// [[0,2,1],[0,3,1],[0,4,1],[2,5,1],[2,6,1],[0,7,1],[0,8,1],[1,9,1],[0,2,2],[0,2,3],[0,2,4],[0,2,5],[0,2,6],[4,-1,7],[0,2,7],[0,-4,8],[0,-3,8],[0,-2,8],[0,-1,8],[0,0,8],[0,1,8],[0,2,8]],
	// [[4,-3,3],[3,4,4],[0,-4,5],[0,-3,5],[0,-2,5],[0,-1,5],[0,0,5],[0,1,5],[0,2,5],[0,3,5],[1,4,5],[0,5,5],[0,6,5]]
// ];
var players = [];
var qblocks=[];
var walls = [];
// var boxes = [];
var spikes = [];
var flags = [];
var checkpoints = [];
var coins=[];
var bricks=[];
var enemies=[];
var pwrups=[];
var pipes=[];
var buttons=[];
var ground;
var b;
var font;

function add(type,x,y,w,h){
	switch (type){
		case "border":
			walls.push(new Ground(x,y,w,h,"border"));
			break;
		case "wall":
			walls.push(new Ground(x,y,w,h,"wall"));
			break;
		case "ground":
			walls.push(new Ground(x,y,w,h,"ground"));
			break;
		case "qblock":
			let idx1=qblocks.push(new QBlock(x,y,!!h))-1;
			if(w===0){
				qblocks[idx1].addContent("mushroom",pwrups);
			} else if(w===1){
				qblocks[idx1].addContent("coin",coins);
			}
			break;
		case "brick":
			bricks.push(new Brick(x,y));
			break;
		case "coin":
			coins.push(new Coin(x,y));
			break;
		case "spike":
			spikes.push(new Spike(x,y,false));
			break;
		case "flag":
			flags.push(new Flag(x,y,w));
			break;
		case "player":
			players.push(new Player(x,y));
			break;
		case "mushroom":
			pwrups.push(new Mushroom(x,y,2));
			break;
		case "goomba":
			enemies.push(new Goomba(x,y,w));
			break;
		case "pipe":
			pipes.push(new Pipe(x,y,w,h));
			break;
		case "checkpoint":
			checkpoints.push(new Checkpoint(x,y));
			break;
	}
}

function genWorld(w){
	engine = Engine.create();
	world = engine.world;
	players = []
	walls = [];
	spikes = [new Ground(0,520,1000,10,"ground"),new Ground(0,520,-1000,10,"ground"),new Ground(520,0,10,1000,"ground"),new Ground(520,0,10,1000,"ground")];
	flags = [];
	boxes = [];
	coins = [];
	bricks = [];
	qblocks=[];
	pwrups=[];
	checkpoints = [];
	pipes=[];
	enemies=[];
	switch(w){
		case 0:
			add("wall",-7,0,2,2);
			add("pipe",-5,0,1,10);
			add("wall",5,-2,2,2);
			add("player",-2,-2);
			add("goomba",2,-1,1);
			break;
		case 1:
			add("player",13,-1);
			add("border",-10,-50,10,50);
			add("ground",-100,0,170,10);
			add("qblock",17,-4,1,0);
			add("brick",21,-4);
			add("qblock",22,-4,0,0);
			add("goomba",23,-2,-1);
			add("brick",23,-4);
			add("qblock",23,-8,1,0);
			add("qblock",24,-4,1,0);
			add("brick",25,-4);
			add("pipe",29,-2,0,2);
			add("pipe",39,-3,0,3);
			add("goomba",41,-2,-1);
			add("pipe",47,-4,0,4);
			add("goomba",52,-2,-1);
			add("goomba",53.5,-2,-1);
			add("pipe",58,-4,0,4);
			add("ground",72,0,15,10);
			add("checkpoint",80,-1);
			add("brick",78,-4);
			add("qblock",79,-4,0);
			add("brick",80,-4);
			add("brick",81,-8);
			add("goomba",81,-10,-1);
			add("brick",82,-8);
			add("brick",83,-8);
			add("goomba",83,-10,-1);
			add("brick",84,-8);
			add("brick",85,-8);
			add("brick",86,-8);
			add("brick",87,-8);
			add("brick",88,-8);
			add("ground",90,0,63,10);
			add("brick",92,-8);
			add("brick",93,-8);
			add("brick",94,-8);
			add("qblock",94,-4,1,1);
			add("goomba",97,-2,-1);
			add("goomba",98.5,-2,-1);
			add("brick",100,-4);
			add("qblock",101,-4,0,1);
			add("qblock",106,-4,1,0);
			add("qblock",109,-4,1,0);
			add("qblock",109,-8,0,0);
			add("qblock",112,-4,1,0);
			add("goomba",114,-2,-1);
			add("goomba",115.5,-2,-1);
			add("brick",118,-4);
			add("brick",121,-8);
			add("brick",122,-8);
			add("brick",123,-8);
			add("goomba",124,-2,-1);
			add("goomba",125.5,-2,-1);
			add("brick",128,-8);
			add("goomba",128,-2,-1);
			add("goomba",129.5,-2,-1);
			add("brick",129,-4);
			add("qblock",129,-8,1,0);
			add("brick",130,-4);
			add("qblock",130,-8,1,0);
			add("brick",131,-8);
			add("wall",134,-1,1,1);
			add("wall",135,-2,1,2);
			add("wall",136,-3,1,3);
			add("wall",137,-4,1,4);
			add("wall",140,-4,1,4);
			add("wall",141,-3,1,3);
			add("wall",142,-2,1,2);
			add("wall",143,-1,1,1);
			add("wall",148,-1,1,1);
			add("wall",149,-2,1,2);
			add("wall",150,-3,1,3);
			add("wall",151,-4,1,4);
			add("wall",152,-4,1,4);
			add("wall",155,-4,1,4);
			add("wall",156,-3,1,3);
			add("wall",157,-2,1,2);
			add("wall",158,-1,1,1);
			add("ground",155,0,70,10);
			add("pipe",163,-2,0,2);
			add("brick",168,-4);
			add("brick",169,-4);
			add("qblock",170,-4,1,0);
			add("brick",171,-4);
			add("goomba",174,-2,-1);
			add("goomba",175.5,-2,-1);
			add("pipe",179,-2,0,2);
			add("wall",181,-1,1,1);
			add("wall",182,-2,1,2);
			add("wall",183,-3,1,3);
			add("wall",184,-4,1,4);
			add("wall",185,-5,1,5);
			add("wall",186,-6,1,6);
			add("wall",187,-7,1,7);
			add("wall",188,-8,1,8);
			add("wall",189,-8,1,8);
			add("wall",198,-1,1,1);
			add("flag",198,-2,1);
			break;
	}
	currentWorld=w;
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
	angleMode(DEGREES);
	imageMode(CENTER);
	buttons=[];
	mousePos = createVector(mouseX, mouseY);
	pmousePos = createVector(mouseX, mouseY);
	for(let i=0;i<players.length;i++){
		players[k].init();
	}
	genWorld(1);
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
	Engine.update(engine);
	// Engine.update(engine);
	// Engine.update(engine);
	// Engine.update(engine);
	// Engine.update(engine);
	for(var i = 0; i < players.length; i++){
		if(isMobile) checkMouse(dx,dy,players[i]);
		players[i].logic(walls,flags,players,coins,bricks,qblocks,enemies,pwrups,pipes,checkpoints);
		// coins++;
	}
	for(i = 0; i < enemies.length; i++){
		enemies[i].logic(walls,bricks,qblocks,spikes,pipes);
	}
	mousePos.x=mouseX;
	mousePos.y=mouseY;
	background(146,144,255);
	// background(255, 255, 255);
	for(i = 0; i < walls.length; i++) {
		walls[i].show(players);
	}
	for(i = 0; i < flags.length; i++) {
		flags[i].show(players);
	}
	for(i = 4; i < spikes.length; i++) {
		spikes[i].show(players);
	}
	for(i = 0; i < coins.length; i++){
		coins[i].show(players);
	}
	for(i = 0; i < pwrups.length; i++){
		pwrups[i].show(players);
	}
	for(i = 0; i < bricks.length; i++){
		bricks[i].show(players);
	}
	for(i = 0; i < qblocks.length; i++){
		qblocks[i].show(players);
	}
	for(i = 0; i < enemies.length; i++){
		enemies[i].show(players);
	}
	for(i = 0; i < pipes.length; i++){
		pipes[i].show(players);
	}
	for(i = 0; i < checkpoints.length; i++){
		checkpoints[i].show(players);
	}
	for(i = 0; i < players.length; i++){
		players[i].show();
	}
	// if(touching&&isMobile){
		// stroke(140,140,140,50);
		// fill(150,150,150,90);
		// circle(pmousePos.x, pmousePos.y, 30);
		// circle(pmousePos.x, pmousePos.y, 45);
		// circle(mousePos.x, mousePos.y, 30);
		// circle(mousePos.x, mousePos.y, 45);
	// }
	textFont(font,15);
	fill(255);
	if(players[0]){
		text("MARIO x "+players[0].lives+"       x "+players[0].coins,40,40);
		image(coin,250,32,15,21);
	}
	// for (var m = 0; m < boxes.length; m++) {
		// boxes[m].show(players);
	// }
}

// function mousePressed() {
	// var sumx=0;
	// var sumy=0;
	// var ps=0;
	// for(var i=0;i<players.length;i++){
		// if(players[i].body){
			// sumx+=players[i].body.position.x;
			// sumy+=players[i].body.position.y;
			// ps++;
		// }
	// }
	// if(ps){
		// sumx/=ps;
		// sumy/=ps;
	// }
	// add("brick",Math.floor((mouseX-width/2+25+sumx)/50),Math.floor((mouseY-height/2-offsetY+sumy+25)/50));
// }

// function mouseDragged() {
	// var sumx=0;
	// var sumy=0;
	// var ps=0;
	// for(var i=0;i<players.length;i++){
		// if(players[i].body){
			// sumx+=players[i].body.position.x;
			// sumy+=players[i].body.position.y;
			// ps++;
		// }
	// }
	// if(ps){
		// sumx/=ps;
		// sumy/=ps;
	// }
	// add("brick",Math.floor((mouseX-width/2+25+sumx)/50),Math.floor((mouseY-height/2-offsetY+sumy+25)/50));
// }

// function touchStarted() {
	// pmousePos=createVector(mouseX,mouseY);
	// touching=true;
// }

// function touchMoved() {
	// dx=mousePos.x-pmousePos.x;
	// dy=mousePos.y-pmousePos.y;
// }

// function touchEnded() {
	// dx=0;
	// dy=0;
	// touching=false;
// }
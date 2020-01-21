var isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let offsetY=200;
var currentWorld=1;
function Player(x, y, up=UP_ARROW, right=RIGHT_ARROW, left=LEFT_ARROW) {
	this.resPos={x: x, y: y, lastCheckpointIndex: 0};
	big=true;
	this.coins=0;
	this.lives=3;
	let immune=0;
	this.imagesA=[loadImage("media/idleA.png"),loadImage("media/walk1A.png"),loadImage("media/walk2A.png"),loadImage("media/walk3A.png"),loadImage("media/jumpA.png"),loadImage("media/slideA.png")];
	this.imagesB=[loadImage("media/idleB.png"),loadImage("media/walk1B.png"),loadImage("media/walk2B.png"),loadImage("media/walk3B.png"),loadImage("media/jumpB.png"),loadImage("media/slideB.png")];
	this.imagesBigA=[loadImage("media/idleBigA.png"),loadImage("media/walkBig1A.png"),loadImage("media/walkBig2A.png"),loadImage("media/walkBig3A.png"),loadImage("media/jumpBigA.png"),loadImage("media/slideBigA.png")];
	this.imagesBigB=[loadImage("media/idleBigB.png"),loadImage("media/walkBig1B.png"),loadImage("media/walkBig2B.png"),loadImage("media/walkBig3B.png"),loadImage("media/jumpBigB.png"),loadImage("media/slideBigB.png")];
	this.keys=[up, right, left/* , down */];
	this.buttons=[createButton("W"), createButton("D"), createButton("A")/* , down */];
	this.buttons[0].class("up");
	this.buttons[1].class("right");
	this.buttons[2].class("left");
	this.buttons[0].position(window.innerWidth/10*8,window.innerHeight/5*4);
	this.buttons[1].position(window.innerWidth/10*3,window.innerHeight/5*4);
	this.buttons[2].position(window.innerWidth/10,window.innerHeight/5*4);
	this.buttons[0].size(window.innerWidth/10-50,window.innerWidth/10-50);
	this.buttons[1].size(window.innerWidth/10-50,window.innerWidth/10-50);
	this.buttons[2].size(window.innerWidth/10-50,window.innerWidth/10-50);
	this.buttons[0].value=this.buttons[1].value=this.buttons[2].value=0;
	this.buttons[0].elt.onmousedown=this.buttons[1].elt.onmousedown=this.buttons[2].elt.onmousedown=function(){
		this.value=1;
	};
	this.buttons[0].elt.onmouseleave=this.buttons[1].elt.onmouseleave=this.buttons[2].elt.onmouseleave=function(){
		this.value=0;
	};
	this.buttons[0].elt.onmouseup=this.buttons[1].elt.onmouseup=this.buttons[2].elt.onmouseup=function(){
		this.value=0;
	};
	this.buttons[0].elt.style.lineHeight=this.buttons[1].elt.style.lineHeight=this.buttons[2].elt.style.lineHeight=window.innerWidth/10-50+"px";
	this.buttons[0].elt.style.fontSize=this.buttons[1].elt.style.fontSize=this.buttons[2].elt.style.fontSize=window.innerWidth/10-100+"px";
	this.canJump=0;
	let move = 1;
	let extMoving = false;
	let extJumping = false;
	let jump = false;
	let slide=0;
	let count=0;
	let pvy=0;
	this.body = Bodies.rectangle(x*50+25, y*50+25, 50, 100, {
		friction: 0,
		restitution: 0,
		inertia: Infinity,
		chamfer: 50,
		mass: 1.5,
		collisionFilter: {
			group: -1
		}
	});
	this.sensor = Bodies.rectangle(x*50+25, y*50+25, 48, 10, {isSensor:true, inertia:Infinity});
	this.tsensor = Bodies.rectangle(x*50+25, y*50+25, 48, 1, {isSensor:true, inertia:Infinity});
	this.lsensor = Bodies.rectangle(x*50+25, y*50+25, 1, 45, { isSensor:true, inertia:Infinity});
	this.rsensor = Bodies.rectangle(x*50+25, y*50+25, 1, 45, { isSensor:true, inertia:Infinity});
	this.c1 = Constraint.create({
		bodyA:this.body,
		bodyB:this.sensor,
		pointA:{x: 0, y: 50},
		length: 0,
		damping:1,
		stiffness:1
	});
	this.c2 = Constraint.create({
		bodyA:this.body,
		bodyB:this.lsensor,
		pointA:{x: -25, y: -25},
		length: 0,
		damping:1,
		stiffness:1
	});
	this.c3 = Constraint.create({
		bodyA:this.body,
		bodyB:this.rsensor,
		pointA:{x: 25, y: -25},
		length: 0,
		damping:1,
		stiffness:1
	});
	this.c4 = Constraint.create({
		bodyA:this.body,
		bodyB:this.tsensor,
		pointA:{x: 0, y: -50},
		length: 0,
		damping:1,
		stiffness:1
	});
	World.add(world, this.body);
	World.add(world, this.sensor);
	World.add(world, this.tsensor);
	World.add(world, this.lsensor);
	World.add(world, this.rsensor);
	World.add(world, this.c1);
	World.add(world, this.c2);
	World.add(world, this.c3);
	World.add(world, this.c4);
	this.init=function(){
		big=true;
		World.remove(world,this.body);
		World.remove(world,this.sensor);
		World.remove(world,this.tsensor);
		World.remove(world,this.lsensor);
		World.remove(world,this.rsensor);
		World.remove(world,this.c1);
		World.remove(world,this.c2);
		World.remove(world,this.c3);
		World.remove(world,this.c4);
		this.body = Bodies.rectangle(this.resPos.x*50+25, this.resPos.y*50+25, 50, 100, {
			friction: 0,
			restitution: 0,
			inertia: Infinity,
			chamfer: 50,
			collisionFilter: {
				group: -1
			}
		});
		this.sensor = Bodies.rectangle(this.resPos.x*50+25, this.resPos.y*50+25, 48, 10, {isSensor:true, inertia:Infinity});
		this.tsensor = Bodies.rectangle(this.resPos.x*50+25, this.resPos.y*50+25, 48, 1, {isSensor:true, inertia:Infinity});
		this.lsensor = Bodies.rectangle(this.resPos.x*50+25, this.resPos.y*50+25, 1, 45, { isSensor:true, inertia:Infinity});
		this.rsensor = Bodies.rectangle(this.resPos.x*50+25, this.resPos.y*50+25, 1, 45, { isSensor:true, inertia:Infinity});
		this.c1 = Constraint.create({
			bodyA:this.body,
			bodyB:this.sensor,
			pointA:{x: 0, y: 50},
			length: 0,
			damping:1,
			stiffness:1
		});
		this.c2 = Constraint.create({
			bodyA:this.body,
			bodyB:this.lsensor,
			pointA:{x: -25, y: -25},
			length: 0,
			damping:1,
			stiffness:1
		});
		this.c3 = Constraint.create({
			bodyA:this.body,
			bodyB:this.rsensor,
			pointA:{x: 25, y: -25},
			length: 0,
			damping:1,
			stiffness:1
		});
		this.c4 = Constraint.create({
			bodyA:this.body,
			bodyB:this.tsensor,
			pointA:{x: 0, y: -50},
			length: 0,
			damping:1,
			stiffness:1
		});
		World.add(world, this.body);
		World.add(world, this.sensor);
		World.add(world, this.tsensor);
		World.add(world, this.lsensor);
		World.add(world, this.rsensor);
		World.add(world, this.c1);
		World.add(world, this.c2);
		World.add(world, this.c3);
		World.add(world, this.c4);
	};
	this.extMove=function(dir){
		Body.setVelocity(this.body, {
			x: 5*dir,
			y: this.body.velocity.y
		});
		move=2-dir/2+0.5;
		count+=0.2;
		count=count%3;
		extMoving=true;
	};
	this.extJump=function(){
		if(this.canJump){
			// jump=true;
			// Body.setVelocity(this.body, {
			  // x: this.body.velocity.x,
			  // y: -15
			// });
			// this.canJump=0;
			// slide=0;
			extJumping=true;
		}
	};
	this.move=function(dir){
		Body.setVelocity(this.body, {
			x: 5*dir,
			y: this.body.velocity.y
		});
	};
	this.jump=function(){
		if(this.canJump){
			jump=true;
			Body.setVelocity(this.body, {
				x: this.body.velocity.x,
				y: -15
			});
			this.canJump=0;
			slide=0;
		}
	};
	this.logic=function(grounds,flags,players,coins,bricks,qblocks,enemies,pwrups,pipes,checkpoints){
		if(this.buttons[0].elt.value==="1") this.extJump();
		if(this.buttons[1].elt.value==="1") this.extMove(1);
		if(this.buttons[2].elt.value==="1") this.extMove(-1);
		let collision;
		jump=true;
		for (var i = 0; i < pwrups.length; i++) {
			collision = Matter.SAT.collides(this.body, pwrups[i].body);
			if (collision.collided&&!pwrups[i].used&&pwrups[i].activated===2) {
				pwrups[i].used=true;
				if(!big){
					let x=this.body.position.x,y=this.body.position.y;
					World.remove(world,this.body);
					World.remove(world,this.sensor);
					World.remove(world,this.tsensor);
					World.remove(world,this.lsensor);
					World.remove(world,this.rsensor);
					World.remove(world,this.c1);
					World.remove(world,this.c2);
					World.remove(world,this.c3);
					World.remove(world,this.c4);
					this.body = Bodies.rectangle(x, y, 50, 100, {
						friction: 0,
						restitution: 0,
						inertia: Infinity,
						chamfer: 50,
						collisionFilter: {
							group: -1
						}
					});
					this.sensor = Bodies.rectangle(x, y, 48, 1, {isSensor:true, inertia:Infinity});
					this.tsensor = Bodies.rectangle(x, y, 48, 1, {isSensor:true, inertia:Infinity});
					this.lsensor = Bodies.rectangle(x, y, 1, 95, { isSensor:true, inertia:Infinity});
					this.rsensor = Bodies.rectangle(x, y, 1, 95, { isSensor:true, inertia:Infinity});
					this.c1 = Constraint.create({
						bodyA:this.body,
						bodyB:this.sensor,
						pointA:{x: 0, y: 50},
						length: 0,
						damping:1,
						stiffness:1
					});
					this.c2 = Constraint.create({
						bodyA:this.body,
						bodyB:this.lsensor,
						pointA:{x: -25, y: 0},
						length: 0,
						damping:1,
						stiffness:1
					});
					this.c3 = Constraint.create({
						bodyA:this.body,
						bodyB:this.rsensor,
						pointA:{x: 25, y: 0},
						length: 0,
						damping:1,
						stiffness:1
					});
					this.c4 = Constraint.create({
						bodyA:this.body,
						bodyB:this.tsensor,
						pointA:{x: 0, y: -50},
						length: 0,
						damping:1,
						stiffness:1
					});
					World.add(world, this.body);
					World.add(world, this.sensor);
					World.add(world, this.tsensor);
					World.add(world, this.lsensor);
					World.add(world, this.rsensor);
					World.add(world, this.c1);
					World.add(world, this.c2);
					World.add(world, this.c3);
					World.add(world, this.c4);
					big=true;
				} else {
					this.coins+=10;
				}
			}
		}
		for (i = 0; i < grounds.length; i++) {
			collision = Matter.SAT.collides(this.sensor, grounds[i].body);
			if (collision.collided) {
				jump=false;
			}
		}
		for (i = 0; i < checkpoints.length; i++) {
			collision = Matter.SAT.collides(this.body, checkpoints[i].body);
			if (collision.collided){
				if(i>=this.resPos.lastCheckpointIndex) {
					this.resPos={x: checkpoints[i].x, y: checkpoints[i].y, lastCheckpointIndex: i};
				}
				checkpoints[i].used=1;
			}
		}
		for (i = 0; i < pipes.length; i++) {
			collision = Matter.SAT.collides(this.sensor, pipes[i].body);
			if (collision.collided) {
				jump=false;
			}
		}
		for (i = 0; i < players.length; i++) {
			if(players[i]!==this){
				collision = Matter.SAT.collides(this.body, players[i].body);
				if (collision.collided) {
					jump=false;
				}
			}
		}
		// for (var m = 0; m < boxes.length; m++) {
			// collision = Matter.SAT.collides(this.body, boxes[m].body);
			// if (collision.collided) {
				// jump=false;
			// }
		// }
		for (i = 0; i < coins.length; i++) {
			collision = Matter.SAT.collides(this.body, coins[i].body);
			if (collision.collided&&!coins[i].taken) {
				this.coins++;
				coins[i].taken=true;
			}
		}
		for (i = 0; i < bricks.length; i++) {
			collision = [Matter.SAT.collides(this.body, bricks[i].body),Matter.SAT.collides(this.tsensor, bricks[i].body),Matter.SAT.collides(this.sensor, bricks[i].body)];
			if (collision[0].collided&&!collision[1].collided&&!bricks[i].broken) {
				jump=false;
			}
			if(bricks[i].broken){
				bricks[i].body.isSensor=true;
			}
			if (collision[1].collided){
				if(!bricks[i].broken&&pvy<-5&&jump) {
					bricks[i].broken=true;
					bricks[i].body.isSensor=true;
				}
			}
			// if (collision[2].collided){
				// if(!bricks[i].broken&&pvy>10&&!jump) {
					// bricks[i].broken=true;
					// bricks[i].body.isSensor=true;
				// }
			// }
		}
		for (i = 0; i < qblocks.length; i++) {
			collision = [Matter.SAT.collides(this.body, qblocks[i].body),Matter.SAT.collides(this.tsensor, qblocks[i].body),Matter.SAT.collides(this.sensor, qblocks[i].body)];
			if (collision[0].collided&&!collision[1].collided) {
				jump=false;
			}
			if (collision[1].collided){
				if(!qblocks[i].used&&pvy<-5&&jump) {
					qblocks[i].use(this);
				}
			}
			// if (collision[2].collided){
				// if(!qblocks[i].used&&pvy>10&&!jump) {
					// qblocks[i].used=true;
					// qblocks[i].use();
				// }
			// }
		}
		for (i = 0; i < flags.length; i++) {
			collision = Matter.SAT.collides(this.body, flags[i].body);
			if (collision.collided) {
				genWorld(flags[i].next);
			}
		}
		for (i = 0; i < spikes.length; i++) {
			collision = Matter.SAT.collides(this.body, spikes[i].body);
			if (collision.collided) {
				jump=false;
				if(!spikes[i].instantDeath){
					if(!immune){
						if(big){
							let x=this.body.position.x,y=this.body.position.y;
							World.remove(world,this.body);
							World.remove(world,this.sensor);
							World.remove(world,this.tsensor);
							World.remove(world,this.lsensor);
							World.remove(world,this.rsensor);
							World.remove(world,this.c1);
							World.remove(world,this.c2);
							World.remove(world,this.c3);
							World.remove(world,this.c4);
							this.body = Bodies.rectangle(x, y, 50, 50, {
								friction: 0,
								restitution: 0,
								inertia: Infinity,
								chamfer: 50,
								collisionFilter: {
									group: -1
								}
							});
							this.sensor = Bodies.rectangle(x, y, 48, 1, {isSensor:true, inertia:Infinity});
							this.tsensor = Bodies.rectangle(x, y, 48, 1, {isSensor:true, inertia:Infinity});
							this.lsensor = Bodies.rectangle(x, y, 1, 45, { isSensor:true, inertia:Infinity});
							this.rsensor = Bodies.rectangle(x, y, 1, 45, { isSensor:true, inertia:Infinity});
							this.c1 = Constraint.create({
								bodyA:this.body,
								bodyB:this.sensor,
								pointA:{x: 0, y: 25},
								length: 0,
								damping:1,
								stiffness:1
							});
							this.c2 = Constraint.create({
								bodyA:this.body,
								bodyB:this.lsensor,
								pointA:{x: -25, y: 0},
								length: 0,
								damping:1,
								stiffness:1
							});
							this.c3 = Constraint.create({
								bodyA:this.body,
								bodyB:this.rsensor,
								pointA:{x: 25, y: 0},
								length: 0,
								damping:1,
								stiffness:1
							});
							this.c4 = Constraint.create({
								bodyA:this.body,
								bodyB:this.tsensor,
								pointA:{x: 0, y: -25},
								length: 0,
								damping:1,
								stiffness:1
							});
							World.add(world, this.body);
							World.add(world, this.sensor);
							World.add(world, this.tsensor);
							World.add(world, this.lsensor);
							World.add(world, this.rsensor);
							World.add(world, this.c1);
							World.add(world, this.c2);
							World.add(world, this.c3);
							World.add(world, this.c4);
							big=false;
							immune=100;
						} else {
							if(this.lives>1){
								this.lives--;
								immune=100;
							} else {
								this.init();
								this.lives=3;
								this.coins=0;
							}
						}
					}
				} else {
					this.init();
					this.lives=3;
					this.coins=0;
				}
				// console.log("dead");
			}
		}
		for (i = 0; i < enemies.length; i++) {
			for (var j = 0; j < players.length; j++) {
				if (Matter.SAT.collides(enemies[i].tsensor, players[j].sensor).collided&&!enemies[i].dead) {
					enemies[i].dead=true;
					this.coins+=5;
				}
			}
			if(!enemies[i].dead){
				collision = [Matter.SAT.collides(this.body, enemies[i].body),Matter.SAT.collides(this.sensor, enemies[i].tsensor)];
				if (collision[0].collided&&!collision[1].collided) {
					if(!immune){
						if(big){
							let x=this.body.position.x,y=this.body.position.y;
							World.remove(world,this.body);
							World.remove(world,this.sensor);
							World.remove(world,this.tsensor);
							World.remove(world,this.lsensor);
							World.remove(world,this.rsensor);
							World.remove(world,this.c1);
							World.remove(world,this.c2);
							World.remove(world,this.c3);
							World.remove(world,this.c4);
							this.body = Bodies.rectangle(x, y, 50, 50, {
								friction: 0,
								restitution: 0,
								inertia: Infinity,
								chamfer: 50,
								collisionFilter: {
									group: -1
								}
							});
							this.sensor = Bodies.rectangle(x, y, 40, 1, {isSensor:true, inertia:Infinity});
							this.tsensor = Bodies.rectangle(x, y, 40, 1, {isSensor:true, inertia:Infinity});
							this.lsensor = Bodies.rectangle(x, y, 1, 45, { isSensor:true, inertia:Infinity});
							this.rsensor = Bodies.rectangle(x, y, 1, 45, { isSensor:true, inertia:Infinity});
							this.c1 = Constraint.create({
								bodyA:this.body,
								bodyB:this.sensor,
								pointA:{x: 0, y: 25},
								length: 0,
								damping:1,
								stiffness:1
							});
							this.c2 = Constraint.create({
								bodyA:this.body,
								bodyB:this.lsensor,
								pointA:{x: -25, y: 0},
								length: 0,
								damping:1,
								stiffness:1
							});
							this.c3 = Constraint.create({
								bodyA:this.body,
								bodyB:this.rsensor,
								pointA:{x: 25, y: 0},
								length: 0,
								damping:1,
								stiffness:1
							});
							this.c4 = Constraint.create({
								bodyA:this.body,
								bodyB:this.tsensor,
								pointA:{x: 0, y: -25},
								length: 0,
								damping:1,
								stiffness:1
							});
							World.add(world, this.body);
							World.add(world, this.sensor);
							World.add(world, this.tsensor);
							World.add(world, this.lsensor);
							World.add(world, this.rsensor);
							World.add(world, this.c1);
							World.add(world, this.c2);
							World.add(world, this.c3);
							World.add(world, this.c4);
							big=false;
							immune=100;
						} else {
							if(this.lives>1){
								this.lives--;
								immune=100;
							} else {
								this.init();
								this.lives=3;
								this.coins=0;
							}
						}
					}
					// console.log("dead");
				}
			}
		}
		if((keyIsDown(this.keys[1])||keyIsDown(this.keys[2]))&&!(keyIsDown(this.keys[1])&&keyIsDown(this.keys[2]))){
			if (keyIsDown(this.keys[1])) {
				this.move(1);
				if(!keyIsDown(this.keys[2])){
					move=2;
					count+=0.2;
					count=count%3;
				} else {
					if(move===2){
						move=0;
					}
					if(move===3){
						move=1;
					}
				}
			}
			if (keyIsDown(this.keys[2])) {
				this.move(-1);
				if(!keyIsDown(this.keys[1])){
					move=3;
					count+=0.2;
					count=count%3;
				} else {
					if(move===2){
						move=0;
					}
					if(move===3){
						move=1;
					}
				}
			}
		} else if(!extMoving){
			count=0;
			this.move(0);
			if(move===2){
				move=0;
			}
			if(move===3){
				move=1;
			}
		}
		if (keyIsDown(this.keys[0])||extJumping) {
			this.jump();
			this.canJump=0;
		} else {
			this.canJump=0;
			slide=0;
			for (i = 0; i < [].concat(grounds,bricks,qblocks,players,pipes,spikes).length; i++) {
				if([].concat(grounds,bricks,qblocks,players,pipes,spikes)[i].type!=="border"&&[].concat(grounds,bricks,qblocks,players,pipes,spikes)[i]!==this){
					if(Matter.SAT.collides(this.sensor, [].concat(grounds,bricks,qblocks,players,pipes,spikes)[i].body).collided){
						this.canJump=1;
					}
				}
			}
			// for (var i = 0; i < grounds.length; i++) {
				// collision = Matter.SAT.collides(this.sensor, grounds[i].body);
				// if (collision.collided) {
					// this.canJump=1;
					// if(!Matter.SAT.collides(this.lsensor, walls[j].body).collided&&!Matter.SAT.collides(this.rsensor, walls[j].body).collided){
						// slide=0;
					// }
				// }
			// }
			// for (i = 0; i < players.length; i++) {
				// if(players[i]!==this){
					// collision = Matter.SAT.collides(this.body, players[i].body);
					// if (collision.collided) {
						// this.canJump=1;
					// }
				// }
			// }
			// for (i = 0; i < spikes.length; i++) {
				// collision = Matter.SAT.collides(this.body, spikes[i].body);
				// if (collision.collided) {
					// this.canJump=1;
				// }
			// }
			// for (i = 0; i < bricks.length; i++) {
				// collision = Matter.SAT.collides(this.body, bricks[i].body);
				// if (collision.collided) {
					// this.canJump=1;
				// }
			// }
		}
		extMoving=false;
		extJumping=false;
		pvy=this.body.velocity.y;
	};
	this.show=function(){
		var pos = this.body.position;
		var sumx=0;
		var sumy=0;
		var ps=0;
		for(var i=0;i<players.length;i++){
			if(players[i].body){
				sumx+=players[i].body.position.x;
				sumy+=players[i].body.position.y;
				ps++;
			}
		}
		sumx/=ps;
		sumy/=ps;
		// [[0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,2,2,2,2,2,2,2,2,3,3,0,0,0,0,0,0,0,0],
		// [0,0,0,0,1,3,1,3,3,3,3,3,3,3,0,0,0,0,0,0,0],
		// [0,0,1,1,1,1,1,1,3,1,1,3,1,1,1,0,0,0,0,0,0],
		// [0,1,1,3,3,1,1,3,3,1,1,3,1,1,1,0,0,0,0,0,0],
		// [0,0,3,3,1,1,1,1,1,1,3,1,1,1,0,0,0,0,0,0,0],
		// [0,0,0,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		// [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
		rectMode(CENTER);
		var media;
		// slide=1;
		let w=50,h;
		if(big){
			h=100;
			if(slide!==0&&!jump){
				if(slide===2){
					media=this.imagesBigA;
				} else {
					media=this.imagesBigB;
				}
			} else {
				if(move%2===0){
					media=this.imagesBigA;
				} else {
					media=this.imagesBigB;
				}
			}
		} else {
			h=50
			if(slide!==0&&!jump){
				if(slide===2){
					media=this.imagesA;
				} else {
					media=this.imagesB;
				}
			} else {
				if(move%2===0){
					media=this.imagesA;
				} else {
					media=this.imagesB;
				}
			}
		}
		if(immune%2===0){
			if(jump){
				if(move%2===0){
					image(media[4],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY,w,h);
				} else if(move%2===1){
					image(media[4],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY,w,h);
				}
			} else {
				if(slide!==0){
					image(media[5],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY,w,h);
				} else {
					switch(move){
						case 0:
							image(media[0],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY,w,h);
							break;
						case 1:
							image(media[0],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY,w,h);
							break;
						case 2:
							image(media[Math.floor(count)+1],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY,w,h);
							break;
						case 3:
							image(media[Math.floor(count)+1],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY,w,h);
							break;
					}
				}
			}
		}
		if(immune){
			immune--;
		}
		// rect((pos.x-sumx)+width/2,(pos.y-sumy)+height/2,51,40);
		// translate(pos.x+width/2,pos.y);
		// fill(r,g,b);
		// rect(0,0,51,40);
		// fill(155, 118, 83);
		// translate(pos.x+width/2,pos.y);
		// push();
		// translate(width/2, height/2+150);
		// translate(pos.x+width/2, pos.y);
		// pos = this.sensor.position;
		// push();
		// translate((pos.x-sumx)+width/2-25, (pos.y-sumy)+height/2+offsetY-25);
		// rectMode(CENTER);
		// strokeWeight(0);
		// fill(0);
		// rect(0, 0, 51, 1);
		// pop();
		// pos = this.lsensor.position;
		// push();
		// translate((pos.x-sumx)+width/2, (pos.y-sumy)+height/2);
		// rectMode(CENTER);
		// strokeWeight(0);
		// fill(0);
		// rect(0, 0, 1, 40);
		// pop();
		// pos = this.rsensor.position;
		// push();
		// translate((pos.x-sumx)+width/2, (pos.y-sumy)+height/2);
		// rectMode(CENTER);
		// strokeWeight(0);
		// fill(0);
		// rect(0, 0, 1, 40);
		// pop();
	}
	this.init();
}

function Flag(x, y, next) {
	this.body = Bodies.rectangle(x*50+25, y*50+25, 50, 500, {friction: 0,restitution: 0,isStatic: true,isSensor:true});
	this.next=next;
	this.image=loadImage("media/flag.png");
	World.add(world, this.body);
	this.show = function(p) {
		var pos = this.body.position;
		var sumx=0;
		var sumy=0;
		var ps=0;
		for(var i=0;i<p.length;i++){
			if(p[i].body){
				sumx+=p[i].body.position.x;
				sumy+=p[i].body.position.y;
				ps++;
			}
		}
		sumx/=ps;
		sumy/=ps;
		// push();
		// translate((pos.x-sumx)+width/2, (pos.y-sumy)+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(155, 118, 83);
		// fill(255, 136, 0);
		// rect(0, 0, 51, 51);
		// pop();
		image(this.image,(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-250+offsetY,50,500);
	};
}

function Checkpoint(x, y) {
	this.body = Bodies.rectangle(x*50+55, y*50+25, 80, 100, {friction: 0,restitution: 0,isStatic: true,isSensor:true});
	this.used=0;
	this.x=x;
	this.y=y;
	this.image=[loadImage("media/checkpointA.png"),loadImage("media/checkpointB.png")];
	World.add(world, this.body);
	this.show = function(p) {
		var pos = this.body.position;
		var sumx=0;
		var sumy=0;
		var ps=0;
		for(var i=0;i<p.length;i++){
			if(p[i].body){
				sumx+=p[i].body.position.x;
				sumy+=p[i].body.position.y;
				ps++;
			}
		}
		sumx/=ps;
		sumy/=ps;
		// push();
		// translate((pos.x-sumx)+width/2, (pos.y-sumy)+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(155, 118, 83);
		// fill(255, 136, 0);
		// rect((pos.x-sumx)+width/2-40,(pos.y-sumy)+height/2-50+offsetY, 80, 100);
		// pop();
		image(this.image[this.used],(pos.x-sumx)+width/2-40,(pos.y-sumy)+height/2-50+offsetY,100,100);
	};
}

function Ground(x,y,w,h,type="wall") {
	this.type=type;
	this.body = Bodies.rectangle(x*50+w*25, y*50+h*25, w*50, h*50, {friction: 0,restitution: 0,isStatic: true});
	this.image = this.type==="ground"? loadImage("media/wall1.png") : loadImage("media/wall2.png");
	World.add(world, this.body);
	this.show = function(p) {
		var pos = this.body.position;
		var sumx=0;
		var sumy=0;
		var ps=0;
		for(var i=0;i<p.length;i++){
			if(p[i].body){
				sumx+=p[i].body.position.x;
				sumy+=p[i].body.position.y;
				ps++;
			}
		}
		sumx/=ps;
		sumy/=ps;
		// push();
		// translate(-sumx+width/2, 1000-sumy+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(155, 118, 83);
		// fill(0, 0, 0);
		// rect(0, 0, 1000, 500);
		// pop();
		if(this.type!=="border"){
			for(let i=-h/2;i<h/2;i++){
				for(let j=-w/2;j<w/2;j++){
					image(this.image,(pos.x-sumx)+width/2+j*50,(pos.y-sumy)+height/2+i*50+offsetY,50,50);
				}
			}
		}
	};
}

function Pipe(x,y,o,l) {
	this.orientation=o;
	let w,h;
	if(o%2===0){
		w=2,h=l;
	} else {
		w=l,h=2;
	}
	this.body = Bodies.rectangle(x*50+w*25, y*50+h*25, w*50, h*50, {friction: 0,restitution: 0,isStatic: true});
	this.image = [loadImage("media/pipe1A.png"), loadImage("media/pipe1B.png"),loadImage("media/pipe2A.png"), loadImage("media/pipe2B.png")];
	World.add(world, this.body);
	this.show = function(p) {
		var pos = this.body.position;
		var sumx=0;
		var sumy=0;
		var ps=0;
		for(var i=0;i<p.length;i++){
			if(p[i].body){
				sumx+=p[i].body.position.x;
				sumy+=p[i].body.position.y;
				ps++;
			}
		}
		sumx/=ps;
		sumy/=ps;
		push();
		translate((pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2+offsetY-25);
		rotate(o*90);
		image(this.image[0],-25,-l/2*50+25,50,50);
		// circle(-25,-l/2*50+25,10);
		image(this.image[1],25,-l/2*50+25,50,50);
		// circle(25,-l/2*50+25,10);
		for(var i=1;i<l;i++){
			image(this.image[2],-25,-l/2*50+i*50+25,50,50);
			// circle(-25,-l/2*50+i*50+25,10);
			image(this.image[3],25,-l/2*50+i*50+25,50,50);
			// circle(25,-l/2*50+i*50+25,10);
		}
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(155, 118, 83);
		// fill(0, 0, 0);
		// rect(0, 0, 1000, 500);
		pop();
		// push();
		// translate((pos.x-sumx)+width/2,(pos.y-sumy)+height/2+offsetY);
		// circle(0,0,50);
		// pop();
	};
}

function Coin(x,y) {
	this.body = Bodies.rectangle(x*50+25, y*50+25, 30, 42, {isSensor: true, isStatic: true});
	this.image = loadImage("media/coin.png");
	this.taken=false;
	World.add(world, this.body);
	this.show = function(p) {
		var pos = this.body.position;
		var sumx=0;
		var sumy=0;
		var ps=0;
		for(var i=0;i<p.length;i++){
			if(p[i].body){
				sumx+=p[i].body.position.x;
				sumy+=p[i].body.position.y;
				ps++;
			}
		}
		sumx/=ps;
		sumy/=ps;
		// push();
		// translate(-sumx+width/2, 1000-sumy+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(155, 118, 83);
		// fill(0, 0, 0);
		// rect((x-sumx)+width/2-25,(y-sumy)+height/2, 50, 50);
		// pop();
		if(!this.taken) image(this.image,(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2+offsetY-25,30,42);
	};
}

function Brick(x,y) {
	this.body = Bodies.rectangle(x*50+25, y*50+25, 50, 50, {isStatic: true});
	this.image = [loadImage("media/brick.png"),loadImage("media/brokenbrick.png")];
	this.broken=0;
	let counter=0;
	World.add(world, this.body);
	this.show = function(p) {
		var pos = this.body.position;
		var sumx=0;
		var sumy=0;
		var ps=0;
		for(var i=0;i<p.length;i++){
			if(p[i].body){
				sumx+=p[i].body.position.x;
				sumy+=p[i].body.position.y;
				ps++;
			}
		}
		sumx/=ps;
		sumy/=ps;
		// push();
		// translate(-sumx+width/2, 1000-sumy+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(155, 118, 83);
		// fill(0, 0, 0);
		// rect((x-sumx)+width/2-25,(y-sumy)+height/2, 50, 50);
		// pop();
		if(!this.broken){
			image(this.image[0],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2+offsetY-25,50,50);
			counter=0;
		} else {
			World.remove(world, this.body);
			if(counter<1){
				image(this.image[1],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2+offsetY-25,50,50);
				counter+=0.1;
			}
		}
	};
}

function QBlock(x,y,disguised) {
	this.body = Bodies.rectangle(x*50+25, y*50+25, 50, 50, {isStatic: true});
	this.image = [disguised? loadImage("media/brick.png") : loadImage("media/qblock1.png"),loadImage("media/qblock2.png")];
	this.used=0;
	let i=50;
	this.content;
	let using=0;
	World.add(world, this.body);
	this.show = function(p) {
		var pos = this.body.position;
		var sumx=0;
		var sumy=0;
		var ps=0;
		for(var i=0;i<p.length;i++){
			if(p[i].body){
				sumx+=p[i].body.position.x;
				sumy+=p[i].body.position.y;
				ps++;
			}
		}
		sumx/=ps;
		sumy/=ps;
		// push();
		// translate(-sumx+width/2, 1000-sumy+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(155, 118, 83);
		// fill(0, 0, 0);
		// rect((x-sumx)+width/2-25,(y-sumy)+height/2, 50, 50);
		// pop();
		if(!this.used){
			image(this.image[0],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2+offsetY-25,50,50);
		} else {
			image(this.image[1],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2+offsetY-25,50,50);
		}
		if(using){
			Body.setPosition(this.content.body,{
				x: this.content.body.position.x,
				y: this.content.body.position.y-1,
			});
			using--;
			i--;
		}
		if(i===0&&this.content.activated===1){
			this.content.activated=2;
		}
	};
	this.addContent=function(content,arr){
		arr.push(this.content= content==="mushroom"? new Mushroom(x,y) : new Coin(x,y));
	};
	this.use=function(p){
		this.used=true;
		if(this.content.activated===undefined){
			this.content.taken=true;
			p.coins++;
		} else {
			using=50;
			this.content.activated=1;
		}
	};
}

function Spike(x, y, instantDeath=false) {
	this.body = Bodies.rectangle(x*50+25, y*50+25, 50, 50, {friction: 0,restitution: 0,isStatic: true});
	this.image=loadImage("media/spike.png");
	this.instantDeath=instantDeath;
	World.add(world, this.body);
	this.show = function(p) {
		var pos = this.body.position;
		var sumx=0;
		var sumy=0;
		var ps=0;
		for(var i=0;i<p.length;i++){
			if(p[i].body){
				sumx+=p[i].body.position.x;
				sumy+=p[i].body.position.y;
				ps++;
			}
		}
		sumx/=ps;
		sumy/=ps;
		// push();
		// translate((pos.x-sumx)+width/2, (pos.y-sumy)+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(0, 0, 0);
		// rect(0, 0, 51, 51);
		// pop();
		if(!this.instantDeath) image(this.image,(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY,50,50);
	};
}

function Goomba(x, y, dir=1) {
	this.dead=false;
	this.body = Bodies.rectangle(x*50+25, y*50+25, 50, 50, {friction: 0,restitution: 0,collisionFilter:{group:-1}, inertia:Infinity, isStatic:false});
	this.dir=dir;
	this.tsensor = Bodies.rectangle(x*50+25, y*50+25, 50, 10, { isSensor:true, inertia:Infinity});
	this.lsensora = Bodies.rectangle(x*50+25, y*50+25, 10, 10, { isSensor:true, inertia:Infinity});
	this.lsensorb = Bodies.rectangle(x*50+25, y*50+25, 1, 10, { isSensor:true, inertia:Infinity});
	this.rsensora = Bodies.rectangle(x*50+25, y*50+25, 10, 10, { isSensor:true, inertia:Infinity});
	this.rsensorb = Bodies.rectangle(x*50+25, y*50+25, 1, 10, { isSensor:true, inertia:Infinity});
	this.c1 = Constraint.create({
		bodyA:this.body,
		bodyB:this.tsensor,
		pointA:{x: 0, y: -25},
		pointB:{x: 0, y: 1},
		length: 0,
		damping:1,
		stiffness:1
	});
	this.c2a = Constraint.create({
		bodyA:this.body,
		bodyB:this.lsensora,
		pointA:{x: -25, y: 0},
		pointB:{x: -5, y: 0},
		length: 0,
		damping:1,
		stiffness:1
	});
	this.c3a = Constraint.create({
		bodyA:this.body,
		bodyB:this.rsensora,
		pointA:{x: 25, y: 0},
		pointB:{x: 5, y: 0},
		length: 0,
		damping:1,
		stiffness:1
	});
	this.c2b = Constraint.create({
		bodyA:this.body,
		bodyB:this.lsensorb,
		pointA:{x: -26, y: 30},
		pointB:{x: 5, y: -2.5},
		length: 0,
		damping:1,
		stiffness:1
	});
	this.c3b = Constraint.create({
		bodyA:this.body,
		bodyB:this.rsensorb,
		pointA:{x: 26, y: 30},
		pointB:{x: -5, y: -2.5},
		length: 0,
		damping:1,
		stiffness:1
	});
	this.image=[loadImage("media/goomba1.png"),loadImage("media/goomba2.png"),loadImage("media/goomba3.png")];
	World.add(world, this.body);
	World.add(world, this.tsensor);
	World.add(world, this.lsensora);
	World.add(world, this.rsensora);
	World.add(world, this.lsensorb);
	World.add(world, this.rsensorb);
	World.add(world,this.c1);
	World.add(world,this.c2a);
	World.add(world,this.c3a);
	World.add(world,this.c2b);
	World.add(world,this.c3b);
	let count=0;
	let dcount=-1;
	this.show = function(p) {
		var pos = this.body.position;
		var sumx=0;
		var sumy=0;
		var ps=0;
		for(var i=0;i<p.length;i++){
			if(p[i].body){
				sumx+=p[i].body.position.x;
				sumy+=p[i].body.position.y;
				ps++;
			}
		}
		sumx/=ps;
		sumy/=ps;
		// push();
		// translate((pos.x-sumx)+width/2, (pos.y-sumy)+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(0, 0, 0);
		// rect(0, 0, 51, 51);
		// pop();
		if(!this.dead){
			image(this.image[Math.floor(count)],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY,50,50);
			count+=0.1;
			count=count%2;
		} else {
			if(dcount===-1){
				dcount=5;
			} else {
				if(dcount>0) dcount-=0.1;
			}
			if(dcount>0) image(this.image[2],(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY,50,50);
		}
		// pos = this.lsensora.position;
		// push();
		// translate((pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY);
		// rectMode(CENTER);
		// strokeWeight(0);
		// fill(0);
		// rect(0, 0, 10, 10);
		// pop();
		// pos = this.lsensorb.position;
		// push();
		// translate((pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY);
		// rectMode(CENTER);
		// strokeWeight(0);
		// fill(255);
		// rect(0, 0, 1, 10);
		// pop();
		// pos = this.rsensora.position;
		// push();
		// translate((pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY);
		// rectMode(CENTER);
		// strokeWeight(0);
		// fill(0);
		// rect(0, 0, 10, 10);
		// pop();
		// pos = this.rsensorb.position;
		// push();
		// translate((pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY);
		// rectMode(CENTER);
		// strokeWeight(0);
		// fill(255);
		// rect(0, 0, 1, 10);
		// pop();
	};
	this.logic=function(grounds,bricks,qblocks,spikes,pipes){
		if(!this.dead){
			let right=false;
			let left=false;
			for (var i = 0; i < [].concat(grounds,bricks,qblocks,spikes,pipes).length; i++) {
				if (Matter.SAT.collides(this.rsensorb, [].concat(grounds,bricks,qblocks,spikes,pipes)[i].body).collided) {
					right=true;
					break;
				}
			}
			for (i = 0; i < [].concat(grounds,bricks,qblocks,spikes,pipes).length; i++) {
				if (Matter.SAT.collides(this.rsensora, [].concat(grounds,bricks,qblocks,spikes,pipes)[i].body).collided) {
					right=false;
					break;
				}
			}
			for (i = 0; i < [].concat(grounds,bricks,qblocks,spikes,pipes).length; i++) {
				if (Matter.SAT.collides(this.lsensorb, [].concat(grounds,bricks,qblocks,spikes,pipes)[i].body).collided) {
					left=true;
					break;
				}
			}
			for (i = 0; i < [].concat(grounds,bricks,qblocks,spikes,pipes).length; i++) {
				if (Matter.SAT.collides(this.lsensora, [].concat(grounds,bricks,qblocks,spikes,pipes)[i].body).collided) {
					left=false;
					break;
				}
			}
			this.dir = (right ? !left : left)? right-left : this.dir;
			// console.log(this.dir);
			Body.setVelocity(this.body,{
				x: this.dir,
				y: this.body.velocity.y
			});
			// pdir=this.dir;
		} else {
			this.body.isStatic=true;
		}
	};
}

function Mushroom(x, y, activated=0) {
	this.body = Bodies.rectangle(x*50+25, y*50+25, 50, 50, {isStatic:true,isSensor:true});
	this.used=false;
	this.activated=activated;
	this.image=loadImage("media/mushroom1.png");
	World.add(world, this.body);
	this.show = function(p) {
		var pos = this.body.position;
		var sumx=0;
		var sumy=0;
		var ps=0;
		for(var i=0;i<p.length;i++){
			if(p[i].body){
				sumx+=p[i].body.position.x;
				sumy+=p[i].body.position.y;
				ps++;
			}
		}
		sumx/=ps;
		sumy/=ps;
		if(this.activated>0&&!this.used) image(this.image,(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25+offsetY,50,50);
		// push();
		// translate((pos.x-sumx)+width/2, (pos.y-sumy)+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(108, 160, 220);
		// rect(0, 0, 51, 51);
		// pop();
	};
}
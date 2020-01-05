function Player(x, y, up=UP_ARROW, right=RIGHT_ARROW, left=LEFT_ARROW) {
	this.imagesA=[loadImage("media/idleA.png"),loadImage("media/walk1A.png"),loadImage("media/walk2A.png"),loadImage("media/walk3A.png"),loadImage("media/jumpA.png"),loadImage("media/slideA.png")];
	this.imagesB=[loadImage("media/idleB.png"),loadImage("media/walk1B.png"),loadImage("media/walk2B.png"),loadImage("media/walk3B.png"),loadImage("media/jumpB.png"),loadImage("media/slideB.png")];
	this.keys=[up, right, left];
	this.canJump=0;
	let move = 1;
	let jump = false;
	let slide=0;
	let count=0;
	this.body = Bodies.rectangle(x, y, 51, 48, {friction:0.2, restitution:0, inertia:Infinity, chamfer:50});
	this.sensor = Bodies.rectangle(x, y, 51, 1, {isSensor:true, inertia:Infinity});
	this.lsensor = Bodies.rectangle(x, y, 1, 40, { isSensor:true, inertia:Infinity});
	this.rsensor = Bodies.rectangle(x, y, 1, 40, { isSensor:true, inertia:Infinity});
	this.c1 = Constraint.create({
		bodyA:this.body,
		bodyB:this.sensor,
		pointA:{x: 0, y: 24},
		length: 0,
		damping:1,
		stiffness:1
	});
	this.c2 = Constraint.create({
		bodyA:this.body,
		bodyB:this.lsensor,
		pointA:{x: -26, y: 0},
		length: 0,
		damping:1,
		stiffness:1
	});
	this.c3 = Constraint.create({
		bodyA:this.body,
		bodyB:this.rsensor,
		pointA:{x: 26, y: 0},
		length: 0,
		damping:1,
		stiffness:1
	});
	World.add(world, this.body);
	World.add(world, this.sensor);
	World.add(world, this.lsensor);
	World.add(world, this.rsensor);
	World.add(world, this.c1);
	World.add(world, this.c2);
	World.add(world, this.c3);
	this.created=true;
	this.init=function(){
		if(!this.created){
			this.body = Bodies.rectangle(x, y, 51, 48, {friction:0.2, restitution:0, inertia:Infinity, chamfer:50});
			this.sensor = Bodies.rectangle(x, y, 51, 1, {isSensor:true, inertia:Infinity});
			this.lsensor = Bodies.rectangle(x, y, 1, 40, { isSensor:true, inertia:Infinity});
			this.rsensor = Bodies.rectangle(x, y, 1, 40, { isSensor:true, inertia:Infinity});
			this.c1 = Constraint.create({
				bodyA:this.body,
				bodyB:this.sensor,
				pointA:{x: 0, y: 24},
				length: 0,
				damping:1,
				stiffness:1
			});
			this.c2 = Constraint.create({
				bodyA:this.body,
				bodyB:this.lsensor,
				pointA:{x: -26, y: 0},
				length: 0,
				damping:1,
				stiffness:1
			});
			this.c3 = Constraint.create({
				bodyA:this.body,
				bodyB:this.rsensor,
				pointA:{x: 26, y: 0},
				length: 0,
				damping:1,
				stiffness:1
			});
			World.add(world, this.body);
			World.add(world, this.sensor);
			World.add(world, this.lsensor);
			World.add(world, this.rsensor);
			World.add(world, this.c1);
			World.add(world, this.c2);
			World.add(world, this.c3);
			this.created=true;
		}
	};
	this.remove=function(){
		if(this.created){
			World.remove(world,this.body);
			World.remove(world,this.sensor);
			World.remove(world,this.lsensor);
			World.remove(world,this.rsensor);
			World.remove(world,this.c1);
			World.remove(world,this.c2);
			World.remove(world,this.c3);
			this.body = undefined;
			this.sensor = undefined;
			this.lsensor = undefined;
			this.rsensor = undefined;
			this.c = undefined;
			this.created=false;
		}
	};
	this.move=function(dir){
		if(this.created){
			Body.setVelocity(this.body, {
			  x: 5*dir,
			  y: this.body.velocity.y
			});
		}
	};
	this.jump=function(){
		if(this.created){
			if(this.canJump){
				jump=true;
				Body.setVelocity(this.body, {
				  x: this.body.velocity.x,
				  y: -15
				});
				this.canJump=0;
				slide=0;
			}
		}
	};
	this.logic=function(grounds,flags,players){
		if(this.created){
			let collision;
			for (var j = 0; j < grounds.length; j++) {
				collision = Matter.SAT.collides(this.sensor, grounds[j].body);
				if (collision.collided) {
					jump=false;
				}
			}
			for (var k = 0; k < players.length; k++) {
				if(players[k]!==this && players[k].body !== undefined){
					collision = Matter.SAT.collides(this.body, players[k].body);
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
			for (var n = 0; n < flags.length; n++) {
				collision = Matter.SAT.collides(this.body, flags[n].body);
				if (collision.collided) {
					jump=false;
				}
			}
			for (var i = 0; i < flags.length; i++) {
				collision = Matter.SAT.collides(this.body, flags[i].body);
				if (collision.collided) {
					genWorld(flags[i].next);
				}
			}
			for (var l = 0; l < spikes.length; l++) {
				collision = Matter.SAT.collides(this.body, spikes[l].body);
				if (collision.collided) {
					this.remove();
					this.init();
					// console.log("dead");
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
			} else {
				count=0;
				this.move(0);
				if(move===2){
					move=0;
				}
				if(move===3){
					move=1;
				}
			}
			if (keyIsDown(this.keys[0])) {
				this.jump();
			} else {
				this.canJump=0;
				slide=0;
				for (var i = 0; i < grounds.length; i++) {
					if (Matter.SAT.collides(this.lsensor, grounds[i].body).collided) {
						slide=2;
					} else if (Matter.SAT.collides(this.rsensor, grounds[i].body).collided) {
						slide=1;
					}
				}
				for (var j = 0; j < grounds.length; j++) {
					collision = Matter.SAT.collides(this.sensor, grounds[j].body);
					if (collision.collided) {
						this.canJump=1;
						jump=false;
						// if(!Matter.SAT.collides(this.lsensor, walls[j].body).collided&&!Matter.SAT.collides(this.rsensor, walls[j].body).collided){
							// slide=0;
						// }
					}
				}
				// for (var k = 0; k < players.length; k++) {
					// if(players[k]!==this && players[k].body !== undefined){
						// collision = Matter.SAT.collides(this.body, players[k].body);
						// if (collision.collided) {
							// this.canJump=1;
							// jump=false;
						// }
					// }
				// }
				// for (var m = 0; m < boxes.length; m++) {
					// collision = Matter.SAT.collides(this.body, boxes[m].body);
					// if (collision.collided) {
						// this.canJump=1;
						// jump=false;
					// }
				// }
				// for (var n = 0; n < finish.length; n++) {
					// collision = Matter.SAT.collides(this.body, finish[n].body);
					// if (collision.collided) {
						// this.canJump=1;
						// jump=false;
					// }
				// }
			}
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
			if(ps){
				sumx/=ps;
				sumy/=ps;
			}
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
			if(jump){
				if(move%2===0){
					image(media[4],(pos.x-sumx)+width/2-25.5,(pos.y-sumy)+height/2-24,51,48);
				} else if(move%2===1){
					image(media[4],(pos.x-sumx)+width/2-25.5,(pos.y-sumy)+height/2-24,51,48);
				}
			} else {
				if(slide!==0){
					image(media[5],(pos.x-sumx)+width/2-25.5,(pos.y-sumy)+height/2-24,51,48);
				} else {
					switch(move){
						case 0:
							image(media[0],(pos.x-sumx)+width/2-25.5,(pos.y-sumy)+height/2-24,51,48);
							break;
						case 1:
							image(media[0],(pos.x-sumx)+width/2-25.5,(pos.y-sumy)+height/2-24,51,48);
							break;
						case 2:
							image(media[Math.floor(count)+1],(pos.x-sumx)+width/2-25.5,(pos.y-sumy)+height/2-24,51,48);
							break;
						case 3:
							image(media[Math.floor(count)+1],(pos.x-sumx)+width/2-25.5,(pos.y-sumy)+height/2-24,51,48);
							break;
					}
				}
			}
			// rect((pos.x-sumx)+width/2,(pos.y-sumy)+height/2,51,48);
			// translate(pos.x+width/2,pos.y);
			// fill(r,g,b);
			// rect(0,0,51,48);
			// fill(155, 118, 83);
			// translate(pos.x+width/2,pos.y);
			// push();
			// translate(width/2, height/2+150);
			// translate(pos.x+width/2, pos.y);
			// pos = this.sensor.position;
			// push();
			// translate((pos.x-sumx)+width/2, (pos.y-sumy)+height/2);
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
		// var size=50;
		// var pos=[0,0,30];
		// var color=[r,g,b];
		// if(color[0]===255 && color[1]===0 && color[2]===0){
			// pos=[size,size,pos[2]];
		// } else if(color[0]===0 && color[1]===0 && color[2]===255){
			// pos=[width-size,size,pos[2]];
		// } else if(color[0]===0 && color[1]===255 && color[2]===0){
			// pos=[width-size,height-size,pos[2]];
		// } else if(color[0]===255 && color[1]===255 && color[2]===0){
			// pos=[size,height-size,pos[2]];
		// }
		// if(this.created){
			// pos[2]=150;
		// }
		// push();
		// rectMode(CENTER);
		// noStroke();
		// fill(155, 118, 83);
		// fill(r, g, b, pos[2]);
		// rect(pos[0], pos[1], size, size);
		// pop();
	}
	this.init();
}

function Flag(x, y, next) {
	this.body = Bodies.rectangle(x, y, 50, 500, {friction: 1,restitution: 0,isStatic: true});
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
		if(ps){
			sumx/=ps;
			sumy/=ps;
		} else {
			sumx=0;
			sumy=200;
		}
		// push();
		// translate((pos.x-sumx)+width/2, (pos.y-sumy)+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(155, 118, 83);
		// fill(255, 136, 0);
		// rect(0, 0, 51, 51);
		// pop();
		image(this.image,(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-250,50,500);
	};
}

function Ground(x,y,w,h,type="wall") {
	this.body = Bodies.rectangle(x, y, w, h, {friction: 1,restitution: 0,isStatic: true});
	this.image = type==="ground"? loadImage("media/wall1.png") : loadImage("media/wall2.png");
	World.add(world, this.body);
	this.show = function(p) {
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
		if(ps){
			sumx/=ps;
			sumy/=ps;
		} else {
			sumx=0;
			sumy=200;
		}
		// push();
		// translate(-sumx+width/2, 1000-sumy+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(155, 118, 83);
		// fill(0, 0, 0);
		// rect(0, 0, 1000, 500);
		// pop();
		for(let i=-h/100;i<h/100;i++){
			for(let j=-w/100;j<w/100;j++){
				image(this.image,(x-sumx)+width/2+j*50,(y-sumy)+height/2+i*50,50,50);
			}
		}
	};
}

function Spike(x, y) {
	this.body = Bodies.rectangle(x, y, 50, 50, {friction: 1,restitution: 0,isStatic: true});
	this.image=loadImage("media/spike.png");
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
		if(ps){
			sumx/=ps;
			sumy/=ps;
		} else {
			sumx=0;
			sumy=200;
		}
		// push();
		// translate((pos.x-sumx)+width/2, (pos.y-sumy)+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(0, 0, 0);
		// rect(0, 0, 51, 51);
		// pop();
		image(this.image,(pos.x-sumx)+width/2-25,(pos.y-sumy)+height/2-25,50,50);
	};
}

// function Box(x, y) {
	// this.body = Bodies.rectangle(x, y, 51, 51, {friction: 1,restitution: 0, chamfer:5 });
	// World.add(world, this.body);
	// this.show = function(p) {
		// var pos = this.body.position;
		// var sumx=0;
		// var sumy=0;
		// var ps=0;
		// for(var i=0;i<p.length;i++){
			// if(p[i].body){
				// sumx+=p[i].body.position.x;
				// sumy+=p[i].body.position.y;
				// ps++;
			// }
		// }
		// if(ps){
			// sumx/=ps;
			// sumy/=ps;
		// } else {
			// sumx=0;
			// sumy=200;
		// }
		// push();
		// translate((pos.x-sumx)+width/2, (pos.y-sumy)+height/2);
		// translate(pos.x+width/2,pos.y);
		// rectMode(CENTER);
		// noStroke();
		// fill(108, 160, 220);
		// rect(0, 0, 51, 51);
		// pop();
	// };
// }

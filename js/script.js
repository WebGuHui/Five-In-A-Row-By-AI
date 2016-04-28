window.onload = function(){
	var doc = document.getElementById('canvas');
	var context = doc.getContext('2d');
	var me = true;
	var chess = {};

	var over = false;
	// 赢法数组
	var wins = [];

	//赢法的统计数组
	var myWin = [];
	var computerWin = [];

	for(var i=0;i<15;i++) {
		wins[i] = [];
		for(var j=0;j<15;j++) {
			wins[i][j] = [];
			chess[[i,j]] = 0;
		}
	}

	var count = 0;
	//横线赢法
	for(var i=0;i<15;i++) {
		for(var j=0;j<11;j++) {
			for(var k=0;k<5;k++) {
				wins[i][j+k][count] = true;
			}
			count++;
		}
	}

	//竖线赢法
	for(var i=0;i<15;i++) {
		for(var j=0;j<11;j++) {
			for(var k=0;k<5;k++) {
				wins[j+k][i][count] = true;
			}
			count++;
		}
	}

	//斜线赢法
	for(var i=0;i<11;i++) {
		for(var j=0;j<11;j++) {
			for(var k=0;k<5;k++) {
				wins[i+k][j+k][count] = true;
			}
			count++;
		}
	}

	//反斜线赢法
	for(var i=0;i<11;i++) {
		for(var j=14;j>3;j--) {
			for(var k=0;k<5;k++) {
				wins[i+k][j-k][count] = true;
			}
			count++;
		}
	}

	console.log(count);
	for(var i=0;i<count;i++) {
		myWin[i] = 0;
		computerWin[i] = 0;
	}


	context.strokeStyle = "#999";

	var img = new Image();
	img.onload = function(){
		// context.drawImage(img,0,0,450,450);
		context.fillStyle = '#f0a900';
		context.fillRect(0,0,doc.width,doc.height);
		console.log(doz = doc);
		drawCanvas();
	}
	img.src = "../bg.jpg";

	var drawCanvas = function(){
		for(var i=0;i<15;i++) {
			context.moveTo(15 + i*30,15);
			context.lineTo(15 + i*30, 435);
			context.stroke();
			context.moveTo(15,15 + i*30);
			context.lineTo(435,15 + i*30);
			context.stroke();
		}
	}

	var oneStep = function(i,j,me) {
		context.beginPath();
		context.arc( 15+i*30,15+j*30,13,0,2*Math.PI);
		context.closePath();
		var gradient = context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
		if(me) {
			gradient.addColorStop(0,'#0A0A0A');
			gradient.addColorStop(1,'#636766');
		} else {
			gradient.addColorStop(0,'#d1d1d1');
			gradient.addColorStop(1,'#f9f9f9');
		}
		context.fillStyle = gradient;
		context.fill();
	}
	// context.moveTo(0,0);
	// context.lineTo(450,450);
	// context.stroke();

	doc.addEventListener('click',function(event){
		if(over) {
			return ;
		}
		if(!me) {
			return ; 
		}
		var x = event.offsetX;
		var y = event.offsetY;
		var i = Math.floor(x/30);
		var j = Math.floor(y/30);
		// console.log(x,y);
		if(chess[[i,j]] == 0) {
			oneStep(i,j,me);
			chess[[i,j]] = 1;
			//等于1为本人落棋
			//遍历是否赢
			for(var k=0;k<count;k++) {
				if(wins[i][j][k]) {
					//某点在I,J坐标上拥有赢法、即可为有解
					myWin[k]++;
					computerWin[k] = 6;
					if(myWin[k] == 5) {
						window.alert('you win');
						over = true;
					}
				}
			}
			if(!over) {
				me = !me;
				computerAI();
			}
		}
	});

	var computerAI = function() {
		console.log(123);
		var myScore = [];
		var computerScore = [];
		var max = 0;
		var u=0,v=0;
		for(var i=0;i<15;i++) {
			myScore[i] = [];
			computerScore[i] = [];
			for(var j=0;j<15;j++) {
				myScore[i][j] = 0;
				computerScore[i][j] = 0;
			}
		}

		for(var i=0;i<15;i++) {
			for(var j=0;j<15;j++) {
				if(chess[[i,j]] == 0) {
					for(var k=0;k<count;k++) {
						if(wins[i][j][k]) {
							if(myWin[k] == 1) {
								myScore[i][j] += 200;
							} else if(myWin[k] == 2) {
								myScore[i][j] += 400;
							} else if(myWin[k] == 3) {
								myScore[i][j] += 2000;
							} else if(myWin[k] == 4) {
								myScore[i][j] += 10000;
							} 
							if(computerWin[k] == 1) {
								computerScore[i][j] += 220;
							} else if(computerWin[k] == 2) {
								computerScore[i][j] += 420;
							} else if(computerWin[k] == 3) {
								computerScore[i][j] += 2100;
							} else if(computerWin[k] == 4) {
								computerScore[i][j] += 20000;
							} 
							console.log(1);
						}
					}
					if(myScore[i][j] > max) {
						max = myScore[i][j];
						u = i;
						v = j;
					} else if(myScore[i][j] == max) {
						if(computerScore[i][j] > computerScore[u][v]) {
							u = i;
							v = j;
						}
					}
					if(computerScore[i][j] > max) {
						max = computerScore[i][j];
						u = i;
						v = j;
					} else if(computerScore[i][j] == max) {
						if(myScore[i][j] > myScore[u][v]) {
							u = i;
							v = j;
						}
					}
				}
			}
		}
		oneStep(u,v,false);
		chess[[u,v]] = 2;
		//遍历是否赢
		for(var k=0;k<count;k++) {
			if(wins[u][v][k]) {
				//某点在I,J坐标上拥有赢法、即可为有解
				computerWin[k]++;
				myWin[k] = 6;
				if(computerWin[k] == 5) {
					window.alert('computer win');
					over = true;
				}
			}
		}
		if(!over) {
			me = !me;
		}
	}
}
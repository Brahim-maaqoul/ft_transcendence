import { Paddle } from "./component";


export class Game {
	gameId: number;
	playerId1: number;
	playerId2?: number;
	socket: { socket1: string, socket2: string };
	bot: boolean;
	width: number;
	height: number;
	// ball: Ball;
	// paddle: [Paddle, Paddle];
	ball: { 
		x: number,
		y: number,
		radius: number,
		color: string,
		speed: number,
		velocityX: number,
		velocityY: number,
		direction: boolean
	};
	paddle1: { 
		x: number,
		y: number,
		width: number,
		height: number,
		color: string,
		score: number
	};
	paddle2: { 
		x: number,
		y: number,
		width: number,
		height: number,
		color: string,
		score: number
	};
	net: {
		x: number,
		y: number,
		width: number,
		height: number,
		color: string
	};

	score: [number, number];
	status: string;

	constructor(width: number, height: number){
		this.gameId = 0;
		this.playerId1 = 0;
		// this.playerId2 = ;
		this.socket = { socket1: '', socket2: ''};
		this.bot = true;
		this.width = width;
		this.height = height;
		// this.ball = new Ball();
		// this.paddle = [new Paddle(), new Paddle()];
		this.ball = { 
			x: this.width/2,
			y: this.height/2,
			radius: 10,
			color: 'white',
			speed: 5,
			velocityX: 5,
			velocityY: 5,
			direction: false
		};
		this.paddle1 = { 
			x: 0,
			y: this.height/2 - 100/2,
			width: 10,
			height: 100,
			color: 'white',
			score: 0
		};
		this.paddle2 = { 
			x: this.width - 10,
			y: this.height/2 - 100/2,
			width: 10,
			height: 100,
			color: 'white',
			score: 0
		};
		this.net = {
			x: this.width/2 - 1,
			y: 0,
			width: 2,
			height: 10,
			color: 'white'
		};
		this.score = [0, 0];
		this.status = 'not started';
	}
	get_data(){
		return {
			gameId: this.gameId,
			playerId1: this.playerId1,
			playerId2: this.playerId2,
			socket: this.socket,
			bot: this.bot,
			ball: this.ball,
			paddle1: this.paddle1,
			paddle2: this.paddle2,
			score: this.score,
			status: this.status,
			widht: this.width,
			height: this.height,
			net: this.net
		};
	};
	set_data(data: any){
		this.gameId = data.gameId;
		this.playerId1 = data.playerId1;
		// this.playerId2 = data.playerId2;
		this.socket = data.socket;
		this.bot = data.bot;
		this.ball = data.ball;
		this.paddle1 = data.paddle1;
		this.paddle2 = data.paddle2;
		this.score = data.score;
		this.status = data.status;
	};
	start(){
		this.status = 'started';
		this.render();
	}
	stop(){
		this.status = 'stopped';
	}
	pause(){
		this.status = 'paused';
	}
	startGame(){
		;
	}
	endGame(){
		;
	}
	render(){
		;
	};
	update(){
		;
	};
	drawRect(){
		;
	}
	drawCircle(){
		;
	}
	drawNet(){
		;
	}
	resetBall(){
		;
	}
	checkCollision(){
		;
	}
	handelButtonClick(){
		;
	}
}



	// const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement) => {
	// 	const { width, height } = canvas.getBoundingClientRect();
	// 	if (canvas.width !== width || canvas.height !== height) {
	// 		canvas.width = width;
	// 		canvas.height = height;
	// 		return true;
	// 	}
	// 	return false;
	// }

	// const resizeCanvas = (canvas: HTMLCanvasElement) => {
	// 	const { width, height } = canvas.getBoundingClientRect();

	// 	if (canvas.width !== width || canvas.height !== height) {
	// 		const { devicePixelRatio:ratio=1 } = window;
	// 		const context = canvas.getContext('2d');
	// 		canvas.width = width * ratio;
	// 		canvas.height = height * ratio;
	// 		context?.scale(ratio, ratio);
	// 		return true;
	// 	}
	// 	return false;
	// }

	// const draw = (frameCount: number) => {
	// 	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	// 	context.fillStyle = 'white';
	// 	context.fillRect(0, 0, 50, 75);
	// 	context.fillStyle = 'red';
	// 	context.beginPath();
	// 	context.arc(300, 350, 100, 0, Math.PI*2, false);
	// 	context.closePath();
	// 	context.fill();
	// }

	// const drawRect = (x: number, y: number, width: number, height: number, color: string) => {
	// 	const context = contextRef.current;
	// 	if (context){
	// 		context.fillStyle = color;
	// 		context.fillRect(x, y, width, height);
	// 	}
	// };

	// const drawCircle = (x: number, y: number, radius: number, color: string, direction: boolean) => {
	// 	const context = contextRef.current;
	// 	if (context){
	// 		context.fillStyle = color;
	// 		context.beginPath();
	// 		context.arc(x, y, radius, 0, Math.PI*2, direction);
	// 		context.closePath();
	// 		context.fill();
	// 	}
	// }

	// const drawNet = () => {
	// 	// const context = contextRef.current;
	// 	// if (context){
	// 	// 	context.fillStyle = 'white';
	// 	// 	context.fillRect(WIDTH/2 - 1, 0, 2, HEIGHT);
	// 	// }
	// 	for (let i=0;i<=HEIGHT;i+=15){
	// 		drawRect(net.x, net.y + i, net.width, net.height, net.color);
	// 	}
	// }

	// const render = () => {
	// 	const context = contextRef.current;
	// 	if (context){
	// 		drawRect(0, 0, WIDTH, HEIGHT, 'black');
	// 		drawNet();
	// 		drawRect(playerPaddelPosition.x, playerPaddelPosition.y, playerPaddel.width, playerPaddel.height, playerPaddel.color);
	// 		drawRect(botPaddelPosition.x, botPaddelPosition.y, botPaddel.width, botPaddel.height, botPaddel.color);
	// 		drawCircle(ballPosition.x, ballPosition.y, ball.radius, ball.color, ball.direction);
	// 	}
	// }

	// const resetBall = () => {
	// 	ball.x = WIDTH/2;
	// 	ball.y = HEIGHT/2;
	// 	ball.speed = 5;
	// 	ball.velocityX = -ball.velocityX;
	// }

	// const update = () => {

	// 	if (ball.x - ball.radius < 0){
	// 		botPaddel.score++;
	// 		resetBall;
	// 	} else if (ball.x + ball.radius > WIDTH){
	// 		playerPaddel.score++;
	// 		resetBall;
	// 	}

	// 	ball.x += ball.velocityX;
	// 	ball.y += ball.velocityY;
	// 	if (ball.y + ball.radius > HEIGHT || ball.y - ball.radius < 0){
	// 		ball.velocityY = -ball.velocityY;
	// 	}
	// 	let player = (ball.x < WIDTH/2) ? playerPaddel : botPaddel;
	// 	if (collision(ball, player)){
	// 		let collidePoint = (ball.y - (player.y + player.height/2));
	// 		collidePoint /= (player.height/2);
	// 		let angleRad = collidePoint * (Math.PI/4);
	// 		let direction = (ball.x < WIDTH/2) ? 1 : -1;
	
	// 		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
	// 		ball.velocityY = direction * ball.speed * Math.sin(angleRad);
	// 		ball.speed += 0.1;
	// 	}
	// }

	// const collision = (b: Ball, p: paddel) => {
	// 	const btop = b.y - b.radius;
	// 	const bbottom = b.y + b.radius;
	// 	const bleft = b.x - b.radius;
	// 	const bright = b.x + b.radius;

	// 	const ptop = p.y;
	// 	const pbottom = p.y + p.height;
	// 	const pleft = p.x;
	// 	const pright = p.x + p.width;

	// 	return bright > pleft && bbottom > ptop && bleft < pright && btop < pbottom;
	
	// }

	// const fps = 50;
	// const game = () => {
	// 	update();
	// 	render();
	// }


	// const handelButtonClick = () => {
	// 	console.log('hello form client ------------------------------------------------------------------------------');
	// 	socket.emit('helloEvent');
	// }
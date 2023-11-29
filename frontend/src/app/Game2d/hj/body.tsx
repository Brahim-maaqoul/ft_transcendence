import { Canvas } from '@react-three/fiber';
import React, { use, useEffect, useRef, useState } from 'react';
import { set } from 'react-hook-form';
import { RGBAFormat } from 'three';
// import { Game } from '../types/newClass';
import { Game } from '../types/hjGame';
// import { Game } from '../../../../../backend/src/game/classes/game.class';

const HEIGHT:number = 400;
const WIDTH:number = 600;

/*
export class paddel {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
	score: number;
	constructor(x:number, y:number, width:number, height:number, color:string, score:number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.score = score;
	}
}
export class Ball {
	x: number;
	y: number;
	radius: number;
	speed: number;
	velocityX: number;
	velocityY: number;
	color: string;
	direction: boolean;
	constructor(x:number, y:number, radius:number, speed:number, velocityX:number, velocityY:number, color:string, direction:boolean) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed = speed;
		this.velocityX = velocityX;
		this.velocityY = velocityY;
		this.color = color;
		this.direction = direction;
	}
}
export class Net {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
	constructor(x:number, y:number, width:number, height:number, color:string) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}
}
*/

const gameState: Game = new Game(WIDTH, HEIGHT);

import io from 'socket.io-client'
import { color } from 'framer-motion';

const socket = io('http://localhost:8000/Game2d')

export function HJ() {

	// const playerPaddel = new paddel(0, HEIGHT/2 - 100/2, 10, 100, 'white', 0);
	// const botPaddel = new paddel(WIDTH-10, HEIGHT/2 - 100/2, 10, 100, 'red', 0);
	// const ball = new Ball(WIDTH/2, HEIGHT/2, 10, 5, 5, 5, 'black', false);
	// const net = new Net(WIDTH/2 - 1, 0, 2, 10, 'white');

	// const [ballPosition, setBallPosition] = useState({x: WIDTH/2, y: HEIGHT/2});
	// const [playerPaddelPosition, setPlayerPaddelPosition] = useState({x: 0, y: HEIGHT/2 - 100/2});
	// const [botPaddelPosition, setBotPaddelPosition] = useState({x: WIDTH-10, y: HEIGHT/2 - 100/2});

	const canvasRef = useRef<HTMLCanvasElement>(null);
	// const contextRef = useRef<CanvasRenderingContext2D | null>(null);
	const contextRef = canvasRef.current?.getContext('2d');


	const [gameData, setGameData] = useState(gameState.get_data());
	const fps = 50;

	/*
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas){
			const context = canvas.getContext('2d');
		}
		const handelKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				// socket.emit('stopGame');
				setGameData(() => {
					gameState.stop();
					return gameState.get_data();
				});
			}
			if (event.key === ' ') {
				// socket.emit('startGame', {...gameData, status: 'start'});
				setGameData(() => {
					gameState.start();
					return gameState.get_data();
				});
			}
			if (event.key === 'a' || event.key === 'A', {}){
				// socket.emit('changeScale');
				;
			}
			if (event.key === 'ArrowUp' || event.key === 'ArrowLeft'){
				// socket.emit('move_left');
				;
			}
			if (event.key === 'ArrowDown' || event.key === 'ArrowRight'){
				// socket.emit('move_right');
				;
			}
			if (event.key === 'x' || event.key === 'X'){
				// socket.emit('rotate_pos');
				;
			}
			if (event.key === 'c' || event.key === 'C'){
				// socket.emit('rotate_neg');
				;
			}
		};
		
		// socket.on('gaming', (data) => {
		;
		// socket.on('gameUpdate', (data) => {
		// 	console.log('gaming in client ------------------------------------------------------------------------------');
		// 	setGameData(data);
		// });
		
		document.addEventListener('keydown', handelKeyDown);
		return () => {
			document.removeEventListener('keydown', handelKeyDown);
			// setGameData(() => { 
			// 	// game.status = 'stop';
			// 	return match.get_data(); });
			// socket.off('gaming');
			;
			// socket.off('gameUpdate');
		};
	}, []);
	*/



	// work
	// useEffect(() => {
	// 	const canvas = canvasRef.current;
	// 	const context = canvas?.getContext('2d');
	// 	if (context){
	// 		contextRef.current = context;

	// 		const updateGame = () => {
	// 			setBallPosition({ x: ballPosition.x + 2, y: ballPosition.y + 0 });
	// 			setBotPaddelPosition((prev) => ({ x: ballPosition.x, y: ballPosition.y + 1 }));

	// 			requestAnimationFrame(updateGame);
	// 		};
	// 		requestAnimationFrame(updateGame);
	// 		return () => {
	// 			cancelAnimationFrame(updateGame as any);
	// 		};
	// 	}
	// }, []);

	// work
	// useEffect(() => {
	// 	const handelKeyDown = (e: KeyboardEvent) => {
	// 		if (e.key === 'ArrowUp' && playerPaddelPosition.y > 0) {
	// 			setPlayerPaddelPosition((prev) => ({x: prev.x, y: prev.y - 10}));
	// 		} else if (e.key === 'ArrowDown' && playerPaddelPosition.y < HEIGHT - playerPaddel.height) {
	// 			setPlayerPaddelPosition((prev) => ({...prev, y: prev.y + 10}));
	// 		}
	// 	};

	// 	document.addEventListener('keydown', handelKeyDown);

	// 	return () => {
	// 		document.removeEventListener('keydown', handelKeyDown);
	// 	}

	// }, [playerPaddelPosition]);
	
	
	// work
	useEffect(() => {
		// const context = contextRef.current;
		// if (context){
		// 	context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		// 	// gameState.drawRect(context);	
		// 	drawRect(gameData.paddle1.x, gameData.paddle1.y, gameData.paddle1.width, gameData.paddle1.height, gameData.paddle1.color);	
		// 	drawRect(gameData.paddle2.x, gameData.paddle2.y, gameData.paddle2.width, gameData.paddle2.height, gameData.paddle2.color);
		// 	drawCircle();

		// 	context.fillStyle = 'black';
		// 	// Add your additional code here
		// 	// context.fillRect(100, 200, context.canvas.width, context.canvas.height);
		// 	context.fillRect(100, 200, 50, 75);
		// 	context.fillStyle = 'red';
		// 	context.beginPath();
		// 	context.arc(300, 350, 100, 0, Math.PI*2, false);
		// 	context.closePath();
		// 	let rectX = 0;
		// 	const render = () => {
		// 		drawRect(0, 0, 600, 400, 'black');
		// 		drawRect(rectX, 100, 100, 100, 'white');
		// 		rectX += 100;
		// 		animationFrameId = window.requestAnimationFrame(render);
		// 	}
		// }
		const interval = setInterval(() => {
			game();
		}, 1000/fps);
		return () => {
			clearInterval(interval);
		}
	}, []);

	
	function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
		const { width, height } = canvas.getBoundingClientRect();
		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;
			return true;
		}
		return false;
	}

	function resizeCanvas(canvas: HTMLCanvasElement){
		const { width, height } = canvas.getBoundingClientRect();

		if (canvas.width !== width || canvas.height !== height) {
			const { devicePixelRatio:ratio=1 } = window;
			const context = canvas.getContext('2d');
			canvas.width = width * ratio;
			canvas.height = height * ratio;
			context?.scale(ratio, ratio);
			return true;
		}
		return false;
	}

	function draw (frameCount: number) {
		contextRef.clearRect(0, 0, contextRef.canvas.width, contextRef.canvas.height);
		contextRef.fillStyle = 'white';
		contextRef.fillRect(0, 0, 50, 75);
		contextRef.fillStyle = 'red';
		contextRef.beginPath();
		contextRef.arc(300, 350, 100, 0, Math.PI*2, false);
		contextRef.closePath();
		contextRef.fill();
	}

	function drawRect (x: number, y: number, width: number, height: number, color: string){
		const context = contextRef.current;
		if (context){
			context.fillStyle = color;
			context.fillRect(x, y, width, height);
		}
	};

	function drawCircle (x: number, y: number, radius: number, color: string, direction: boolean) {
		const context = contextRef.current;
		if (context){
			context.fillStyle = color;
			context.beginPath();
			context.arc(x, y, radius, 0, Math.PI*2, direction);
			context.closePath();
			context.fill();
		}
	}

	function drawText (text: string, x: number, y: number, color: string) {
		const context = contextRef.current;
		if (context){
			context.fillStyle = color;
			context.font = '75px fantasy';
			context.fillText(text, x, y);
		}
	}

	function drawNet (x: number, y: number, width: number, height: number, color: string)  {
		for (let i=0;i<=HEIGHT;i+=15){
			drawRect(x, y + i, width, height, color);
		}
	}

	function render (){
		const context = contextRef.current;
		if (context){
			drawRect(0, 0, WIDTH, HEIGHT, 'black');
			drawNet(gameData.net.x, gameData.net.y, gameData.net.width, gameData.net.height, gameData.net.color);
			drawRect(gameData.paddle1.x, gameData.paddle1.y, gameData.paddle1.width, gameData.paddle1.height, gameData.paddle1.color);
			drawRect(gameData.paddle2.x, gameData.paddle2.y, gameData.paddle2.width, gameData.paddle2.height, gameData.paddle2.color);
			drawCircle(gameData.ball.x, gameData.ball.y, gameData.ball.radius, gameData.ball.color, gameData.ball.direction);
		}
	}

	function resetBall () {
		gameData.ball.x = gameData.widht / 2;
		gameData.ball.y = gameData.height / 2;
		gameData.ball.speed = 5;
		gameData.ball.velocityX = - gameData.ball.velocityX;
	}

	function update () {

		if (gameData.ball.x - gameData.ball.radius < 0){
			gameData.score[1]++;
			resetBall;
		} else if (gameData.ball.x + gameData.ball.radius > WIDTH){
			gameData.score[0]++;
			resetBall;
		}

		gameData.ball.x += gameData.ball.velocityX;
		gameData.ball.y += gameData.ball.velocityY;
		if (gameData.ball.y + gameData.ball.radius > HEIGHT || gameData.ball.y - gameData.ball.radius < 0){
			gameData.ball.velocityY = -gameData.ball.velocityY;
		}
		let player = (gameData.ball.x < WIDTH/2) ? gameData.paddle1 : gameData.paddle2;
		if (collision(player)){
			let collidePoint = (gameData.ball.y - (player.y + player.height/2));
			collidePoint /= (player.height/2);
			let angleRad = collidePoint * (Math.PI/4);
			let direction = (gameData.ball.x < WIDTH/2) ? 1 : -1;
	
			gameData.ball.velocityX = direction * gameData.ball.speed * Math.cos(angleRad);
			gameData.ball.velocityY = direction * gameData.ball.speed * Math.sin(angleRad);
			gameData.ball.speed += 0.1;
		}
	}

	function collision (p: any) {
		const btop = gameData.ball.y - gameData.ball.radius;
		const bbottom = gameData.ball.y + gameData.ball.radius;
		const bleft = gameData.ball.x - gameData.ball.radius;
		const bright = gameData.ball.x + gameData.ball.radius;

		const ptop = p.y;
		const pbottom = p.y + p.height;
		const pleft = p.x;
		const pright = p.x + p.width;

		return bright > pleft && bbottom > ptop && bleft < pright && btop < pbottom;
	
	}


	function game () {
		update();
		render();
		// setInterval(game, 1000/fps); // call game function 50 times per second
	}


	const handelButtonClick = () => {
		console.log('hello form client ------------------------------------------------------------------------------');
		socket.emit('helloEvent');
	}
	

	// setInterval(game, 1000/fps);

	// useEffect(() => {
	// 	const updateGame = () => {
	// 		setBallPosition({x: ball.x + 2, y: ball.y + 0});
	// 		// setBallPosition((prev) => ({x: prev.x + 2, y: prev.y + 0}));

	// 		// setBotPaddelPosition(ballPosition.y - 50);
	// 		setBotPaddelPosition({x: ball.x, y: ball.y + 1});
	// 		// setBotPaddelPosition((prev) => prev + 1);

	// 		requestAnimationFrame(updateGame);
	// 	};

	// 	requestAnimationFrame(updateGame);
	// }, []);

	// return (
	// 	<canvas id='canvas' width={WIDTH} height={HEIGHT} style={{background: '#808080', display: 'block', margin: '0 auto', position: 'absolute', alignContent: 'center'}}>
	// 		{/* <div className="ball" id="ball" style={{ top: `${gameData.ball.dy}px`, left:`${gameData.ball.dx}px`, backgroundColor: 'blue'}}></div>
	// 		<div className="left-paddel" id="player-paddel" style={{top:`${2000}px`,  width: '100', height: '100', backgroundColor: 'white'}}></div>
	// 	<div className="right-paddel" id="bot-paddel" style={{ top:`100px`, backgroundColor: 'red', width: '50px', height: '50px'}}></div> */}
	// 	</canvas>
	// )
	return <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}/>;
}
"use client"
import Brick from './bricks';

import { Game, GameConfig } from '../types/index';
import { useEffect, useState } from 'react';
const gameState: Game = new Game();
const physic: Game = new Game();

import io from 'socket.io-client'
import { set } from "react-hook-form";
import { PSize, key } from "../types/component";
import { UserProfile, useAuth } from "@/components/providers/AuthContext";
const keys: key = { left: false, right: false, rotate_pos: false, rotate_neg: false, start: false };
function resizePadle(paddle: PSize): PSize {
	paddle.position.x = (paddle.position.x - paddle.width/2) * 0.1;
	paddle.position.y = (paddle.position.y - paddle.height/2) * 0.1*10/6;
	paddle.width= paddle.width * 0.1;
	paddle.height= paddle.height * 0.1 * 10 /6;
	return paddle;

}

function resizeBrick(brick: PSize): PSize {
	brick.position.x = (brick.position.x - brick.width/2) * 0.1;
	brick.position.y = (brick.position.y - brick.height/2) * 0.1*10/6;
	brick.width= brick.width * 0.1;
	brick.height= brick.height * 0.1 * 10 /6;
	return brick;
}

function resizeBall(ball: PSize): PSize {
	ball.position.x = (ball.position.x - ball.width) * 0.1;
	ball.position.y = (ball.position.y - ball.height) * 0.1*10/6;
	ball.width= ball.width * 0.2;
	ball.height= ball.height * 0.2 * 10 /6;
	return ball;
}

function resize(Game: GameConfig): GameConfig
{
	Game.paddle1 = resizePadle(Game.paddle1);
	Game.paddle2 = resizePadle(Game.paddle2);
	Game.ball = Game.ball.map((b) => resizeBall(b));
	Game.bricks = Game.bricks.map((b) => resizeBrick(b));
	return Game;
}



export function Body({ dataUser }: { dataUser: UserProfile }) {
	const { socketchat } = useAuth();
	const socket = socketchat;
	if (!socket) return <></>;

	const [gameData, setGameData] = useState(resize(gameState.get_data()));
	useEffect(() => {
		const handelKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === ' ') {
				keys.start = true;
			}

			if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
				keys.left = true;
			}
			if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
				keys.right = true;
			}
			if (event.key === 'x' || event.key === 'X') {
				keys.rotate_pos = true;
			}
			if (event.key === 'c' || event.key === 'C') {
				keys.rotate_neg = true;
			}
		};
		const handelKeyUp = (event: KeyboardEvent) => {

			if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
				keys.left = false;
			}
			if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
				keys.right = false;
			}
			if (event.key === 'x' || event.key === 'X') {
				keys.rotate_pos = false;
			}
			if (event.key === 'c' || event.key === 'C') {
				keys.rotate_neg = false;
			}
		};
		const interval = setInterval(() => {
			socket.emit('keyGameUpdate', { keys: keys });
		}, 5); //5

		socket.on('gameUpdate', (data) => {
			setGameData(resize(data));
			gameData.player = data.player;
			if (data.status === 'finished') {
				clearInterval(interval);
				socket.off('gameUpdate');
			}
		});

		document.addEventListener('keydown', handelKeyDown);
		document.addEventListener('keyup', handelKeyUp);
		return () => {
			document.removeEventListener('keydown', handelKeyDown);
			document.removeEventListener('keyup', handelKeyUp);
			clearInterval(interval);
			socket.off('gameUpdate');
		};
	}, []);

	return (
		// <div className="absolute max-w-[90vmin] max-h-[90vmin]  top-0 left-0  bottom-0  right-0 m-auto  bg-[#0ff] bg-opacity-5">
		//  	<div className='h-full relative flex flex-col justify-between xl:justify-center  items-center'>
		//  		<div className="flex items-center  justify-between py-5  mx-auto w-[95vw] xl:max-w-[1000px]">
					<div className="bg-[#000]  top-10 left-0  bottom-10  right-0 m-auto rotate-0 relative w-[90%] xl:w-[90%] aspect-[10/6] m-auto">
						<div>

							<div className=' absolute left-[49.75%] right-[49.75%] w-[.5%] sm:w-[.5%] bottom-0 top-0 bg-white'>
							</div>
							<div className="absolute left-1/2 top-[40%] rotate-[270deg] xl:rotate-0 transform -translate-x-1/2 w-1/11 h-1/7 bg-black rounded-full flex items-center justify-center">
								<p className="text-4xl sm:text-8xl md:text-10xl lg:text-12xl xl:text-14xl text-white"
								>

									{gameData.sec < 0 ? "" : 3 - gameData.sec}
								</p>
							</div>
							<div
								style={{
									position: 'absolute',
									left: `${gameData.paddle1.position.x}%`,
									top: `${gameData.paddle1.position.y}%`,
									width: `${gameData.paddle1.width}%`,
									height: `${gameData.paddle1.height}%`,
									backgroundColor: "#fff",
									borderRadius: "1000px",
									transform: `rotate(${gameData.paddle1.rotation}rad)`,
									transition: "transform .1s",
								}}
							></div>
							<div
								className="absolute"
								style={{
									left: `${gameData.paddle2.position.x}%`,
									top: `${gameData.paddle2.position.y}%`,
									width: `${gameData.paddle2.width}%`,
									height: `${gameData.paddle2.height}%`,
									backgroundColor: "#fff",
									borderRadius: "1000px",
									transform: `rotate(${gameData.paddle2.rotation}rad)`,
									transition: "transform .1s",
								}}
							>
							</div>
							{gameData.ball.map((b, id) => {
								return (
									<div key={id}
										style={{
											position: 'absolute',
											left: `${b.position.x}%`,
											top: `${b.position.y}%`,
											width: `${b.width}%`,
											height: `${b.height}%`,
											backgroundColor: "#f0f",
											borderRadius: "100%",
										}}
									>
									</div>)
							})}
							{/* {gameData.bricks.map((b, id) => { return (<Brick key={id} brick={b} />) })} */}

						</div>
					</div>
		//  	// 	{/* </div>
		//  	// </div> */}
		// </div>
	)
}
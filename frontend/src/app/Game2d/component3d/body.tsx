"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sky, PointerLockControls, Text, Trail, OrbitControls, Environment, Stars, RoundedBox, useTexture, useEnvironment, ContactShadows, useProgress, Html } from "@react-three/drei"
import { Physics, RigidBody } from "@react-three/rapier"
import { Ground } from "./ground";
import * as THREE from 'three'
import { Suspense, use, useContext, useRef } from "react";
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import { Game } from '../types/index';
import { useEffect, useState } from 'react';
const gameState: Game = new Game();
const physic: Game = new Game();

import io from 'socket.io-client'
import { set } from "react-hook-form";
import { PSize, key } from "../types/component";

const socket = io('http://localhost:8000/Game2d');
const keys: key = { left: false, right: false, rotate_pos: false, rotate_neg: false, start: false };

export function Body3D() {
	// const [gameData, setConfig] = useState(physic.get_data());
	// const { progress } = useProgress()
	// useEffect(() => {
	// 	const gameLoop = setInterval(() => {
	// 		physic.update()
	// 		setConfig((prevGame) => { return physic.get_data() });
	// 	}, 1);

	// 	const handleKeyDown = (event: KeyboardEvent) => {
	// 		physic.keysPressed.add(event.key)
	// 	};

	// 	const handleKeyUp = (event: KeyboardEvent) => {
	// 		physic.keysPressed.delete(event.key)
	// 	};

	// 	document.addEventListener('keydown', handleKeyDown);
	// 	document.addEventListener('keyup', handleKeyUp);

	// 	return () => {
	// 		clearInterval(gameLoop)
	// 		document.removeEventListener('keydown', handleKeyDown);
	// 		document.addEventListener('keyup', handleKeyUp);
	// 	};
	// }, []);

	const [gameData, setGameData] = useState(gameState.get_data());
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
			// console.log('sockets: ', socket);
			// console.log('sockets id: ', socket.id);
			socket.emit('keyGameUpdate', { keys: keys });
		}, 5); //5


		// socket.on('gaming', (data) => {
		socket.on('gameUpdate', (data) => {
			setGameData(data);
		});

		document.addEventListener('keydown', handelKeyDown);
		document.addEventListener('keyup', handelKeyUp);
		return () => {
			document.removeEventListener('keydown', handelKeyDown);
			document.removeEventListener('keyup', handelKeyUp);
			clearInterval(interval);
			// setGameData(() => { 
			// 	// game.status = 'stop';
			// 	return match.get_data(); });
			// socket.off('gaming');
			socket.off('gameUpdate');
		};
	}, []);

	// const textureLoader = new THREE.TextureLoader();
	// const hdrTexture = textureLoader.load('/game/view.hdr');
	return (
		<>
			<Canvas shadows camera={{ fov: 60, far: 7000, position: [-1200, 500, 0] }} flat linear>
				<Suspense fallback={<Loader />}>

					<ambientLight intensity={0} />
					<Environment files="/game/hdr/night.hdr" background={true} />
					<OrbitControls target={[0, -200, 0]} />
					{/* <Sky sunPosition={[1000, 1000, 1000]} /> */}
					<pointLight castShadow intensity={1} position={[1000, 1000, 1000]} />
					<Physics gravity={[0, 0, 0]}>
						<Ground />
						<Paddle paddle={gameData.paddle1} />
						<Paddle paddle={gameData.paddle2} />

						{gameData.ball.map((b, id) => {
							return (
								<Electron key={id} ball={b} />)
						})}

						{gameData.bricks.map((b, id) => { return <Brick key={id} brick={b} /> })}
						<Wall y={300} />
						<Wall y={-300} />
						<Text
							position={[0, 100, 0]}
							rotation-y={-Math.PI / 2}
							scale={[100, 100, 100]}
							color="white"
							anchorX="center"
							anchorY="middle"
						>
							{gameData.sec >= 0 ? 3 - gameData.sec : gameData.score.p1 + " - " + gameData.score.p2}
						</Text>
						<EffectComposer>
							<Bloom mipmapBlur luminanceThreshold={1} radius={0.7} />
						</EffectComposer>
					</Physics>
				</Suspense>
			</Canvas>
		</>
	);
}

function Loader() {
	const { progress } = useProgress()
	return (
		<Html center >

			<div class="relative">
				<div class="w-20 h-20 border-purple-200 border-2 rounded-full"></div>
				<div class="w-20 h-20 border-purple-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
			</div>
		</Html>

	)

}


function Electron({ radius = 2.75, speed = 6, ball }) {

	const ref = useRef()
	const { x, y } = (ball.position)
	useFrame((state) => {
		if (ref.current && ref.current.position)
			ref.current.position.set(x - 500, -150, y - 300)
	})
	return (
		<group >
			<mesh ref={ref}>
				<sphereGeometry args={[ball.width]} />
				<meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
			</mesh>
		</group>
	)
}




// function Plan() {

//   return (
//     <>
//       <RigidBody colliders="cuboid" type="fixed"  position={[0,-26,50]}>
//         <mesh>
//         <boxGeometry args={[60, 20, 100]} />
//         <meshStandardMaterial color="red" />
//         </mesh>
//       </RigidBody>
//     </>
//   )
// }
// function Ball({ball}) {

//   return (
//     <>
//       <RigidBody colliders="cuboid" type="fixed" restitution={2.1} position={[ball.position.y - 30,-15,ball.position.x]}>
//         <mesh>
//           <sphereGeometry args={[ball.height, 50, 50]} />
//           <meshStandardMaterial />
//         </mesh>
//       </RigidBody>
//     </>
//   )
// }


function Paddle({ paddle }: { paddle: PSize }) {
	const ref = useRef(null)
	const { x, y } = (paddle.position)
	useFrame((state) => {
		if (ref.current) {
			ref.current.position.set(x - 500, -150, y - 300)
		}
	})
	return (
		<RigidBody>
			<mesh ref={ref}>
				<RoundedBox args={[paddle.width, paddle.width, paddle.height]} radius={paddle.width / 2} rotation-y={-paddle.rotation}>
					{/* <meshPhysicalMaterial map={texture} bumpMap={bump} /> */}
					<meshBasicMaterial color={[1, 10, 8]} toneMapped={false} />
				</RoundedBox>
			</mesh>
		</RigidBody>
	)
}

function Brick({ brick }) {
	const ref = useRef()
	const { x, y } = (brick.position)
	useFrame((state) => {
		ref.current.position.set(x - 500, -150, y - 300)
	})
	return (
		<RigidBody>
			<mesh ref={ref}>
				<RoundedBox args={[brick.width, brick.width, brick.height]}>
					<meshPhysicalMaterial color={brick.color} clearcoat={1} clearcoatRoughness={0.5} roughness={.5} metalness={.3} />
				</RoundedBox>
			</mesh>
		</RigidBody>
	)
}

function Wall({ y }) {
	return (
		<mesh position={[0, -180, y]}>
			<boxGeometry args={[998, 100, 10]} />
			<meshStandardMaterial roughness={1} transparent opacity={0.6} color={'aquamarine'} />
		</mesh>
	)
}

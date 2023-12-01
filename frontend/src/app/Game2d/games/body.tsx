"use client"

import React, { use, useEffect, useRef, useState } from 'react';

export default function Games() {
	const aiImgPath = require('../../../../public/2002.i039.010_chatbot_messenger_ai_isometric_set-05.jpg').default;
	const playWithBot = () => {
		console.log('play with bot');
	}
	const joinQueue = () => {
		console.log('join queue');
	}
	return (
		<div className="flex flex-col items-center justify-center w-full h-full">
			<button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 w-[16vw] h-[16vw] rounded-full content-center items-center"
				onClick={playWithBot}>
				Play With Bot
			</button>
			<button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 w-[16vw] h-[16vw] rounded-full content-center items-center"
				onClick={joinQueue}>
				Join The Game
			</button>
		</div>
	);
}
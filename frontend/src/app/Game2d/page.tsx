
"use client"
import { Environment, OrbitControls, useProgress } from "@react-three/drei";
import { Body } from "./component2d/body";
import { Body3D } from "./component3d/body";
import { HJ } from "./hj/body";
import { Game } from './types/index';

// import { Game } from './types/index';
import { useEffect, useState, useRef } from 'react';
const game: Game = new Game()

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import Games from "./games/body";
// import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier"
// import * as THREE from "three"
// import { Fisheye, CameraControls, PerspectiveCamera, Environment } from '@react-three/drei'

export default function  Game2d(){
  
  
  return(
      <div className="absolute max-w-[1000px] max-h-[1000px] w-[100vw] h-[100vh]  top-0 left-0  bottom-0  right-0 content-center mx-auto m-7  bg-[#fff0]">
        <div className='h-full bg-[#fff0] relative flex flex-col justify-between  items-center'>
            <div className="flex items-center bg-black  justify-between py-1  mx-auto w-[95%] h-[5%]">
				{/* first player */}
                <div className="h-[100%]">
                    {/* <img  className=' h-[100%]' src="https://mjalloul.vercel.app/user.svg" /> */}
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-white mx-5  text-2xl md:text-4xl ">{0}</p>
                    <p className="text-white mx-5  text-2xl md:text-4xl ">-</p>
                    <p className="text-white mx-5  text-2xl md:text-4xl ">{0}</p>
                </div>
                <div className="h-[100%]">
                    {/* <img  className=' h-[100%]' src="https://mjalloul.vercel.app/user.svg" /> */}
                </div>
            </div>
            {/* <Body game={game}/> */}
			{/* <HJ/> */}
            <div className="bg-[#000] relative max-w-[90%] max-h-[90%] w-[80vw] h-[65vh] mx-auto mb-4 mt-6">
              <Body3D/> 
            </div>
			{/* <Games/> */}
            <div className="flex xl:hidden   mb-auto gap-6">
                <button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br 
                shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 w-[16vw] h-[16vw] rounded-full content-center items-center "></button>
                <button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br 
                shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 w-[16vw] h-[16vw] rounded-full content-center items-center "></button>
                <button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br 
                shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 w-[16vw] h-[16vw] rounded-full content-center items-center "></button>
                <button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br 
                shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 w-[16vw] h-[16vw] rounded-full content-center items-center "></button>
                
            </div>
      
        </div>
      </div>
  );
}

















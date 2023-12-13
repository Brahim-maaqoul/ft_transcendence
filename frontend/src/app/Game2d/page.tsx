"use client";
import { Environment, OrbitControls, useProgress } from "@react-three/drei";
import { Body } from "./component2d/body";
import { Body3D } from "./component3d/body";
import { Game } from "./types/index";

// import { Game } from './types/index';
import { useEffect, useState, useRef } from "react";
const game: Game = new Game();

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import NavBar from "@/components/navBar";
import { useAuth } from "@/components/providers/AuthContext";
import { url } from "inspector";
import Link from "next/link";
// import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier"
// import * as THREE from "three"
// import { Fisheye, CameraControls, PerspectiveCamera, Environment } from '@react-three/drei'

export default function Game2d() {
  const { dataUser } = useAuth();
  return (
    <div className="h-[767px]  z-0 w-full md:w-[83%]  relative md:p-2 md:rounded-3xl md:bg-slate-500 md:bg-opacity-40  md:shadow-black md:shadow-2xl ">
      <div className="flex h-full w-full ">
        <NavBar></NavBar>
        {/* <Body game={game}/> */}
        {/* <HJ/> */}
        <div className="flex flex-col justify-center items-center bg-[#000] bg-opacity-0 relative max-w-[90%] max-h-[90%] w-[80vw] h-[65vh] mx-auto mb-4 mt-6">
          <div className=" bg-cyan-400 bg-opacity-20 p-4  flex justify-evenly w-[90%] rounded-3xl">
            <div className="flex items-center gap-x-8">
              <span className="text-2xl text-white">{dataUser?.nickname}</span>
              <Link href={""} className="w-16 h-16">
                <div
                  className="w-full h-full rounded-full bg-cover"
                  style={{
                    backgroundImage: `url(${dataUser?.picture})`,
                  }}></div>
              </Link>
              <span className="text-2xl text-white">0</span>
            </div>
            <div className="flex items-center gap-x-8">
              <span className="text-2xl text-white">0</span>
              <Link href={""} className="w-16 h-16">
                <div
                  className="w-full h-full rounded-full bg-cover"
                  style={{
                    backgroundImage: `url(${dataUser?.picture})`,
                  }}></div>
              </Link>
              <span className="text-2xl text-white">{dataUser?.nickname}</span>
            </div>
          </div>
          {/* {dataUser && <Body3D dataUser={dataUser} />} */}
          {dataUser && <Body dataUser={dataUser} />}
        </div>
      </div>
    </div>
  );
}

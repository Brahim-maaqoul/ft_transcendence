
"use client"

import { Brick } from "../types/component"



export default function  Bricks({brick}:{brick: Brick}){

    return (
        <div
        style={{
            position: 'absolute',
            left: `${brick.position.x}%`,
            top: `${brick.position.y}%`,
            width: `${brick.width}%`, 
            height: `${brick.height}%`,
            backgroundColor: `${brick.color}`,
        }}
        ></div>
    )

}
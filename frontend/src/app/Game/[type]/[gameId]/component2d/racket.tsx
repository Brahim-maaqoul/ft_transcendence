
"use client"
import GameState from "./GameState"



export default function  Racket({games}){

    return (
        <div
        style={{
            position: 'absolute',
            left: `${game.paddle2.position.x}%`,
            top: `${game.paddle2.position.y}%`,
            width: `${game.paddle2.width}%`, 
            height: `${game.paddle2.height}%`,
            backgroundColor: "#fff",
            borderRadius: "1000px",
            transform: `rotate(${game.paddle2.rotation}rad)`,
            transition: "transform .1s",
        }}
        ></div>
    )

}
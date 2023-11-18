
"use client"



export default function  Brick({brick}){

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
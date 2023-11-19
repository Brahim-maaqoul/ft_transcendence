"use client"
import Brick from './bricks';

export function Body({game})
{
    
    return (
        <div className="bg-[#000] rotate-90 xl:rotate-0 relative w-[90%] xl:w-[90%] aspect-[10/6] m-auto">
            <div>

            <div className=' absolute left-[49.75%] right-[49.75%] w-[.5%] sm:w-[.5%] bottom-0 top-0 bg-white'>
                </div>
                <div className="absolute left-1/2 top-[40%] rotate-[270deg] xl:rotate-0 transform -translate-x-1/2 w-1/11 h-1/7 bg-black rounded-full flex items-center justify-center">
                    <p className="text-4xl sm:text-8xl md:text-10xl lg:text-12xl xl:text-14xl text-white"
                    >

                    {game.sec < 0 ? "" : 3 - game.sec}
                    </p>
                </div>
                <div
                style={{
                    position: 'absolute',
                    left: `${game.paddle1.position.x}%`,
                    top: `${game.paddle1.position.y}%`,
                    width: `${game.paddle1.width}%`, 
                    height: `${game.paddle1.height}%`,
                    backgroundColor: "#fff",
                    borderRadius: "1000px",
                    transform: `rotate(${game.paddle1.rotation}rad)`,
                    transition: "transform .1s",
                }}
                ></div>
                <div
                    className="absolute"
                    style={{
                        left: `${game.paddle2.position.x}%`,
                        top: `${game.paddle2.position.y}%`,
                        width: `${game.paddle2.width}%`,
                        height: `${game.paddle2.height}%`,
                        backgroundColor: "#fff",
                        borderRadius: "1000px",
                        transform: `rotate(${game.paddle2.rotation}rad)`,
                        transition: "transform .1s",
                    }}
                >
                </div>
                {game.ball.map((b, id) => {return (
                    <div key={id}
                        style={{
                            position: 'absolute',
                            left: `${b.position.x}%`,
                            top: `${b.position.y}%`,
                            width: `${b.width}%`,
                            height: `${b.height}%`,
                            backgroundColor: "#f0f",
                            borderRadius:"100%",
                        }}
                        >
                    </div>)})}
                {game.bricks.map((b, id) => {return (<Brick key={id} brick={b}/>)})}

            </div>
        </div>
    )
}
"use client"
import { useEffect, useState } from 'react';


interface GameObject {
    x: number;
    y: number;
    dx: number;
    dy: number;
    width: number;
    height: number;
    color: string;
    raduis:number
  }
  
  const createBall = (x: number, y: number ,dx: number, dy: number ): GameObject => ({
    x,
    y,
    dx,
    dy,
    width: 3,
    height: 3 * 1.5,
    color: 'red',
    raduis: 50
  });
  
  const createRacket = (x: number, y: number): GameObject => ({
    x,
    y,
    dx:0,
    dy:1,
    width: 3,
    height: 20,
    color: '#fff',
    raduis: 0,
  });
  
  

  interface GameState {
    ball: GameObject;
    racket1: GameObject;
    racket2: GameObject;
    score: number;
    keysPressed: Set<string>;
  }
  
  const initializeGame = (): GameState => ({
    ball: createBall(50, 10, .1, .1),
    racket1: createRacket(0, 10),
    racket2: createRacket(0, 70),
    score: 0,
    keysPressed: new Set<string>(),
  });
  
  const updateGame = (game: GameState): GameState => {
    const speed = 0.3;
  
    let newRacket1Y = game.racket1.y;
    let newRacket2Y = game.racket2.y;
  
    if (game.ball.x <= 0 || game.ball.x >= 100 - game.ball.width)
      game.ball.dx *= -1;
    if (game.ball.y <= 0)
    {
      game.ball.dy = 0.5 *  speed;
      game.ball.dx = (Math.abs(game.ball.dx)/game.ball.dx) * (Math.pow(speed, 2) - Math.pow(game.ball.dy, 2));
    }
    if (game.ball.y >= 100 - game.ball.height)
    {
      game.ball.dy = -.5 * speed;
      game.ball.dx = (Math.abs(game.ball.dx)/game.ball.dx) * (Math.pow(speed, 2) - Math.pow(game.ball.dy, 2));

    }
    
    if (game.keysPressed.has('w') || game.keysPressed.has('W')) {

      newRacket1Y -= speed;
    }
  
    if (game.keysPressed.has('s') || game.keysPressed.has('S')) {
      newRacket1Y += speed;
    }
  
    if (game.keysPressed.has('ArrowUp')) {
      newRacket2Y -= speed;
    }
  
    if (game.keysPressed.has('ArrowDown')) {
      newRacket2Y += speed;
    }
    newRacket1Y = Math.max(0, Math.min(newRacket1Y, 100 - game.racket1.height));
    newRacket2Y = Math.max(0, Math.min(newRacket2Y, 100 - game.racket2.height));
    console.log(newRacket1Y,newRacket2Y)
    return {
      ...game,
      ball: {
        ...game.ball,
        x: game.ball.x + game.ball.dx,
        y: game.ball.y + game.ball.dy,
      },
      racket1: {
        ...game.racket1,
        y: newRacket1Y,
      },
      racket2: {
        ...game.racket2,
        y: newRacket2Y,
      },
    };
  };
  


export default function  Game2d(){
    const [game, setGame] = useState(initializeGame());

    useEffect(() => {
      const gameLoop = setInterval(() => {
        setGame((prevGame) => updateGame(prevGame));
      }); // Update approximately 60 times per second
  
      return () => clearInterval(gameLoop);
    }, []);

    useEffect(() => {
        
        const handleKeyDown = (event: KeyboardEvent) => {
            setGame((prevGame) => ({
              ...prevGame,
              keysPressed: new Set(prevGame.keysPressed).add(event.key),
            }));
          };
      
          const handleKeyUp = (event: KeyboardEvent) => {
            const keysPressed = new Set(game.keysPressed);
            keysPressed.delete(event.key);
      
            setGame((prevGame) => ({
              ...prevGame,
              keysPressed,
            }));
          };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.addEventListener('keyup', handleKeyUp);
        };
      }, []);
  

    return(
        <div className="absolute max-w-[1200px] h-[100vh]  top-0 left-0  bottom-0  right-0   m-auto  bg-black">
            <div className='h-full relative flex flex-col justify-between xl:justify-center  items-center'>
                <div className="flex items-center  justify-between py-5  mx-auto w-[95vw] xl:max-w-[1000px]">
                    <div className="">
                        <img  className='w-[50px] h-[50px]' src="https://mjalloul.vercel.app/user.svg"  />
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-white mx-5  text-2xl md:text-4xl ">0</p>
                        <p className="text-white mx-5  text-2xl md:text-4xl ">-</p>
                        <p className="text-white mx-5  text-2xl md:text-4xl ">0</p>
                    </div>
                    <div className="">
                        <img   className='w-[50px] h-[50px]' src="https://mjalloul.vercel.app/user.svg"  />
                    </div>
                </div>
                
                <div className="bg-[#d48686] rotate-90 xl:rotate-0 relative  w-[130vw] h-[calc(130vw/1.5)]  sm:w-[90vw] sm:h-[calc(90vw/1.5)]   xl:h-[calc(1000px/1.5)] xl:mx-auto p-1   xl:w-[1000px]">
                    <div className=''>
                        {/* <h1>Game Score: {game.score}</h1> */}
                        <div>
                        <div className=' absolute left-0 right-0 bottom-0 top-0 m-auto  w-[150px] h-[150px]  rounded-full  bg-white'>
                                <div className='absolute left-0 right-0 bottom-0 top-0 m-auto  w-[140px] h-[140px]  rounded-full  bg-[#d48686]'>

                                </div>
                            </div>
                            <div className=' absolute left-[50%] right-[50%] w-[2px] sm:w-[5px] bottom-0 top-0 bg-white'>
                            </div>
                            <div
                            style={{
                                position: 'absolute',
                                left: `${`calc(${game.ball.x}%)`}`,
                                top: `${`calc(${game.ball.y}%)`}`,
                                width: `${game.ball.width}%`,
                                height: `${game.ball.height}%`,
                                backgroundColor: game.ball.color,
                                borderRadius:game.ball.raduis,
                            }}
                            ></div>
                            <div
                            style={{
                                position: 'absolute',
                                left: game.racket1.x,
                                top: `${`calc(${game.racket1.y}%)`}`,
                                width: `${game.racket1.width}%`, 
                                height: `${game.racket1.height}%`,
                                backgroundColor: game.racket1.color,
                                borderRadius:game.racket1.raduis,
                            }}
                            ></div>
                            <div
                            style={{
                                position: 'absolute',
                                right: game.racket2.x,
                                top: `${game.racket2.y}%`,
                                width: `${game.racket2.width}%`,
                                height: `${game.racket2.height}%`,
                                backgroundColor: game.racket2.color,
                                borderRadius:game.racket1.raduis,
                            }}
                            ></div>
                            
                    </div>
                 </div>
                </div>
                <button className=' mx-auto  px-10 py-2 bg-[#d48686] rounded-full m-10 text-white'>Quit</button>
            </div>
        </div>
    );
}
import Image from "next/image";
import Script from "next/script";

function Game(){
    return (
        <div className="">
            <div className="flex justify-center">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-24 md:w-36 h-24 md:h-36">
                        <Image src={'/hjabbour.jpg'} width={100} height={100} alt="hjabbour picture" className="rounded-full w-24 md:w-36 h-24 md:h-36" />

                    </div>
                    <span className="text-lg md:text-2xl text-cyan-950">Hossame JABBOURI</span>
                </div>
            </div>
        </div>
    )
}

export default Game;
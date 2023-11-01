import Image from "next/image";

function About(){
    return (
        <div className="">
            <div className="flex justify-around">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-24 md:w-36 h-24 md:h-36">
                        <Image src={'/mjalloul.jpg'} width={100} height={100} alt="mjalloul picture" className="rounded-full w-24 md:w-36 h-24 md:h-36" />

                    </div>
                    <span className="text-lg md:text-2xl text-cyan-950">Mohamed Jalloul</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-24 md:w-36 h-24 md:h-36">
                        <Image src={'/nhanafi.png'} width={100} height={100} alt="mjalloul picture" className="rounded-full w-24 md:w-36 h-24 md:h-36" />

                    </div>
                    <span className="text-lg md:text-2xl text-cyan-950">Nasreddine Hanafi</span>
                </div>
            </div>
            <div className="flex justify-center">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-24 md:w-36 h-24 md:h-36">
                        <Image src={'/rjaanit.jpg'} width={100} height={100} alt="mjalloul picture" className="rounded-full w-24 md:w-36 h-24 md:h-36" />

                    </div>
                    <span className="text-lg md:text-2xl text-cyan-950">Reda Jaanit</span>
                </div>
            </div>
            <div className="flex justify-around">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-24 md:w-36 h-24 md:h-36">
                        <Image src={'/bmaaqoul.png'} width={100} height={100} alt="mjalloul picture" className="rounded-full w-24 md:w-36 h-24 md:h-36" />

                    </div>
                    <span className="text-lg md:text-2xl text-cyan-950">Brahim Maaqoul</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-24 md:w-36 h-24 md:h-36">
                        <Image src={'/ooumlil.jpg'} width={100} height={100} alt="mjalloul picture" className="rounded-full w-24 md:w-36 h-24 md:h-36" />

                    </div>
                    <span className="text-lg md:text-2xl text-cyan-950">Oussama Oumlil</span>
                </div>
            </div>
        </div>
    )
}

export default About;
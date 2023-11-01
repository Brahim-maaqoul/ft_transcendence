import Image from "next/image";

const Stats = () => (
  <div className="bg-black bg-opacity-40 rounded-2xl md:shadow-black shadow-2xl flex flex-col p-4 mx-2 my-3">
    <span className="text-white text-2xl font-mono">Stats</span>
    <div className="flex gap-x-6 my-4">
      <div className="flex flex-col items-center w-2/3">
        <Image
          src={"/reda.png"}
          alt="Profile picture"
          width={80}
          height={80}
          className="rounded-full"
        />
        <span className="text-white text-xl">Name</span>
      </div>
      <div className="flex flex-col items-center w-3/4">
        <div className="flex text-white text-lg xl:text-2xl font-bold gap-2">
          <span>L : 3</span>
          <span>|</span>
          <span>W : 30</span>
        </div>
        <div className="flex justify-center gap-x-12 text-white text-xs xl:text-xl ">
          <span>5</span>
          <span>Goal</span>
          <span>20</span>
        </div>
        <div className="flex justify-center gap-x-12 text-white text-xs xl:text-xl">
          <span>105</span>
          <span>Rank</span>
          <span>21</span>
        </div>
      </div>
      <div className="flex flex-col items-center w-2/3">
        <Image
          src={"/nasr.png"}
          alt="Profile picture"
          width={80}
          height={80}
          className="rounded-full"
        />
        <span className="text-white text-xl">Name</span>
      </div>
    </div>
  </div>
);

export default Stats;

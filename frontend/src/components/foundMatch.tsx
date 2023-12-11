function FoundMatch() {
  const textShadow = `0px 0px 5px black, 0px 0px 10px white, 0px 0px 20px white, 0px 0px 40px white`;
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-600/60 backdrop-blur h-1/3 w-full lg:w-1/3 z-50 rounded flex flex-col justify-center items-center gap-4 px-4">
      <div
        className="w-full h-1/4 text-center text-white text-5xl pt-4"
        style={{ textShadow: textShadow }}
      >
        Game Found
      </div>
      <div
        className="w-full h-1/4 text-center text-white text-3xl"
        style={{ textShadow: textShadow }}
      >
        ALL PICK
      </div>
      <div className="w-full h-1/2 flex justify-evenly items-center pb-4">
        <div className="flex justify-center items-center mx-4">
          <div
            className="h-32 w-32 rounded-full bg-cover"
            style={{ backgroundImage: `url('/nasr.png')` }}
          ></div>
        </div>
        <div className="flex items-center justify-center">
          <div className=" text-4xl text-white text-center">VS</div>
        </div>
        <div className="flex justify-center items-center mx-4">
          <div
            className="h-32 w-32 rounded-full bg-cover"
            style={{ backgroundImage: `url('/nasr.png')` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default FoundMatch;

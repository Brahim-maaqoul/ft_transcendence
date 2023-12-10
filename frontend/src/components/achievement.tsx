import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import Stats from "./stats";

const colors = [
  "/Level_3.png",
  "/Level_5.png",
  "/Level_10.png",
  "/Rank_1.png",
  "/Rank_2.png",
  "/Rank_10.png",
  "/Genius.png",
];

const extractColorName = (path: string) => {
  const parts = path.split("_");

  const name = parts.map((part, index) => {
    if (index === parts.length - 1) {
      part = part.split("/").join("");
      return part.replace(".png", "");
    }
    return part.replace(/[^A-Za-z]/g, " ");
  });

  return name.join(" ");
};

export const Achievement = () => (
  <div className="bg-black bg-opacity-40 rounded-2xl shadow-black shadow-2xl flex flex-col p-4 mx-2 my-2">
    <span className="text-white text-2xl font-mono">Achievements</span>
    <Splide
      options={{
        perPage: 2,
        arrows: false,
        pagination: false,
        drag: "free",
        autoWidth: true,
        gap: "2rem",
      }}>
      {colors.map((color, index) => (
        <SplideSlide key={index} className="p-4">
          <div className="flex flex-col justify-center items-center">
            <div className="w-[85px] h-[120px]">
              <div
                className="h-full w-full bg-contain bg-no-repeat"
                style={{ backgroundImage: `url(${color})` }}></div>
            </div>
            <span className="text-white mt-2">{extractColorName(color)}</span>
          </div>
        </SplideSlide>
      ))}
    </Splide>
  </div>
);

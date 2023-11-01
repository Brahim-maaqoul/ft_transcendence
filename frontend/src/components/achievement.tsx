import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import Stats from "./stats";

const colors = [
  "/green.png",
  "/blue.png",
  "/purple.png",
  "/brown.png",
  "/gray.png",
  "/yellow.png",
];

export const Achievement = () => (
  <div className="bg-black bg-opacity-40 rounded-2xl shadow-black shadow-2xl flex flex-col p-4 mx-2 my-3">
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
          <Image
            src={color}
            alt="achievement"
            width={100}
            height={100}
            className="rounded-2xl w-28 h-24"
          />
        </SplideSlide>
      ))}
    </Splide>
  </div>
);

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

const ImageSlider = ({ images }: { images: string[] }) => {
  return (
    <Swiper spaceBetween={50} slidesPerView={1} loop={true}>
      {images.map((url, index) => (
        <SwiperSlide key={index}>
          <img src={url} alt={`Image ${index + 1}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;

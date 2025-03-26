import { Box } from "@mui/material";
import { useState, useEffect } from "react";

const images = ["/t.jpg", "/r.jpg","/book.jpg","/bc.jpg",];

function ImageCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {images.map((src, i) => (
      <Box
      key={i}
      component="img"
      src={src}
      alt={`תמונה ${i + 1}`}
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "auto",
        maxHeight: "100%",
        opacity: i === index ? 0.3 : 0,
        transition: "opacity 1s ease-in-out",
        objectFit: "cover",
      }}
    />
    
    
      ))}
    </Box>
  );
}

export default ImageCarousel;

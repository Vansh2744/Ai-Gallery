import { useLocation } from "react-router-dom";
import { Image } from "@imagekit/react";

function View() {
  const location = useLocation();

  const { url } = location.state || {};

  return (
    <div className="h-screen w-screen flex flex-col gap-10 items-center justify-center">
      <Image
        urlEndpoint="https://ik.imagekit.io/yrq1ay1rp"
        src={url}
        alt="Image not found"
      />
      <div className="w-full flex items-center justify-center">
      </div>
    </div>
  );
}

export default View;

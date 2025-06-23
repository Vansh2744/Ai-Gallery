import { BackendUrl } from "@/lib/url";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "@imagekit/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

interface Image {
  file_id: string;
  name: string;
  url: string;
}

function Images() {
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [dropDownIndex, setDropDownIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const getImages = async (id: string) => {
    try {
      const res = await axios.get(`${BackendUrl}/getImages/${id}`);
      setImages(res.data);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }
      currentUser(token);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }, []);

  const currentUser = async (token: string) => {
    try {
      const res = await axios.get(`${BackendUrl}/getCurrentUser/${token}`);
      const id = res.data.id;
      getImages(id);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const handleView = (url: string) => {
    navigate("/view", {
      state: {
        url,
      },
    });
  };

  const handleDelete = async (fileId: string) => {
    try {
      setLoading(true);
      await axios.delete(`${BackendUrl}/delete-image/${fileId}`);
      window.location.reload();
      return;
    } catch (error) {
      console.log(error);
      return;
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen min-w-screen">
      <div className="flex items-center justify-evenly">
        <div className="p-10 w-full">
          <a href="/">
            <img src="/ai-gallery.jpg" className="w-13" />
            <span className="font-extrabold">AI Gallery</span>
          </a>
        </div>
        <div className="flex items-center justify-center w-full">
          <span className="font-extrabold text-xl sm:text-3xl">
            Image Gallery
          </span>
        </div>
      </div>
      {images.length == 0 ? (
        <div className="flex items-center justify-center w-full h-screen">
          <h1 className="text-3xl font-bold text-slate-500">No Images</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 py-10 px-10">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <BsThreeDotsVertical
                className="absolute right-2 top-2 hover:cursor-pointer bg-white h-7 w-7 rounded-full py-1 hover:scale-105"
                onClick={() =>
                  setDropDownIndex((prev) => (prev == index ? null : index))
                }
              />
              {dropDownIndex == index && (
                <div className="z-10 absolute -right-5 top-11 flex flex-col gap-2">
                  <div
                    className="bg-green-600 hover:cursor-pointer px-2 rounded-2xl text-center font-bold text-sm py-1"
                    onClick={() => handleView(image.url)}
                  >
                    View Image
                  </div>
                  <div
                    className="bg-red-600 hover:cursor-pointer px-2 rounded-2xl text-center flex gap-1 items-center py-1"
                    onClick={() => handleDelete(image.file_id)}
                  >
                    <MdDelete />
                    {loading ? (
                      <span className="loading loading-spinner text-success"></span>
                    ) : (
                      <span className="font-bold text-sm">Delete</span>
                    )}
                  </div>
                </div>
              )}
              <Image
                urlEndpoint="https://ik.imagekit.io/yrq1ay1rp"
                src={image.url}
                width={500}
                height={500}
                alt="Picture of the author"
              />
              <div>{image.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Images;

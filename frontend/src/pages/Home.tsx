import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "@/lib/url";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Image } from "@imagekit/react";

function Home() {
  const [content, setContent] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  const navigate = useNavigate();

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

  const handleGenerate = async () => {
    if (content == "") {
      toast.error("Enter some prompt");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${BackendUrl}/generate-image`, {
        id,
        content,
      });
      setImage(res.data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = async (token: string) => {
    try {
      const res = await axios.get(
        `${BackendUrl}/getCurrentUser/${token}`
      );
      const id = res.data.id;
      setId(id);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const handleLogout = () => {
    localStorage.setItem("token", "");
    navigate("/signin");
  };
  return (
    <div className="min-h-screen px-10 py-10">
      <Toaster />
      <div className="flex justify-between w-full">
        <Link to="/" className="w-full">
          <img src="/ai-gallery.jpg" className="w-13" />
          <span className="font-extrabold">AI Gallery</span>
        </Link>
        <h1 className="w-full text-center mb-10 text-4xl font-extrabold sm:visible sm:block hidden">
          Generate Image
        </h1>
        <div className="flex gap-3">
          <Link to="/images">
            <Button className="bg-cyan-600 hover:bg-cyan-500 hover:cursor-pointer">
              Gallery
            </Button>
          </Link>
          <Button
            className="bg-red-600 hover:bg-red-500 hover:cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="flex gap-2 pt-10">
        <Input
          type="text"
          placeholder="Write Prompt..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={handleGenerate} className="hover:cursor-pointer">
          Generate
        </Button>
      </div>
      <div className="flex items-center justify-center mt-40">
        {loading && (
          <span className="loading loading-spinner text-success w-32 h-32"></span>
        )}
        <div className="">
          {image.length > 0 && (
            <Image
              urlEndpoint="https://ik.imagekit.io/yrq1ay1rp"
              src={image}
              width={500}
              height={500}
              alt="Picture of the author"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

import { BackendUrl } from "@/lib/url";
import axios from "axios";
import { useEffect, useState, type ChangeEvent } from "react";

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const access_token = localStorage.getItem("token");

    if (!access_token) {
      console.log("Token not found");
      return;
    }

    currentUser(access_token);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const currentUser = async (token: string) => {
    try {
      const res = await axios.get(`${BackendUrl}/${token}`);
      const id = res.data.id;
      setId(id);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("Please Select file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const res = await axios.post(
        `${BackendUrl}/upload-image/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1>Loading....</h1>;
  }
  return (
    <div>
      <h1>Upload Image</h1>
      <div>
        <input type="file" onChange={handleChange} />
      </div>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Upload;

import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Ascii } from "@/components/Ascii";
import { useRouter } from "next/router";

import { UserContext } from "@/context/userContext";
import { setAuthOpen } from "@/redux/uiSlice";
import { useDispatch } from "react-redux";

import AuthModal from "@/components/AuthModal";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [image, setImage] = React.useState<File>();
  const [imageUrl, setImageUrl] = React.useState("");
  const [ascii, setAscii] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const user = React.useContext(UserContext);
  const router = useRouter();
  const dispatch = useDispatch();

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = e.target.files[0];
      if (image.size > 1000000) {
        setError(true);
        return;
      }
      if (error) {
        setError(false);
      }
      setImageUrl(URL.createObjectURL(image));
      setImage(image);
    }
  };

  const onConvert = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (image) {
      try {
        setLoading(true);
        const base64 = await toBase64(image);
        const res = await fetch("/api/convert", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: base64 as string,
        });
        const json = await res.json();
        setAscii(json.result);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (ascii && user) {
      setLoading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ ascii }),
      });
      if (res.status == 401) {
        dispatch(setAuthOpen(true));
      }
      setLoading(false);
    }
    if (!user) {
      dispatch(setAuthOpen(true));
    }
  };

  return (
    <>
      <AuthModal />
      <div className="m-12">
        <h1 className="text-4xl text-center">Image to Ascii Art Converter</h1>
        <div className="flex justify-center">
          <div>
            <div className="flex justify-center my-8">
              <button
                type="button"
                onClick={() => {
                  router.push("/gallery");
                }}
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                View Gallery
              </button>
            </div>

            <form>
              {!imageUrl && (
                <div className="max-w-xl">
                  <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                    <span className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="font-medium text-gray-600">
                        Click to select a file
                      </span>
                    </span>
                    <input
                      type="file"
                      name="file_upload"
                      className="hidden"
                      onChange={changeImage}
                    />
                  </label>
                </div>
              )}
              <div>
                {imageUrl && <img className="max-w-xs" src={imageUrl}></img>}
              </div>
              <p>Note: Max file size is 1 mb</p>
              {error && (
                <p className="text-red-500">The selected file was too large.</p>
              )}

              <div className="flex justify-around">
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage(undefined);
                      setImageUrl("");
                    }}
                    className="bg-transparent hover:bg-red-600 text-red-600 font-semibold hover:text-white py-2 px-4 my-4 border border-red-600 hover:border-transparent rounded"
                  >
                    Remove Image
                  </button>
                )}
                <button
                  onClick={onConvert}
                  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 my-4 border border-blue-500 hover:border-transparent rounded"
                >
                  Convert
                </button>
                <button
                  onClick={onUpload}
                  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 my-4 border border-blue-500 hover:border-transparent rounded"
                >
                  Upload to gallery
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex justify-center">
          {loading && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
        <div>{!loading && ascii && <Ascii ascii={ascii} />}</div>
      </div>
    </>
  );
}

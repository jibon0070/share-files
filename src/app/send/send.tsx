"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const buttonClass = "bg-purple-600 px-4 py-1 text-white rounded cursor-pointer";

export default function Send() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);

  async function send(e: ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length <= 0 || loading) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      if (!file) continue;
      formData.append(`file-${i}`, file, file.name);
    }

    const r = await axios
      .post("/send", formData, {
        onUploadProgress: (event) => {
          setProgress((event.progress || 0) * 100);
        },
      })
      .then((r) => r.data);

    setProgress(0);

    if (!r.success) {
      alert(r.message);
    } else {
      formRef.current?.reset();
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <form ref={formRef}>
      {!!progress && (
        <div className="w-screen h-screen fixed top-0 left-0 bg-white flex justify-center items-center">
          <progress max={100} value={progress} />
        </div>
      )}
      <label className={buttonClass}>
        {loading ? <div className="bg-gray-400 h-7 w-10 rounded" /> : <>Send</>}
        <input className="hidden" type="file" onChange={send} multiple={true} />
      </label>
    </form>
  );
}

"use client";

import { ChangeEvent, useRef, useState } from "react";
import sendAction from "./send-action";

const buttonClass = "bg-purple-600 px-4 py-1 text-white rounded cursor-pointer";

export default function Send() {
  const [loading, setLoading] = useState(false);

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

    const r = await sendAction(formData);

    if (!r.success) {
      alert(r.message);
    } else {
      formRef.current?.reset();
    }

    setLoading(false);
  }

  return (
    <form ref={formRef}>
      <label className={buttonClass}>
        {loading ? <div className="bg-gray-400 h-7 w-10 rounded" /> : <>Send</>}
        <input className="hidden" type="file" onChange={send} multiple={true} />
      </label>
    </form>
  );
}

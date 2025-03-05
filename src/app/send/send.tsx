"use client";

import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const buttonClass = "bg-purple-600 px-4 py-1 text-white rounded cursor-pointer";

function useEngine() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);

  const sendMutation = useMutation({
    mutationFn: async (fileList: FileList) => {
      const formData = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);
        if (!file) continue;
        formData.append(`file-${i}`, file, file.name);
      }

      const r = await axios.post("/send", formData, {
        onUploadProgress: (event_1) => {
          setProgress((event_1.progress || 0) * 100);
        },
      });
      return r.data;
    },
    onSuccess: (r) => {
      if (!r.success) {
        alert(r.message);
      } else {
        formRef.current?.reset();
        router.refresh();
      }
      setProgress(0);
    },
  });

  async function send(e: ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length <= 0 || sendMutation.isPending) {
      return;
    }

    sendMutation.mutate(fileList);
  }

  return { formRef, progress, send };
}

export default function Send() {
  const { formRef, progress, send } = useEngine();
  return (
    <form ref={formRef}>
      {!!progress && <Loading progress={progress} />}
      <label className={buttonClass}>
        Send
        <input className="hidden" type="file" onChange={send} multiple={true} />
      </label>
    </form>
  );
}

function Loading({ progress }: { progress: number }) {
  const ref = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas) {
        canvas.height = 100;
        canvas.width = 100;
        const ctx = canvas.getContext("2d")!;

        ctx.font = "16px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${progress.toFixed(2)}%`, 50, 50);

        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.arc(50, 50, 44, 0, ((2 * Math.PI) / 100) * progress);
        ctx.stroke();
      }
    },
    [progress],
  );

  return (
    <div className="w-screen h-screen absolute top-0 left-0 bg-white flex items-center justify-center">
      <canvas ref={ref} />
    </div>
  );
}

"use client";

import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const buttonClass = "bg-purple-600 px-4 py-1 text-white rounded cursor-pointer";

const byteFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  unitDisplay: "narrow",
  unit: "byte",
});

function byteFormat(byte: number): string {
  return byteFormatter.format(byte).replace(/B$/, "G") + "B";
}

function useEngine() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [estimatedSeconds, setEstimatedSecons] = useState(0);
  const [currentUploadSize, setCurrentUploadSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [speed, setSpeed] = useState("");

  const uploadSize = useCallback(() => {
    return `${byteFormat(currentUploadSize)}/${byteFormat(totalSize)}`;
  }, [currentUploadSize, totalSize]);

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
        onUploadProgress: (event) => {
          setSpeed(byteFormat(event.rate || 0) + "/ps");
          setCurrentUploadSize(event.loaded);
          setTotalSize(event.total || 0);
          setEstimatedSecons(event.estimated || 0);
          setProgress((event.progress || 0) * 100);
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
      setSpeed("");
      setCurrentUploadSize(0);
      setEstimatedSecons(0);
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

  return { formRef, progress, send, estimatedSeconds, uploadSize, speed };
}

export default function Send() {
  const { formRef, progress, send, estimatedSeconds, uploadSize, speed } =
    useEngine();
  return (
    <form ref={formRef}>
      {/* <Loading */}
      {/*   progress={33} */}
      {/*   estimatedSeconds={1} */}
      {/*   uploadSize={uploadSize()} */}
      {/*   speed={"45mb/ps"} */}
      {/* /> */}
      {!!progress && (
        <Loading
          progress={progress}
          estimatedSeconds={estimatedSeconds}
          uploadSize={uploadSize()}
          speed={speed}
        />
      )}
      <label className={buttonClass}>
        Send
        <input className="hidden" type="file" onChange={send} multiple={true} />
      </label>
    </form>
  );
}

function Loading({
  progress,
  estimatedSeconds,
  uploadSize,
  speed,
}: {
  progress: number;
  estimatedSeconds: number;
  uploadSize: string;
  speed: string;
}) {
  const ref = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvas) {
        canvas.height = 150;
        canvas.width = 150;
        const ctx = canvas.getContext("2d")!;

        const fontSize = 16;

        ctx.font = `${fontSize}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (progress < 100 && progress > 0) {
          ctx.fillText(
            `${progress.toFixed(2)}%`,
            canvas.width / 2,
            canvas.height / 2 - (fontSize / 2) * 2,
          );

          ctx.fillText(uploadSize, canvas.width / 2, canvas.height / 2);

          ctx.fillText(
            `${formatRemainingTime(estimatedSeconds)} ${speed}`,
            canvas.width / 2,
            canvas.height / 2 + (fontSize / 2) * 2,
          );
        } else {
          ctx.fillText("Processing...", canvas.width / 2, canvas.height / 2);
        }

        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.arc(
          canvas.height / 2,
          canvas.width / 2,
          canvas.height / 2 - 6,
          0,
          ((2 * Math.PI) / 100) * progress,
        );
        ctx.stroke();
      }
    },
    [estimatedSeconds, progress, speed, uploadSize],
  );

  return (
    <div className="w-screen h-screen absolute top-0 left-0 bg-white flex items-center justify-center">
      <canvas ref={ref} />
    </div>
  );
}

function formatRemainingTime(estimatedSeconds: number): string {
  if (60 * 60 * 24 < estimatedSeconds) {
    return `${Math.ceil(estimatedSeconds / 60 / 60 / 24)
      .toString()
      .padStart(2, `0`)}d`;
  }

  if (60 * 60 < estimatedSeconds) {
    return `${Math.ceil(estimatedSeconds / 60 / 60)
      .toString()
      .padStart(2, `0`)}h`;
  }

  if (60 < estimatedSeconds) {
    return `${Math.ceil(estimatedSeconds / 60)
      .toString()
      .padStart(2, `0`)}m`;
  }

  return `${Math.ceil(estimatedSeconds).toString().padStart(2, `0`)}s`;
}

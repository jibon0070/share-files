import Send from "./send/send";
import fs from "fs";
import path from "path";
import Delete from "./delete/delete";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Files",
};

export default function Home() {
  const folderPath = path.join(process.cwd(), "storage", "uploads");

  const files: { name: string; size: string }[] = !fs.existsSync(folderPath)
    ? []
    : fs.readdirSync(folderPath).map((name) => {
        const fileStat = fs.statSync(path.join(folderPath, name));

        const formater = new Intl.NumberFormat("en-US", {
          notation: "compact",
          unitDisplay: "narrow",
        });

        return {
          name,
          size: formater.format(fileStat.size).replace(/B$/, "G") + "B",
        };
      });

  return (
    <main className="p-5 container mx-auto grid gap-5">
      <h1 className="text-3xl text-center">Share Files</h1>
      <div className="flex justify-end">
        <Send />
      </div>
      {files.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th className="border p-2 w-0">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2 w-0">Size</th>
              <th className="border p-2 w-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, i) => (
              <tr key={file.name}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{file.name}</td>
                <td className="border p-2">{file.size}</td>
                <td className="border p-2">
                  <div className="flex gap-1">
                    <a
                      title="Download"
                      className="bg-purple-600 hover:bg-purple-800 transition ease-out duration-300 text-white rounded-full size-7 shadow flex justify-center items-center"
                      download={file}
                      href={`/downloads/${file}`}
                    >
                      <i className="fas fa-arrow-down" />
                    </a>
                    <Delete file={file.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No files available send one.</p>
      )}
    </main>
  );
}

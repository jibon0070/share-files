import Send from "./send/send";
import fs from "fs";
import path from "path";

export default function Home() {
  const files = fs.readdirSync(path.join(process.cwd(), "uploads"));
  console.log(files);

  return (
    <main className="p-5 container mx-auto grid gap-5">
      <h1 className="text-3xl text-center">File Sharing App</h1>
      <div className="flex justify-end">
        <Send />
      </div>
      <table>
        <thead>
          <tr>
            <th className="border p-2 w-0">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2 w-0">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, i) => (
            <tr key={file}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{file}</td>
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
                  <button
                    title="Delete"
                    className="bg-red-600 hover:bg-red-800 transition ease-out duration-300 text-white rounded-full size-7 shadow"
                  >
                    <i className="fas fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

import Send from "./send/send";

export default function Home() {
  return (
    <main>
      File Sharing App
      <div className="flex justify-end">
        <Send />
      </div>
    </main>
  );
}

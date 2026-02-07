import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          MS Automation - OneDrive Email Flow
        </h1>
        <p className="text-xl mb-8 text-gray-600">
          Connect your mailboxes to OneDrive with a visual flow editor
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/flow"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Open Flow Editor
          </Link>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      <h2 className="mt-4 text-2xl font-semibold text-gray-900">
        Welcome to Shepherd&apos;s Hill Operation Portal
      </h2>

      <Link
        href="/dashboard/overview"
        className="mt-6 inline-flex items-center rounded-lg bg-[#FAB435]  px-6 py-3 text-white font-medium hover:bg-[#f9cf80] transition"
      >
        Get Started
      </Link>
    </div>
  );
}

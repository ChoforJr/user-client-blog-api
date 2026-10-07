import Link from "next/link";

export default function NotFound() {
  return (
    <section className="my-auto flex min-h-64 flex-col items-center justify-center text-center">
      <h1 className="font-display text-3xl font-bold">That page isn&apos;t here.</h1>
      <Link className="mt-5 font-semibold text-leaf hover:text-white" href="/">
        Return to the home page
      </Link>
    </section>
  );
}

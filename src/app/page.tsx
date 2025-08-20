import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="bg-black min-h-screen flex items-center">
      <section className="py-10 sm:py-16 lg:py-24 px-4 mx-auto max-w-7xl w-full">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-500 drop-shadow-lg mb-5">
              Simple Blog built with Next.js 15, TypeScript, and Drizzle ORM.
            </h1>
            <p className="mt-8 text-base text-white sm:text-xl">
              A clean, responsive blog platform built with Next.js 15, TypeScript, and Drizzle ORM.
            </p>

            <p className="mt-8 text-base text-white sm:text-xl">
              This application demonstrates modern web development best practices, featuring list and detail views of published articles authored by multiple contributors.Explore articles with dynamic routing based on slugs, complete author information, and clear content organization.
            </p>

            <p className="mt-8 text-base text-white sm:text-xl">
              Explore articles with dynamic routing based on slugs, complete author information, and clear content organization.
            </p>

            <div className="mt-10 sm:flex sm:items-center sm:space-x-8">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-teal-400 bg-white/5 backdrop-blur-md text-teal-300 font-semibold hover:bg-teal-400/20 hover:text-teal-200 transition-all duration-300 shadow-lg shadow-teal-500/10"
              >
                Go to Blog
                <svg
                  className="w-5 h-5 stroke-current transform transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <Image
              src="/images/hero-img.png"
              alt="Hero image"
              width={600}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}

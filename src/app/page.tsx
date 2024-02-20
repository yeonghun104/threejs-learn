import Link from "next/link";

export default function Home() {
  return (
    <main>
      <ul>
        <li>
          <Link href={"/lessons/01-introduction"}>01. Introduction</Link>
        </li>
        <li>
          <Link href={"/lessons/02-what-is-webgl-and-why-use-three-js"}>
            02. What is WebGL and why use Three.js
          </Link>
        </li>
        <li>
          <Link href={"/lessons/03-first-three-js-project"}>
            03. First Three.js Project
          </Link>
        </li>
        <li>
          <Link href={"/lessons/04-transform-objects"}>
            04. Transform Objects
          </Link>
        </li>
      </ul>
    </main>
  );
}

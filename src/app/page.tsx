import Link from "next/link";

export default function Home() {
  return (
    <ui>
      <li>
        <Link href={"/lessons/first-three-js-project"}>
          lessons/first-three-js-project
        </Link>
      </li>
    </ui>
  );
}

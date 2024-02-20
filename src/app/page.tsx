import Link from "next/link";
import { PAGES } from "@/app/constants/config";

export default function Home() {
  return (
    <main>
      <ul>
        {PAGES.map((page, key) => {
          return (
            <li key={key}>
              <Link href={page.src}>{page.title}</Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

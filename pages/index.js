import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Wordle Helper</title>
        <meta name="description" content="Some help to you master Wordle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Wordle Helper</h1>
        <div className={styles.grid}>
          <Link
            href={{ pathname: "/solver", query: { dic: "en" } }}
            passHref={true}
          >
            <div className={styles.card}>EN</div>
          </Link>
          <Link
            href={{ pathname: "/solver", query: { dic: "pt" } }}
            passHref={true}
          >
            <div className={styles.card}>PT</div>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.nytimes.com/games/wordle/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wordle
          <span className={styles.logo}>
            <Image
              src="/nyt-logo.svg"
              alt="New York Times Logo"
              width={16}
              height={16}
            />
          </span>
        </a>
        <a href="https://term.ooo" target="_blank" rel="noopener noreferrer">
          Termo
          <span className={styles.logo}>
            <Image
              src="/termo-logo.png"
              alt="Termo Logo"
              width={72}
              height={16}
            />
          </span>
        </a>
      </footer>
    </div>
  );
}

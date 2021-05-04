import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import ReactLoading from "react-loading";
import "bootstrap/dist/css/bootstrap.css";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import styles from "./episode.module.scss";
import { usePlayer } from "../../contexts/PlayerContext";
import { useFetch } from "../../hooks/useFetch";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
  description: string;
};

type EpisodeProps = {
  episode: Episode;
};

// export default function Episode({ episode }: EpisodeProps) {
export default function Episode() {
  const { play } = usePlayer();

  const router = useRouter();
  const { slug } = router.query;

  const { data } = useFetch<Episode>(`http://localhost:3333/episodes/${slug}`);

  if (!data) {
    return (
      <div style={{ textAlign: "center" }}>
        <ReactLoading type={"bars"} color={"black"} />
      </div>
    );
  }

  return (
    <div className={styles.episode}>
      <Head>
        <title>{data.title} | Podcastr</title>
        <meta name="description" content={data.members} />
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={data.thumbnail}
          objectFit="cover"
        />
        <button
          type="button"
          onClick={() => {
            play(data);
          }}
        >
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{data.title}</h1>
        <span>{data.members}</span>
        <span>{data.publishedAt}</span>
        <span>{data.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: data.description }}
      />
    </div>
  );
}

// working routers dynamic SSC
export const getStaticPaths: GetStaticPaths = async () => {
  // generate 2 lasted pages static
  const { data } = await api.get("episodes", {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const paths = data.map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };

  // to generate all pages not static
  // flag blocking is better to SEO
  // return {
  //   paths: [],
  //   fallback: "blocking",
  // };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24,
  };
};

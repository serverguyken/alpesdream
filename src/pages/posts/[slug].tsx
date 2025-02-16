import { ReactElement, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import Image from "next/image";

import { useMDXComponent } from "next-contentlayer/hooks";
import components from "@post/components/mdx/mdxComponents";

import {
  FrontMatter,
  GoBackButton,
  PostComments,
  PostNavs,
  ScrollToTop,
  TableOfContent,
  PostLayout,
} from "@post/components";

import { getAdjacentPosts, getAllPostsPaths, getPost } from "@post/lib";

import siteConfig from "../../../config/site";
import { ease } from "@common/animation";
import { Breadcrumbs } from "@common/components";

const MobileNav = dynamic(() => import("@post/components/mobil-nav"));

const PostPage = ({
  post,
  adjacentPosts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const Component = useMDXComponent(post.body.code);
  const [isTocOpen, setTocOpen] = useState(false);
  const frontmatter = {
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    title: post.title,
    slug: post.slug,
    description: post.description,
    readingTime: post.readingTime,
    toc: post.toc,
    thumbnail: post.thumbnail,
  };
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const ref = useRef(null);
  function handleScrollToComments() {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const createPost = async () => {
      await fetch(`/api/post/${post.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: post.slug,
        }),
      });
    };

    createPost();
  }, [post.slug]);
  return (
    <motion.div
      initial={{ marginLeft: 0 }}
      animate={{
        marginLeft: isTocOpen && !isTabletOrMobile ? "20rem" : 0,
      }}
      transition={{ type: "tween" }}
    >
      <NextSeo
        title={`${post.title}`}
        description={post.description}
        openGraph={{
          url: `${siteConfig.details.url}`,
          title: `${post.title}`,
          description: post.description,
          images: [
            {
              url: `https://cover-images.vercel.app/api?postTitle=${post.title}&postDescription=${post.description}&backgroundColor=1a202c&foregroundColor=fff&authorAvatar=${siteConfig.details.url}${siteConfig.assets.favicon}&authorName=${siteConfig.details.title}`,
              width: 1200,
              height: 675,
              alt: post.title,
            },
          ],
          site_name: siteConfig.details.title,
          type: "article",
          locale: "en_IE",
        }}
      />
      <div className="max-w-4xl mx-auto">
        <TableOfContent
          hasToc={frontmatter.toc}
          isTocOpen={isTocOpen}
          setTocOpen={setTocOpen}
        />
        <ScrollToTop isFixed top={1000} />
        <Breadcrumbs title={post.title} />
        <FrontMatter
          frontmatter={frontmatter}
          handleScrollToComments={handleScrollToComments}
        />
        <div>
          <Image
            src={post.thumbnail.url}
            layout="responsive"
            className="rounded-md"
            width={400}
            height={270}
            alt={`${post.title}-image`}
            objectFit="cover"
          />
          <div className="text-center text-xs lg:text-sm mt-2 lg:mt-4">
            Image from
            <a
              className="hover:text-orange mx-2 dark:hover:text-mint inline-block"
              href={post.thumbnail.from}
              target="_blank"
              rel="noreferrer noopener"
            >
              {post.thumbnail.author}
            </a>
            on Unsplash
          </div>
        </div>

        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease, delay: 0.3 }}
        >
          <Component components={components} />
        </motion.article>

        <PostComments slug={frontmatter.slug} ref={ref} />
        <GoBackButton path="/posts" title="Go back to posts" />
        <PostNavs adjacentPosts={adjacentPosts} />
        <MobileNav
          handleScrollToComments={handleScrollToComments}
          hasToc={frontmatter.toc}
          setOpenDrawer={(openDrawer) => setTocOpen(openDrawer)}
        />
      </div>
    </motion.div>
  );
};

export default PostPage;

export async function getStaticPaths() {
  const paths = getAllPostsPaths();
  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.slug as string;
  const post = getPost(slug);

  if (!post) {
    return {
      notFound: true,
    };
  }
  const adjacentPosts = getAdjacentPosts(slug);

  return { props: { post, adjacentPosts } };
};

PostPage.getLayout = function getLayout(page: ReactElement) {
  return <PostLayout>{page}</PostLayout>;
};

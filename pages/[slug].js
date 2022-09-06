import Error from "next/error";
import { useRouter } from "next/router";
import { groq } from "next-sanity";

import Layout from "../components/common/Layout";
import LandingPage from "../components/LandingPage";
import { getClient, usePreviewSubscription } from "../utils/sanity";

const query = groq`*[_type == "route" && slug.current == $slug][0]{
  page->
}`;

function ProductPageContainer({ pageData, preview, slug }) {
  const router = useRouter();
  if (!router.isFallback && !pageData) {
    return <Error statusCode={404} />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: { page = {} } = {} } = usePreviewSubscription(query, {
    params: { slug },
    initialData: pageData,
    enabled: preview || router.query.preview !== null,
  });

  return (
    <Layout>
      {!router.isFallback && !pageData ? (
        <Error statusCode={404} />
      ) : (
        <LandingPage page={page} />
      )}
    </Layout>
  );
}

export async function getStaticProps({ params = {}, preview = false }) {
  const { slug } = params;
  const { page: pageData } = await getClient(preview).fetch(query, {
    slug,
  });

  return {
    props: { preview, pageData, slug },
  };
}

export async function getStaticPaths() {
  const routes = await getClient()
    .fetch(`*[_type == "route" && defined(slug.current)]{
    "params": {"slug": slug.current}
  }`);

  return {
    paths: routes || null,
    fallback: true,
  };
}

export default ProductPageContainer;

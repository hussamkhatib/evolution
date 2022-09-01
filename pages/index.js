import Error from "next/error";
import { useRouter } from "next/router";

import ProductsPage from "../components/ProductsPage";
import { getClient, usePreviewSubscription } from "../utils/sanity";

const query = `//groq
  *[_type == "product" && defined(slug.current)]
`;

function IndexPage(props) {
  const { productsData, preview } = props;
  const router = useRouter();
  const { data: products } = usePreviewSubscription(query, {
    initialData: productsData,
    enabled: preview || router.query.preview !== null,
  });

  if (!router.isFallback && !productsData) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="my-8">
      <div className="mt-4">
        <ProductsPage products={products} />
      </div>
    </div>
  );
}

export async function getStaticProps({ params = {}, preview = false }) {
  const productsData = await getClient(preview).fetch(query);
  console.log({ productsData });
  return {
    props: {
      preview,
      productsData,
    },
  };
}

export default IndexPage;

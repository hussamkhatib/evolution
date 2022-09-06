/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";

import Layout from "../../components/common/Layout";
import { PortableText, urlFor } from "../../utils/sanity";
import Cta from "../Cta";

function Hero(props) {
  const { heading, backgroundImage, tagline, ctas } = props;

  return (
    <Layout>
      <div>
        <div className="container mx-auto px-6 mt-4">
          <div className="md:flex md:items-center">
            <div className="w-full max-w-lg mx-auto mt-5 md:ml-8 md:mt-0 md:w-1/2">
              <h3 className="text-gray-700 uppercase text-lg">{heading}</h3>
              {tagline && <PortableText blocks={tagline} />}
              {ctas && (
                <div>
                  {ctas.map((cta) => (
                    <Cta {...cta} key={cta._key} />
                  ))}
                </div>
              )}
            </div>
            <div className="w-full h-64 md:w-1/2 lg:h-96">
              <img
                className="h-full w-full rounded-md object-cover max-w-lg mx-auto"
                src={urlFor(backgroundImage)
                  .width(1051)
                  .auto("format")
                  .fit("crop")
                  .quality(80)}
                alt={backgroundImage.alt}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

Hero.propTypes = {
  heading: PropTypes.string,
  backgroundImage: PropTypes.object,
  tagline: PropTypes.array,
  ctas: PropTypes.arrayOf(PropTypes.object),
};

export default Hero;

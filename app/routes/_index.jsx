import { defer } from '@shopify/remix-oxygen';
import { Await, useLoaderData, Link } from '@remix-run/react';
import { Suspense } from 'react';
import { Image, Money } from '@shopify/hydrogen';

/**
 * @type {V2_MetaFunction}
 */
export const meta = () => {
  return [{ title: 'Hydrogen | Home' }];
};

/**
 * @param {LoaderArgs}
 */
export async function loader({ context }) {
  const { storefront } = context;
  const { collections } = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const rotational = [
    { text: "Truly’s Coco Cloud is the best bikini line shave cream of 2023", logo: "//www.trulybeauty.com/cdn/shop/files/style-in-logo.jpg?v=1684472999" },
    { text: "Unicorns Fruit’s texture is too good to pass up", logo: "//www.trulybeauty.com/cdn/shop/files/elle-logo_large_2c1c4b86-3354-4e96-927c-3623d65cd8e4.jpg?v=1666162336" },
    { text: "Truly’s shave butter is like cotton candy for your body", logo: "//www.trulybeauty.com/cdn/shop/files/allure-logo_300x150_8117557b-30ba-4da1-8b73-1866f94ce5e7.png?v=1678193719" },
  ]

  return defer({ featuredCollection, recommendedProducts, rotational });
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  console.log("data: ", data)
  return (
    <div className="home">
      <Banner />
      <RotationalBar data={data.rotational} />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function Banner() {
  let image = "https://www.trulybeauty.com/cdn/shop/files/Home_D.jpg"
  return (
    <div className="shopify-section home_slideshow_section">
      <Link to="/collections/truly-halloween-collection" className="d-block">
        {image && (
          <Image src={image} sizes="100vw" />
        )}
      </Link>
    </div>
  );
}

function RotationalBar({ data }) {
  return (
    <div className="shopify-section rotationalbar">
      <div className="commonSection InStyleWrap">
        <div className="wrapper-fluid hideOnTab">
          <div className="gridrow g-0 InStyle__Row">
            {data.map((opt, i) => {
              return (
                <div className='column-12 column-lg-4 ' key={i}>
                  <div className="InStyle__Box">
                    <h3><span><span>{opt?.text}</span></span></h3>
                    <span><img src={opt?.logo} alt="logo" /></span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * @param {{
        *   collection: FeaturedCollectionFragment;
 * }}
      */
function FeaturedCollection({ collection }) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

/**
 * @param {{
        *   products: Promise<RecommendedProductsQuery>;
 * }}
      */
function RecommendedProducts({ products }) {
  return (
    <div className="commonSection firstSectionSlider pb-0 slickAbsoluteArrow">
      <div className='wrapper posRelative'>
        <div className="headingholder">
          <h3 className="headingholder__title"> Top 4 Products In October</h3>
          <p>Powerful Ingredients + Irresistible Scents </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {({ products }) => (
              <div className="gridrow homeproductSlider--style">
                {products.nodes.map((product) => (
                  <>
                    {console.log("products: ", products)}
                    <Link
                      key={product.id}
                      className="column-6 column-sm-6 column-md-4 column-xl-3 "
                      to={`/products/${product.handle}`}
                    >
                      <div className="productBox__outer">
                        <div className="productBox productBox__1 text-align-center">

                          <div className="productBox__img">
                            <div className="productBox__imgSlider">
                              <div className="productBox__imgSlides">
                                <Image
                                  data={product.images.nodes[0]}
                                  aspectRatio="0"
                                  size={"100vw"}
                                />
                              </div>
                            </div>
                          </div>
                          <div className='d-block productBox__cntnt'>
                            <h5 className='productBox__title mb-1'>{product.title}</h5>
                            <p></p>
                            <div className='productBox__btnHolder pb-2'>
                              <div className='productBox__price mb-2 h6 price--on-sale'>
                                <span className="money">
                                  <Money data={product.priceRange.minVariantPrice} />
                                  {product.priceRange.minVariantPrice?.amount !== product.priceRange.maxVariantPrice?.amount ?
                                    <del className="price__sale"><span className="money">
                                      <Money data={product.priceRange.maxVariantPrice} />
                                    </span></del>
                                    : null
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
        <br />
      </div>
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
      fragment FeaturedCollection on Collection {
        id
    title
      description
      image {
        id
      url
      altText
      width
      height
    }
      handle
  }
      query FeaturedCollection($country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
        collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
        nodes {
        ...FeaturedCollection
      }
    }
  }
      `;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
      fragment RecommendedProduct on Product {
          id
          title
          handle
          priceRange {
            minVariantPrice {
            amount
            currencyCode
          }
            maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          nodes {
          id
          url
        altText
        width
        height
        }
      }
    }
      query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
        products(first: 4, sortKey: UPDATED_AT, reverse: true) {
        nodes {
        ...RecommendedProduct
      }
    }
  }
      `;

/** @typedef {import('@shopify/remix-oxygen').LoaderArgs} LoaderArgs */
/** @template T @typedef {import('@remix-run/react').V2_MetaFunction<T>} V2_MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

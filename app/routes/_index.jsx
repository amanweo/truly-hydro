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

  const { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle: "best-sellers" },
  });

  const { collections } = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const rotational = [
    { text: "Truly’s Coco Cloud is the best bikini line shave cream of 2023", logo: "//www.trulybeauty.com/cdn/shop/files/style-in-logo.jpg?v=1684472999" },
    { text: "Unicorns Fruit’s texture is too good to pass up", logo: "//www.trulybeauty.com/cdn/shop/files/elle-logo_large_2c1c4b86-3354-4e96-927c-3623d65cd8e4.jpg?v=1666162336" },
    { text: "Truly’s shave butter is like cotton candy for your body", logo: "//www.trulybeauty.com/cdn/shop/files/allure-logo_300x150_8117557b-30ba-4da1-8b73-1866f94ce5e7.png?v=1678193719" },
  ]

  return defer({ featuredCollection, recommendedProducts, rotational, collection });
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  console.log("data: ", data)
  return (
    <div className="home">
      <Banner />
      <RotationalBar data={data.rotational} />
      <BestSellers products={data.collection.products} />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function Banner() {
  let image = "https://www.trulybeauty.com/cdn/shop/files/Desktop_1900x670_withcopy_26565d46-86c5-4f07-b24a-74fbcd1033cf.jpg"
  return (
    <div className="home_slideshow_section">
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
    <div className="rotationalbar">
      <div className="container-fluid">
        <div className="row gx-0">
          {data.map((opt, i) => {
            return (
              <div className='col-md-4' key={i}>
                <div className="InStyle__Box">
                  <h3><span><span>{opt?.text}</span></span></h3>
                  <div className='InStyle__Box_logo'><img src={opt?.logo} alt="logo" height={34} /></div>
                </div>
              </div>
            )
          })}
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

function ProductRender({ products }) {
  return (
    <div className="row">
      {console.log("products: ", products)}
      {products.nodes && products.nodes.map((product) => (
        <>
          <Link
            key={product.id}
            className="col-6 col-sm-6 col-md-4 col-xl-3 "
            to={`/products/${product.handle}`}
          >
            <div className="productBox__outer">
              <div className="productBox__img">
                <div className="productBox__img_front">
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="0"
                    size={"100vw"}
                  />
                </div>
                <div className="productBox__img_back">
                  <Image
                    data={product.images.nodes[1]}
                    aspectRatio="0"
                    size={"100vw"}
                  />
                </div>
                <div className='quick_view_product'>
                  <button className='btn btn-primary w-100 btn-sm'>Quick View</button>
                </div>
              </div>
              <div className='productBox__content'>
                <h4 className='productBox__title'>{product.title}</h4>
                <div className='productBox__price'>
                  <Money data={product.priceRange.minVariantPrice} />
                  {product.priceRange.minVariantPrice?.amount !== product.priceRange.maxVariantPrice?.amount ?
                    <del className="price__sale ms-3">
                      <Money data={product.priceRange.maxVariantPrice} />
                    </del>
                    : null
                  }
                </div>
              </div>
            </div>
          </Link>
        </>
      ))}
    </div>
  )
}

/**
 * @param {{
        *   products: Promise<RecommendedProductsQuery>;
 * }}
      */
function RecommendedProducts({ products }) {
  return (
    <div className="commonSection firstSectionSlider pb-0 slickAbsoluteArrow">
      <div className='container-fluid'>
        <div className="headingholder">
          <h3 className="headingholder__title"> Top 4 Products In October</h3>
          <p>Powerful Ingredients + Irresistible Scents </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {({ products }) => (
              <ProductRender products={products} />
            )}
          </Await>
        </Suspense>
        <br />
      </div>
    </div>
  );
}
function BestSellers({ products }) {
  console.log("products best: ", products)
  return (
    <div className="commonSection firstSectionSlider pb-0 slickAbsoluteArrow">
      <div className='container-fluid'>
        <div className="headingholder">
          <p>Check our</p>
          <h2>Bestsellers</h2>
        </div>
        <ProductRender products={products} />
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

const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: 4
      ) {
        nodes {
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
          images(first: 2) {
            nodes {
            id
            url
            altText
            width
            height
            }
          }
        }
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
        images(first: 2) {
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

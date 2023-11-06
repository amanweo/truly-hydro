import { defer } from '@shopify/remix-oxygen';
import { Await, useLoaderData, Link } from '@remix-run/react';
import { Suspense, useState } from 'react';
import { Image, Money } from '@shopify/hydrogen';
import Slider from "react-slick";
import ReactDOM from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

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
  const [showView, setshowView] = useState(false)
  const [quickViewData, setQuickViewData] = useState({})
  const [swiper, setSwiper] = useState(null);

  function showQuickView(data) {
    document.body.classList.add("modal_open");
    setQuickViewData(data)
    setshowView(true)

    const customComponentRoot = document.createElement('div');
    customComponentRoot.classList.add("quickview_modal_outer")
    document.body.appendChild(customComponentRoot);
    return () => {
      document.body.removeChild(customComponentRoot);
    };
  }
  function closeModal() {
    document.body.classList.remove("modal_open");
    const childElement = document.querySelector('.quickview_modal_outer');
    if (childElement) {
      document.body.removeChild(childElement);
    }
    setQuickViewData({})
    setshowView(false)
  }

  return (
    <div className="home">
      <Banner />
      <RotationalBar data={data.rotational} />
      <BestSellers products={data.collection.products} showQuickView={showQuickView} />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <RecommendedProducts products={data.recommendedProducts} showQuickView={showQuickView} />
      {showView && ReactDOM.createPortal(
        <QuickView product={quickViewData} closeModal={closeModal} setSwiper={setSwiper} />,
        document.querySelector('.quickview_modal_outer')
      )}
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

function ProductRender({ products, showQuickView }) {
  return (
    <div className="row">
      {console.log("products: ", products)}
      {products.nodes && products.nodes.map((product) => (
        <>
          <div
            key={product.id}
            className="col-6 col-sm-6 col-md-4 col-xl-3 "
          >
            <div className="productBox__outer">
              <div className="productBox__img">
                <Link to={`/products/${product.handle}`}>
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
                </Link>
                <div className='quick_view_product'>
                  <button className='btn btn-primary w-100 btn-sm' onClick={() => showQuickView(product)}>Quick View</button>
                </div>
              </div>
              <Link to={`/products/${product.handle}`} className='productBox__content'>
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
              </Link>
            </div>
          </div>
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
function RecommendedProducts({ products, showQuickView }) {
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
              <ProductRender products={products} showQuickView={showQuickView} />
            )}
          </Await>
        </Suspense>
        <br />
      </div>
    </div>
  );
}
function BestSellers({ products, showQuickView }) {
  console.log("products best: ", products)
  return (
    <div className="commonSection firstSectionSlider pb-0 slickAbsoluteArrow">
      <div className='container-fluid'>
        <div className="headingholder">
          <p>Check our</p>
          <h2>Bestsellers</h2>
        </div>
        <ProductRender products={products} showQuickView={showQuickView} />
        <br />
      </div>
    </div>
  );
}

function QuickView({ product, closeModal, setSwiper }) {
  console.log("product quick:", product)
  return (
    <div className='quickview_modal'>
      <div className='quickview_modal_backdrop' onClick={closeModal}></div>
      <div className='quickview_modal_body'>
        <div className='row gx-5'>
          <div className='col-md-6'>
            <div className='product_detail_images'>
              <div className='product_detail_single_image'>
                <Image
                  alt={product?.images?.nodes[0].altText || 'Product Image'}
                  aspectRatio="0"
                  data={product?.images?.nodes[0]}
                  sizes="100vw"
                  style={{ borderRadius: 20 }}
                />
              </div>
              <div className='product_image_thumb'>
                {/* <Await resolve={product?.images?.nodes}> */}
                <Swiper
                  spaceBetween={0}
                  slidesPerView={3}
                  direction={'vertical'}
                  onSlideChange={() => console.log('slide change')}
                  onSwiper={(swiper) => setTimeout(() => {
                    alert()
                    swiper.update()
                  }, 3000)}
                  autoHeight={true}
                >
                  {product?.images?.nodes.map((img, i) => {
                    return (
                      <SwiperSlide key={i}>
                        <button className='noStyle d-block'>
                          <Image
                            alt={img.altText || 'Product Image'}
                            aspectRatio="0"
                            data={img}
                            sizes="100vw"
                            style={{ borderRadius: 10 }}
                          />
                        </button>
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
                {/* </Await> */}
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='product_details'>
              <h3 className='mdEx'>{product?.title}</h3>
              <div className='d-flex'>
                <Money data={product.priceRange.minVariantPrice} as="h4" />
                {product.priceRange.minVariantPrice?.amount !== product.priceRange.maxVariantPrice?.amount ?
                  <del className="del_price ms-3">
                    <Money data={product.priceRange.maxVariantPrice} as="h4" />
                  </del>
                  : null
                }
              </div>
              {product?.description ?
                <div className='mb-2'>
                  {product?.description.substring(0, 200)}...
                </div>
                : null
              }
              <Link to={`/products/${product.handle}`} className='link'>Read more</Link>
              <div className='add_to_cart_block mt-3'>
                <button className='btn btn-primary'>Add to Bag</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
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
          description
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
          images(first: 100) {
            nodes {
            id
            url
            altText
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
        images(first: 100) {
          nodes {
          id
          url
          altText
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

import { json, redirect } from '@shopify/remix-oxygen';
import { useLoaderData, Link, useLocation, useNavigate } from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import { useVariantUrl } from '~/utils';
import { ProductBlock, ProductRender, QuickView } from './_index';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { useInView } from "react-intersection-observer";

/**
 * @type {V2_MetaFunction}
 */
export const meta = ({ data }) => {
  return [{ title: `Hydrogen | ${data.collection.title} Collection` }];
};

/**
 * @param {LoaderArgs}
 */
export async function loader({ request, params, context }) {
  const { handle } = params;
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle, ...paginationVariables },
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }
  return json({ collection });
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const { collection } = useLoaderData();
  const { ref, inView, entry } = useInView();
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation()
  const [showView, setshowView] = useState(false)
  const [activeSlide, setActiveSlide] = useState({})
  const [quickViewData, setQuickViewData] = useState({})

  function showQuickView(data) {
    document.body.classList.add("modal_open");
    setQuickViewData(data)
    setshowView(true)
    setActiveSlide(data?.images?.nodes[0])
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

  const [metaFields, setmetaFields] = useState({})
  useEffect(() => {
    let newObj = {}
    quickViewData && quickViewData.metafields && quickViewData.metafields.length > 0 && quickViewData.metafields.map((opt) => {
      if (opt) {
        newObj[opt.key] = opt.value
      }
    })
    console.log("newObj: ", newObj)
    setmetaFields(newObj)
  }, [quickViewData])

  const handleSlideChange = () => {
    if (swiperRef.current) {
      console.log('Active slide index:', swiperRef.current.swiper.realIndex);
      let index = swiperRef.current.swiper.realIndex
      if (index > -1) {
        setActiveSlide(quickViewData?.images?.nodes[index])
      }
    }
  };

  const handleThumbnailClick = (index) => {
    if (swiperRef.current) {
      if (index > -1) {
        console.log("swiperRef: ", swiperRef.current.swiper.slides[index])
        // swiperRef.current.swiper.slideTo(index);
        if (swiperRef.current.swiper.slides.length > 0) {
          swiperRef.current.swiper.slides.forEach(element => {
            element.classList.remove("swiper-slide-active")
          });
        }
        swiperRef.current.swiper.slides[index].classList.add("swiper-slide-active")
        setActiveSlide(quickViewData?.images?.nodes[index])
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      console.log("window.StampedFn: ", StampedFn)
      if (StampedFn) {
        StampedFn.init({ apiKey: "pubkey-y0bQR825X6K52BT67V84qf3OGso3o0", storeUrl: "trulyorganic.myshopify.com" })
      }
      StampedFn.reloadUGC();
    }, 1000);
  }, [])

  useEffect(() => {
    setTimeout(() => {
      console.log("window.StampedFn: ", StampedFn)
      if (StampedFn) {
        StampedFn.init({ apiKey: "pubkey-y0bQR825X6K52BT67V84qf3OGso3o0", storeUrl: "trulyorganic.myshopify.com" })
      }
      StampedFn.reloadUGC();
    }, 1000);
  }, [collection.products, showView])


  console.log("collection: ", collection)
  return (
    <div className="collection">
      <div className='collection_banner'>
        <Image
          alt={collection?.image?.altText}
          aspectRatio="0"
          data={collection?.image}
          sizes="200vw"
        />
      </div>
      <div className="commonSection">
        <div className="container-fluid">
          <div className="headingholder">
            {/* <h1>{collection.title}</h1> */}
          </div>

          {/* <Pagination connection={collection.products}>
            {({ nodes, NextLink, hasNextPage, nextPageUrl, state }) => (
              <>
                <ProductRender products={nodes} showQuickView={showQuickView} location={location} />
                <br />
                <div className='text-center'>
                  <NextLink className='btn btn-primary' ref={ref}>
                    {isLoading ? 'Loading...' : <span>Load more</span>}
                  </NextLink>
                </div>
              </>
            )}
          </Pagination> */}
          <Pagination connection={collection.products}>
            {({ nodes, NextLink, hasNextPage, nextPageUrl, state, isLoading }) => (
              <>
                {nodes.length > 0 ?
                  <>
                    <ProductsLoadedOnScroll
                      nodes={nodes}
                      inView={inView}
                      hasNextPage={hasNextPage}
                      nextPageUrl={nextPageUrl}
                      state={state}
                      showQuickView={showQuickView}
                      location={location}
                    />
                    <div className='text-center'>
                      <NextLink className='btn btn-primary' ref={ref}>
                        {isLoading ? 'Loading...' : ""}
                      </NextLink>
                    </div>
                  </>
                  : null
                }
              </>
            )}
          </Pagination>

        </div>
      </div>

      {showView && ReactDOM.createPortal(
        <QuickView
          product={quickViewData}
          location={location}
          metaFields={metaFields}
          closeModal={closeModal}
          handleSlideChange={handleSlideChange}
          swiperRef={swiperRef}
          activeSlide={activeSlide}
          handleThumbnailClick={handleThumbnailClick}
        />,
        document.querySelector('.quickview_modal_outer')
      )}
    </div>
  );
}

export function ProductsLoadedOnScroll({ nodes, inView, hasNextPage, nextPageUrl, state, showQuickView, location }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (inView && hasNextPage) {
      navigate(nextPageUrl, {
        replace: true,
        preventScrollReset: true,
        state,
      });
    }
  }, [inView, navigate, state, nextPageUrl, hasNextPage]);

  return (
    <ProductRender products={nodes} showQuickView={showQuickView} location={location} />
  )
}


const PRODUCT_VARIANT_FRAGMENT = `#graphql
      fragment ProductVariant on ProductVariant {
        availableForSale
    compareAtPrice {
        amount
      currencyCode
    }
      id
      image {
        __typename
      id
      url
      altText
      width
      height
    }
      price {
        amount
      currencyCode
    }
      product {
        title
      handle
    }
      selectedOptions {
        name
      value
    }
      sellingPlanAllocations(first:1){
        edges{
        node{
        sellingPlan{
        id
      }
      priceAdjustments{
        price{
        amount
              currencyCode
            }
          }
        }
      }
    }
      sku
      title
      unitPrice {
        amount
      currencyCode
    }
  }
`;


const PRODUCT_ITEM_FRAGMENT = `#graphql
${PRODUCT_VARIANT_FRAGMENT}
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    images(first: 100) {
      nodes {
        id
        url
        altText
      }
    }
    sellingPlanGroups(first: 3) {
      edges {
      node {
      name
          appName
    options {
      name
            values
          }
    sellingPlans(first: 3) {
      edges {
      node {
      id
              name
    options{
      value
                name
              }
            }
          }
        }
        }
      }
    }
    metafields(
    identifiers: [{namespace: "accentuate", key: "bundle_product_short_title"}, {namespace: "accentuate", key: "sub_title_one"}, {namespace: "accentuate", key: "sub_title_two"}, {namespace: "accentuate", key: "sub_title_one"}, {namespace: "accentuate", key: "bundle_good_to_know"}, {namespace: "accentuate", key: "good_to_know_title"}, {namespace: "accentuate", key: "good_to_know"}, {namespace: "accentuate", key: "bundle_product_short_descripti"}, {namespace: "accentuate", key: "description"}, {namespace: "accentuate", key: "bundle_whats_inside"}, {namespace: "accentuate", key: "whats_inside_title"}, {namespace: "accentuate", key: "bundle_why_it_special_description"}, {namespace: "accentuate", key: "bundle_why_it_special"}, {namespace: "accentuate", key: "why_its_special"}, {namespace: "accentuate", key: "bundle_what_makes_good_title"}, {namespace: "accentuate", key: "bundle_what_makes_good_descrip"}, {namespace: "accentuate", key: "title"}, {namespace: "accentuate", key: "essential_ingradient_main_titl"}, {namespace: "accentuate", key: "description_essen"}, {namespace: "accentuate", key: "key_ingredients"}, {namespace: "accentuate", key: "full_ingradient_main_titl"}, {namespace: "accentuate", key: "full_ingredient_text"}, {namespace: "accentuate", key: "full_ingredient_title"}, {namespace: "product", key: "key_ingredients_text"}]
    ) {
      key
    value
  }

    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url
        altText
      }
      products(
        first: 15,
        before: $startCursor, after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderArgs} LoaderArgs */
/** @template T @typedef {import('@remix-run/react').V2_MetaFunction<T>} V2_MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

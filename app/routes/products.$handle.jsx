import { Suspense, useEffect } from 'react';
import { defer, redirect } from '@shopify/remix-oxygen';
import { Await, Link, useLoaderData, useLocation } from '@remix-run/react';

import {
  Image,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import { getVariantUrl } from '~/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useRef } from 'react';
import { useState } from 'react';
import LightGallery from 'lightgallery/react';

import lgZoom from 'lightgallery/plugins/zoom';

/**
 * @type {V2_MetaFunction}
 */
export const meta = ({ data }) => {
  return [{ title: `Hydrogen | ${data.product.title}` }];
};

/**
 * @param {LoaderArgs}
 */
export async function loader({ params, request, context }) {
  const { handle } = params;
  const { storefront } = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle, selectedOptions },
  });

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      return redirectToFirstVariant({ product, request });
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: { handle },
  });

  return defer({ product, variants });
}

/**
 * @param {{
 *   product: ProductFragment;
 *   request: Request;
 * }}
 */
function redirectToFirstVariant({ product, request }) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  throw redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const { product, variants } = useLoaderData();
  console.log("selected product: ", product);
  const { selectedVariant } = product;
  const swiperRef = useRef(null);
  const location = useLocation()
  const [activeSlide, setActiveSlide] = useState(product?.images?.nodes[0] || {})


  const handleSlideChange = () => {
    if (swiperRef.current) {
      let index = swiperRef.current.swiper.realIndex
      if (index > -1) {
        setActiveSlide(product?.images?.nodes[index])
      }
    }
  };

  const handleThumbnailClick = (index) => {
    if (swiperRef.current) {
      if (index > -1) {
        if (swiperRef.current.swiper.slides.length > 0) {
          swiperRef.current.swiper.slides.forEach(element => {
            element.classList.remove("swiper-slide-active")
          });
        }
        swiperRef.current.swiper.slides[index].classList.add("swiper-slide-active")
        setActiveSlide(product?.images?.nodes[index])
      }
    }
  }

  useEffect(() => {
    document.body.classList.remove("modal_open");
  }, [location.pathname])

  const onBeforeSlide = (detail) => {
    const { index, prevIndex } = detail;
    console.log(index, prevIndex);
  };
  const onAfterClose = () => {
    document.body.classList.remove("modal_open");
  };
  const onAfterOpen = () => {
    onSlideItemLoad()
  }

  const onSlideItemLoad = () => {
    setTimeout(() => {      
      document.body.classList.add("modal_open");
    }, 200);
  }

  return (
    <div className="commonSection product-page">
      <div className="container-fluid">
        <div className="row gx-5">
          <div className="col-lg-6 col-md-6">
            <div className='product_detail_images'>
              <div className='product_detail_single_image'>
                <LightGallery
                  elementClassNames="custom-wrapper-class"
                  onBeforeSlide={onBeforeSlide}
                  onAfterClose={onAfterClose}
                  onAfterOpen={onAfterOpen}
                  // onSlideItemLoad={onSlideItemLoad}
                  plugins={[lgZoom]}
                  download={false}
                  infiniteZoom={false}
                  hideScrollbar={true}
                  speed={100}
                  mode="lg-fade"
                >

                  <a data-src={activeSlide?.url} className='product_slides activeSlide' style={{cursor: "crosshair"}}>
                    <Image
                      alt={activeSlide.altText || ''}
                      aspectRatio="0"
                      data={activeSlide}
                      sizes="200vw"
                    />
                  </a>
                  {product?.images?.nodes.filter((x) => x?.id !== activeSlide?.id).map((img, i) => {
                    return (
                      <a data-src={img?.url} key={i + 1} className='product_slides'>
                        <Image
                          alt={img.altText || ''}
                          aspectRatio="0"
                          data={img}
                          sizes="200vw"
                        />
                      </a>
                    )
                  })}
                </LightGallery>
              </div>
              <div className='product_image_thumb'>
                <Swiper
                  spaceBetween={0}
                  slidesPerView={4}
                  direction={'vertical'}
                  onSlideChange={handleSlideChange}
                  autoHeight={true}
                  navigation={true, {
                    nextEl: '.custom-next-arrow',
                    prevEl: '.custom-prev-arrow',
                  }}
                  modules={[Navigation]}
                  ref={swiperRef}
                  onSwiper={(swiper) => console.log("swiper", swiper)}
                >
                  <div className="custom_arrows custom-prev-arrow">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.29289 9.29289C4.90237 9.68342 4.90237 10.3166 5.29289 10.7071C5.68342 11.0976 6.31658 11.0976 6.70711 10.7071L5.29289 9.29289ZM12 4L12.7071 3.29289C12.3166 2.90237 11.6834 2.90237 11.2929 3.29289L12 4ZM17.2929 10.7071C17.6834 11.0976 18.3166 11.0976 18.7071 10.7071C19.0976 10.3166 19.0976 9.68342 18.7071 9.29289L17.2929 10.7071ZM6.70711 10.7071L12.7071 4.70711L11.2929 3.29289L5.29289 9.29289L6.70711 10.7071ZM11.2929 4.70711L17.2929 10.7071L18.7071 9.29289L12.7071 3.29289L11.2929 4.70711Z" fill="#fff"></path>
                      <path d="M12 4L12 20" stroke="#fff" strokewidth="2" strokeLinecap="round" strokelinejoin="round"></path>
                    </svg>
                  </div>
                  <div className="custom_arrows custom-next-arrow">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.7071 14.7071C19.0976 14.3166 19.0976 13.6834 18.7071 13.2929C18.3166 12.9024 17.6834 12.9024 17.2929 13.2929L18.7071 14.7071ZM12 20L11.2929 20.7071C11.6834 21.0976 12.3166 21.0976 12.7071 20.7071L12 20ZM6.70711 13.2929C6.31658 12.9024 5.68342 12.9024 5.29289 13.2929C4.90237 13.6834 4.90237 14.3166 5.29289 14.7071L6.70711 13.2929ZM17.2929 13.2929L11.2929 19.2929L12.7071 20.7071L18.7071 14.7071L17.2929 13.2929ZM12.7071 19.2929L6.70711 13.2929L5.29289 14.7071L11.2929 20.7071L12.7071 19.2929Z" fill="#fff"></path>
                      <path d="M12 20L12 4" stroke="#fff" strokewidth="2" strokeLinecap="round" strokelinejoin="round"></path>
                    </svg>
                  </div>
                  {product?.images?.nodes.map((img, i) => {
                    return (
                      <SwiperSlide key={i} onClick={() => handleThumbnailClick(i)}>
                        <button className='noStyle d-block'>
                          <Image
                            alt={img.altText || 'Product Image'}
                            aspectRatio="0"
                            data={img}
                            sizes="200vw"
                          />
                        </button>
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              </div>
            </div>
          </div>
          <div className='col-lg-6 col-md-6'>
            <ProductMain
              selectedVariant={selectedVariant}
              product={product}
              variants={variants}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{image: ProductVariantFragment['image']}}
 */
function ProductImage({ image }) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="0"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 200vw"
      />
    </div>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Promise<ProductVariantsQuery>;
 * }}
 */
function ProductMain({ selectedVariant, product, variants }) {
  const { title, descriptionHtml } = product;
  const [read, setRead] = useState(false)
  return (
    <div className="product-main">
      <h1>{title}</h1>
      <ProductPrice selectedVariant={selectedVariant} />
      <br />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <br />
      <br />
      <p>
        <strong>Description</strong>
      </p>
      <br />
      <div className={`product_description ${read ? "full" : ""}`} dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
      <br />
      <p><a className='noStyle link' onClick={() => setRead(!read)}>Read {read ? "less" : "more"}</a></p>
    </div>
  );
}

/**
 * @param {{
 *   selectedVariant: ProductFragment['selectedVariant'];
 * }}
 */
function ProductPrice({ selectedVariant }) {
  return (
    <div className="product-price">
      {selectedVariant?.compareAtPrice ? (
        <>
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} as="h4" /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} as="h4" />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} as="h4" />
      )}
    </div>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Array<ProductVariantFragment>;
 * }}
 */
function ProductForm({ product, selectedVariant, variants }) {
  console.log("selectedVariant: ", selectedVariant)
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({ option }) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          setTimeout(() => {
            window.location.href = window.location.href + '#cart-aside';
          }, 500);
        }}
        lines={
          selectedVariant
            ? [
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
              },
            ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to Bag' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

/**
 * @param {{option: VariantOption}}
 */
function ProductOptions({ option }) {
  return (
    <div className="product-options" key={option.name}>
      {/* <h5>{option.name}</h5> */}
      <div className="product-options-grid">
        {option.values.map(({ value, isAvailable, isActive, to }) => {
          return (
            <Link
              className={`product-options-item ${isActive ? "active" : ""}`}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: CartLineInput[];
 *   onClick?: () => void;
 * }}
 */
function AddToCartButton({ analytics, children, disabled, lines, onClick }) {
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className='btn btn-primary btn-lg'
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
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
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    images(first: 100) {
      nodes {
        id
        url
        altText
      }
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderArgs} LoaderArgs */
/** @template T @typedef {import('@remix-run/react').V2_MetaFunction<T>} V2_MetaFunction */
/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantsQuery} ProductVariantsQuery */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
/** @typedef {import('@shopify/hydrogen').VariantOption} VariantOption */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineInput} CartLineInput */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').SelectedOption} SelectedOption */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

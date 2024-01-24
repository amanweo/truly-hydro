import { defer } from '@shopify/remix-oxygen';
import { Await, useLoaderData, Link, useLocation } from '@remix-run/react';
import { Suspense, useEffect, useState } from 'react';
import { CartForm, Image, Money } from '@shopify/hydrogen';
import ReactDOM from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Mousewheel, Navigation } from 'swiper/modules';
import { useRef } from 'react';
import Images from '~/components/images';
import { ProductMain, Stamped } from './products.$handle';
import { Accordion } from 'react-bootstrap';
import _ from "underscore"

/**
 * @type {V2_MetaFunction}
 */
export const meta = () => {
  return [{ title: 'Truly - Vegan. High Performance. Cruelty Free. Clean Beauty.  &ndash; Truly Beauty' }];
};

/**
 * @param {LoaderArgs}
 */
export async function loader({ context }) {
  const { storefront } = context;


  async function getCollection(name) {
    return await storefront.query(COLLECTION_QUERY, {
      variables: { handle: name },
    });
  }

  // const { collection1 } = await storefront.query(COLLECTION_LIST_QUERY, {
  //   variables: { handle: "bath" },
  // });
  // const { collection2 } = await storefront.query(COLLECTION_LIST_QUERY, {
  //   variables: { handle: "face" },
  // });

  const { collections } = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const rotational = [
    { text: "Truly’s Coco Cloud is the best bikini line shave cream of 2023", logo: "//www.trulybeauty.com/cdn/shop/files/style-in-logo.jpg?v=1684472999" },
    { text: "Unicorns Fruit’s texture is too good to pass up", logo: "//www.trulybeauty.com/cdn/shop/files/elle-logo_large_2c1c4b86-3354-4e96-927c-3623d65cd8e4.jpg?v=1666162336" },
    { text: "Truly’s shave butter is like cotton candy for your body", logo: "//www.trulybeauty.com/cdn/shop/files/allure-logo_300x150_8117557b-30ba-4da1-8b73-1866f94ce5e7.png?v=1678193719" },
  ]

  return defer({ featuredCollection, recommendedProducts, rotational, ...await getCollection("best-sellers"), collection1: await getCollection("bath"), collection2: await getCollection("face") });
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  const location = useLocation()
  console.log("data: ", data)
  const swiperRef = useRef(null);
  const [showView, setshowView] = useState(false)
  const [activeSlide, setActiveSlide] = useState({})
  const [quickViewData, setQuickViewData] = useState({})

  let collectionList = []
  for (let key in data) {
    if (key == "collection1" || key == "collection2") {
      collectionList.push(data[key]?.collection)
    }
  }

  // const [metaFields, setmetaFields] = useState({})
  // useEffect(() => {
  //   let newObj = {}
  //   quickViewData && quickViewData.metafields && quickViewData.metafields.length > 0 && quickViewData.metafields.map((opt) => {
  //     if (opt) {
  //       newObj[opt.key] = opt.value
  //     }
  //   })
  //   console.log("newObj: ", newObj)
  //   setmetaFields(newObj)
  // }, [quickViewData])

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("window.StampedFn: ", StampedFn)
  //     if (StampedFn) {
  //       StampedFn.init({ apiKey: "pubkey-y0bQR825X6K52BT67V84qf3OGso3o0", storeUrl: "trulyorganic.myshopify.com" })
  //     }
  //     StampedFn.reloadUGC();
  //   }, 500);
  // }, [showView])

  // function showQuickView(data) {
  //   document.body.classList.add("modal_open");
  //   setQuickViewData(data)
  //   setshowView(true)
  //   setActiveSlide(data?.images?.nodes[0])

  //   const customComponentRoot = document.createElement('div');
  //   customComponentRoot.classList.add("quickview_modal_outer")
  //   document.body.appendChild(customComponentRoot);
  //   return () => {
  //     document.body.removeChild(customComponentRoot);
  //   };
  // }

  // function closeModal() {
  //   document.body.classList.remove("modal_open");
  //   const childElement = document.querySelector('.quickview_modal_outer');
  //   if (childElement) {
  //     document.body.removeChild(childElement);
  //   }
  //   setQuickViewData({})
  //   setshowView(false)
  // }


  // const handleSlideChange = () => {
  //   if (swiperRef.current) {
  //     console.log('Active slide index:', swiperRef.current.swiper.realIndex);
  //     let index = swiperRef.current.swiper.realIndex
  //     if (index > -1) {
  //       setActiveSlide(quickViewData?.images?.nodes[index])
  //     }
  //   }
  // };

  // const handleThumbnailClick = (index) => {
  //   if (swiperRef.current) {
  //     if (index > -1) {
  //       console.log("swiperRef: ", swiperRef.current.swiper.slides[index])
  //       // swiperRef.current.swiper.slideTo(index);
  //       if (swiperRef.current.swiper.slides.length > 0) {
  //         swiperRef.current.swiper.slides.forEach(element => {
  //           element.classList.remove("swiper-slide-active")
  //         });
  //       }
  //       swiperRef.current.swiper.slides[index].classList.add("swiper-slide-active")
  //       setActiveSlide(quickViewData?.images?.nodes[index])
  //     }
  //   }
  // }

  // const handleDetail = () => {
  //   closeModal()
  // }

  // console.log("quickViewData", quickViewData)

  return (
    <div className="home">
      <Banner />
      <RotationalBar data={data.rotational} />
      <BestSellers products={data.collection.products} location={location} />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <ContentBlock />
      <CollectionBlock list={collectionList} />
      <RecommendedProducts products={data.recommendedProducts} location={location} />
      <CollectionProducts collection={data["collection1"]?.collection} location={location} />

      {/* {showView && ReactDOM.createPortal(
        <QuickView
          product={quickViewData}
          location={location}
          metaFields={metaFields}
          closeModal={closeModal}
          handleSlideChange={handleSlideChange}
          swiperRef={swiperRef}
          activeSlide={activeSlide}
          handleThumbnailClick={handleThumbnailClick}
          handleDetail={handleDetail}
        />,
        document.querySelector('.quickview_modal_outer')
      )} */}
    </div>
  );
}


export function AddToCartFunction({ analytics, children, lines, onClick }) {
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
            className='noStyle'
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}
export function AddToCartButton({ analytics, children, disabled, lines, onClick, size }) {
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
            className={`btn btn-primary mt-3 ${size == "sm" ? "btn-sm" : ""}`}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

function Banner() {
  let image = "https://www.trulybeauty.com/cdn/shop/files/Desktop_1900x670_withcopy_26565d46-86c5-4f07-b24a-74fbcd1033cf.jpg"
  return (
    <div className="home_slideshow_section">
      <Link to="/products/signature-body-mist-trio" className="d-block">
        {image && (
          <Image src={image} alt="" sizes="200vw" />
        )}
      </Link>
    </div>
  );
}

function RotationalBar({ data, active }) {
  return (
    <div className="rotationalbar">
      <div className="container-fluid">
        {/* {window.innerWidth > 991 ?
          <div className="row gx-0">
            {data.map((opt, i) => {
              return (
                <div className={`col-lg-4 ${active == i ? "active" : ""}`} key={i}>
                  <div className="InStyle__Box">
                    <h3><span><span>{opt?.text}</span></span></h3>
                    <div className='InStyle__Box_logo'>
                      <img src={opt?.logo} alt="logo" height={34} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          : */}
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={true}
          modules={[EffectFade, Autoplay]}
          breakpoints={{
            992: {
              slidesPerView: 3,
              spaceBetween: 0,
              loop: false,
              autoplay: true,
              effect: "fade"
            }
          }}
        >
          {data.map((opt, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="InStyle__Box">
                  <h3><span><span>{opt?.text}</span></span></h3>
                  <div className='InStyle__Box_logo'>
                    <img src={opt?.logo} alt="logo" height={34} />
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
        {/* } */}
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
          <Image data={image} sizes="200vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

export function ProductBlock({ product, showQuickView, location }) {
  const swiperRef = useRef(null);
  const [showView, setshowView] = useState(false)
  const [activeSlide, setActiveSlide] = useState({})
  const [quickViewData, setQuickViewData] = useState({})
  useEffect(() => {
    setTimeout(() => {
      if (StampedFn) {
        StampedFn.init({ apiKey: "pubkey-y0bQR825X6K52BT67V84qf3OGso3o0", storeUrl: "trulyorganic.myshopify.com" })
      }
      StampedFn.reloadUGC();
    }, 500);
  }, [showView])

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

  const [metaFields, setmetaFields] = useState({})
  useEffect(() => {
    let newObj = {}
    product && product?.metafields && product?.metafields.length > 0 && product?.metafields.map((opt) => {
      if (opt) {
        newObj[opt.key] = opt.value
      }
    })
    setmetaFields(newObj)
  }, [product])
  return (
    <div className="productBox__outer mb-4 mb-lg-5">
      <div className="productBox__img">
        <Link to={`/products/${product.handle}`}>
          <div className="productBox__img_front">
            <Image
              data={product.images.nodes[0]}
              aspectRatio="0"
              size={"200vw"}
            />
          </div>
          <div className="productBox__img_back">
            <Image
              data={product.images.nodes[1]}
              aspectRatio="0"
              size={"200vw"}
            />
          </div>
        </Link>
        <div className='quick_view_product'>
          <button className='btn btn-primary w-100 btn-sm noHover' onClick={() => showQuickView(product)}>Quick View</button>
        </div>
      </div>
      <Link to={`/products/${product.handle}`} className='productBox__content'>
        <h6 className='productBox__title'>{product.title}</h6>
        <Stamped
          type="review"
          product={product}
          location={location}
        />
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
      {showView && ReactDOM.createPortal(
        <QuickView
          product={product}
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
  )
}
export function ProductRender({ products, location }) {
  return (
    <div className="row">
      {console.log("products: ", products)}
      {products && products.map((product) => (
        <>
          <div
            key={product.id}
            className="col-6 col-sm-6 col-md-4 col-xl-20"
          >
            <ProductBlock product={product} location={location} />
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
function RecommendedProducts({ products, showQuickView, location }) {
  return (
    <div className="commonSection">
      <div className='container-fluid'>
        <div className="headingholder">
          <p>Powerful Ingredients + Irresistible Scents</p>
          <h2>New Arrivals</h2>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {({ products }) => (
              <ProductRender products={products.nodes} location={location} />
            )}
          </Await>
        </Suspense>
        <br />
      </div>
    </div>
  );
}
function BestSellers({ products, showQuickView, location }) {
  console.log("products best: ", products)
  return (
    <div className="commonSection">
      <div className='container-fluid'>
        <div className="headingholder">
          <p>Check our</p>
          <h2>Bestsellers</h2>
        </div>
        <ProductRender products={products.nodes} location={location} />
        <br />
      </div>
    </div>
  );
}

function ContentBlock() {
  return (
    <div className='text_over_image primary-bg'>
      {/* <div className='container-fluid'> */}
      <div className='row g-0 justify-content-between align-items-center'>
        <div className='col-lg-7 col-sm-6 d-none d-md-block'>
          <div className='bg_image_block pe-lg-1 pe-1'>
            <Image
              alt={""}
              aspectRatio="0"
              data={{ url: Images?.banner_shave }}
              sizes="200vw"
            />
            {/* <div className='col-sm-6'>
                <div className='bg_image_block'>
                  <Image
                    alt={""}
                    aspectRatio="0"
                    data={{ url: Images?.banner2 }}
                    sizes="200vw"
                  />
                </div>
              </div> */}
          </div>
        </div>
        <div className='col-lg-5 col-sm-6'>
          <div className='bg_image_text text-center'>
            <h2>The smoothest shave of all time</h2>
            <p>Tik tok famous shave routines proven to smooth, brighten & hydrate your skin.</p>
            <div className='mt-4'>
              <Link to="/collections/shaving" className='btn btn-primary w-auto'>Shop Shave</Link>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  )
}

function CollectionBlock(props) {
  return (
    <div className='row g-0 mt-2'>
      {props.list.length > 0 && props.list.map((opt, i) => {
        return (
          <Link to={`/collections/${opt?.handle}`} className="col-sm-6" key={i}>
            <div className={`collection_block_outer ${i % 2 == 0 ? "pe-1" : "ps-1"}`}>
              <div className="collection_block">
                <div className='collection_block_image mb-2 img-zoom'>
                  <Image
                    alt={opt?.title}
                    aspectRatio="0"
                    data={{ url: Images?.[`banner_${opt?.handle}`] }}
                    sizes="200vw"
                  />
                </div>
              </div>
              <div className='collection_block_content text-center'>
                <h2>{opt?.title}</h2>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function CollectionProducts(props) {
  return (
    <div className='commonSection'>
      <div className='container-fluid'>
        <div className='row justify-content-between align-items-center'>
          <div className='col-xl-5 col-md-6'>
            <div className='bg_image_block'>
              <Image
                alt={""}
                aspectRatio="0"
                data={{ url: Images?.banner_bath2 }}
                sizes="200vw"
              />
            </div>
          </div>
          <div className='col-md-6'>
            <div className="headingholder text-center mb-5">
              <h2>{props.collection?.title}</h2>
              <Link to={`/collections/${props.collection?.handle}`} className='btn btn-primary'>View All Products</Link>
            </div>
            <div className='collection_product_slider'>
              <div className="custom_arrows horizontal custom-prev-arrow">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.29289 9.29289C4.90237 9.68342 4.90237 10.3166 5.29289 10.7071C5.68342 11.0976 6.31658 11.0976 6.70711 10.7071L5.29289 9.29289ZM12 4L12.7071 3.29289C12.3166 2.90237 11.6834 2.90237 11.2929 3.29289L12 4ZM17.2929 10.7071C17.6834 11.0976 18.3166 11.0976 18.7071 10.7071C19.0976 10.3166 19.0976 9.68342 18.7071 9.29289L17.2929 10.7071ZM6.70711 10.7071L12.7071 4.70711L11.2929 3.29289L5.29289 9.29289L6.70711 10.7071ZM11.2929 4.70711L17.2929 10.7071L18.7071 9.29289L12.7071 3.29289L11.2929 4.70711Z" fill="#fff"></path>
                  <path d="M12 4L12 20" stroke="#fff" strokewidth="2" strokeLinecap="round" strokelinejoin="round"></path>
                </svg>
              </div>
              <div className="custom_arrows horizontal custom-next-arrow">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.7071 14.7071C19.0976 14.3166 19.0976 13.6834 18.7071 13.2929C18.3166 12.9024 17.6834 12.9024 17.2929 13.2929L18.7071 14.7071ZM12 20L11.2929 20.7071C11.6834 21.0976 12.3166 21.0976 12.7071 20.7071L12 20ZM6.70711 13.2929C6.31658 12.9024 5.68342 12.9024 5.29289 13.2929C4.90237 13.6834 4.90237 14.3166 5.29289 14.7071L6.70711 13.2929ZM17.2929 13.2929L11.2929 19.2929L12.7071 20.7071L18.7071 14.7071L17.2929 13.2929ZM12.7071 19.2929L6.70711 13.2929L5.29289 14.7071L11.2929 20.7071L12.7071 19.2929Z" fill="#fff"></path>
                  <path d="M12 20L12 4" stroke="#fff" strokewidth="2" strokeLinecap="round" strokelinejoin="round"></path>
                </svg>
              </div>
              <Swiper
                spaceBetween={10}
                slidesPerView={2}
                loop={true}
                navigation={true, {
                  nextEl: '.custom-next-arrow',
                  prevEl: '.custom-prev-arrow',
                }}
                modules={[Navigation]}
              >
                {props.collection.products.nodes && props.collection.products.nodes.map((product, i) => (
                  <SwiperSlide key={i}>
                    <ProductBlock product={product} location={props.location} />
                  </SwiperSlide>
                )
                )}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function QuickView(props) {
  console.log("product quick:", props.product)
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const showPopup = () => setShow(true);

  const [quantity, setQuantity] = useState(1)
  const handleQty = (type) => {
    if (type == "inc") {
      setQuantity(parseInt(quantity + 1))
    } else {
      if (quantity > 0) {
        setQuantity(parseInt(quantity - 1))
      }
    }
  }
  const handleQtyChange = (e) => {
    setQuantity(parseInt(e.target.value))
  }

  // const [metaFields, setmetaFields] = useState({})
  // useEffect(() => {
  //   let newObj = {}
  //   props.product && props.product.metafields && props.product.metafields.length > 0 && props.product.metafields.map((opt) => {
  //     if (opt) {
  //       newObj[opt.key] = opt.value
  //     }
  //   })
  //   console.log("newObj: ", newObj)
  //   setmetaFields(newObj)
  // }, [])
  console.log("product quick metaFields:", props.metaFields)
  return (
    <div className='quickview_modal'>
      <div className='quickview_modal_backdrop' onClick={props.closeModal}></div>
      <div className='quickview_modal_body_outer'>
        <div className='quickview_modal_body'>
          <div className='row gx-5'>
            <div className='col-md-6'>
              <div className='product_detail_images'>
                <div className='product_detail_single_image'>
                  <Image
                    alt={props.activeSlide.altText || 'Product Image'}
                    aspectRatio="0"
                    data={props.activeSlide}
                    sizes="200vw"
                  />
                </div>
                <div className='product_image_thumb'>
                  <Swiper
                    spaceBetween={0}
                    slidesPerView={3}
                    direction={'vertical'}
                    mousewheel={true}
                    onSlideChange={props.handleSlideChange}
                    autoHeight={true}
                    navigation={true, {
                      nextEl: '.custom-next-arrow',
                      prevEl: '.custom-prev-arrow',
                    }}
                    modules={[Mousewheel, Navigation]}
                    ref={props.swiperRef}
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
                    {props.product?.images?.nodes.map((img, i) => {
                      return (
                        <SwiperSlide key={i} onClick={() => props.handleThumbnailClick(i)}>
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
            <div className='col-md-6'>
              <ProductMain
                selectedVariant={props.product.variants.nodes[0]}
                product={props.product}
                variants={props.product.variants}
                metaFields={props.metaFields}
                showPopup={showPopup}
                handleQtyChange={handleQtyChange}
                handleQty={handleQty}
                quantity={quantity}
                location={props.location}
                type="quickView"
              />
              {/* <div className='product_details'>
              <h3 className='mdEx'>{props.product?.title}</h3>
              <div className='d-flex primary-font strong'>
                <Money data={props.product.priceRange.minVariantPrice} as="h5" />
                {props.product.priceRange.minVariantPrice?.amount !== props.product.priceRange.maxVariantPrice?.amount ?
                  <del className="del_price ms-3">
                    <Money data={props.product.priceRange.maxVariantPrice} as="h5" />
                  </del>
                  : null
                }
              </div>
              <div className='add_to_cart_block mb-3'>
                <AddToCartButton
                  lines={[
                    {
                      merchandiseId: props.product?.variants.nodes[0].id,
                      quantity: 1,
                    },
                  ]
                  }
                  onClick={() => {
                    window.location.href = window.location.href + '#cart-aside';
                  }}
                >
                  Add to Bag
                </AddToCartButton>
              </div>
              <Link to={`/products/${props.product.handle}`} onClick={props.handleDetail} className='link'>View Full Details</Link>
            </div> */}
            </div>
          </div>
          <div className='ingrediant_tab'>
            <Accordion className='row'>
              {props.metaFields?.title ?
                <>
                  {JSON.parse(props.metaFields?.title).map((opt, i) => {
                    return (
                      <Accordion.Item eventKey={i} className='ingrediant_tab_panel col-md-6'>
                        <Accordion.Header className='ingrediant_tab_header'>
                          {opt}
                        </Accordion.Header>
                        <Accordion.Body>
                          {props.metaFields?.description_essen ?
                            <div className='ingrediant_tab_body' dangerouslySetInnerHTML={{ __html: JSON.parse(props.metaFields?.description_essen)[i] }}>
                            </div>
                            : null
                          }
                        </Accordion.Body>
                      </Accordion.Item>
                    )
                  })}
                </>
                : null
              }
              {props.metaFields?.key_ingredients_text ?
                <Accordion.Item eventKey={_.findLastIndex(isJsonString(props.metaFields?.key_ingredients_text) ? JSON.parse(props.metaFields?.title) : props.metaFields?.title) + 1} className='ingrediant_tab_panel col-md-6'>
                  <Accordion.Header className='ingrediant_tab_header'>
                    Full ingredients:
                  </Accordion.Header>
                  <Accordion.Body>
                    {props.metaFields?.key_ingredients_text ?
                      <div className='ingrediant_tab_body' dangerouslySetInnerHTML={{ __html: isJsonString(props.metaFields?.key_ingredients_text) ? JSON.parse(props.metaFields?.key_ingredients_text) : props.metaFields?.key_ingredients_text }}>
                      </div>
                      : null
                    }
                  </Accordion.Body>
                </Accordion.Item>
                : null
              }
            </Accordion>
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

const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFragment on Product {
      id
      title
      handle
      description
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
      variants(first: 250) {
        nodes {
          ...ProductVariant
        }
      }
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
${PRODUCT_VARIANT_FRAGMENT}
`;

const COLLECTION_QUERY = `#graphql
      ${PRODUCT_FRAGMENT}
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
      first: 5
      ) {
        nodes {
          ...ProductFragment
        }
      }
    }
  }
`;
const RECOMMENDED_PRODUCTS_QUERY = `#graphql
      ${PRODUCT_FRAGMENT}
      query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
      @inContext(country: $country, language: $language) {
        products(first: 5, sortKey: UPDATED_AT, reverse: true) {
        nodes {
        ...ProductFragment
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderArgs} LoaderArgs */
/** @template T @typedef {import('@remix-run/react').V2_MetaFunction<T>} V2_MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

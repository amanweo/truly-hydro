import { useMatches, NavLink } from '@remix-run/react';
import Images from "./images";
import { useState } from 'react';
import images from './images';
import axios, { Axios } from "axios"

/**
 * @param {FooterQuery}
 */
export function Footer({ menu, menu2 }) {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className='row justify-content-between'>
          <div className='col-xl-4 col-lg-5 col-md-6 order-1'>
            <FooterInformation />
            <div className='d-md-block d-none'>
              <SocialLinks />
            </div>
          </div>
          <div className='col-xl-4 col-md-6 order-xl-2 order-3'>
            <div className='row'>
              <div className='col-6'>
                <h5>Brand</h5>
                <FooterMenu menu={menu} />
              </div>
              <div className='col-6'>
                <h5>Help</h5>
                <FooterMenu menu={menu2} />
              </div>
            </div>
            <div className='d-md-none'>
              <SocialLinks />
            </div>
          </div>
          <div className='col-xl-4 col-md-6 mb-xl-0 mt-md-0 mb-4 mt-3 order-xl-3 order-2'>
            <h5>Subscribe to Updates</h5>
            <NewsLetter />
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * @param {Pick<FooterQuery, 'menu'>}
 */

function FooterInformation() {
  return (
    <div className='footer_info_block'>
      <div className='truly_logo'>
        <NavLink prefetch="intent" to="/" end>
          <strong>
            <img src={Images?.logo} width="150" alt={""} /></strong>
        </NavLink>
      </div>
    </div>
  )
}

function NewsLetter() {
  const [value, setValue] = useState({})
  const [errors, setErrors] = useState(false)
  const handleSubmit = (e, type) => {
    e.preventDefault();
    let data = {
      ajaxaction: type,
    }
    let error = false
    if (type == "subscribelist") {
      if (!value.subemailaddress || (value.subemailaddress && value.subemailaddress == "")) {
        setErrors(type)
        error = true
      } else {
        setErrors("")
        error = false
        data = {
          ...data,
          subemailaddress: value.subemailaddress
        }
      }
    } else {
      if (!value.subphonenumber || (value.subphonenumber && value.subphonenumber == "")) {
        setErrors(type)
        error = true
      } else {
        error = false
        setErrors("")
        data = {
          ...data,
          subphonenumber: value.subphonenumber
        }
      }
    }
    if (!error) {
      console.log("data", data)
      fetch("https://mytrulydeals.com/trulybeauty/test-subscribe.php", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: {
          data
        }
      }).then(response => {
        console.log("response.json()", response.json())
      });

    }
  }
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value })
  }
  return (
    <div className='newsletter_block'>
      <p>Be the first to get the latest news, updates and amazing offers delivered directly in your inbox.</p>
      <div className='newsletter_form'>
        <form className='form-group w-100 me-3 mb-3' onSubmit={(e) => handleSubmit(e, "subscribelist")}>
          <input type='email' className={`form-control sm ${errors == "subemailaddress" ? "error" : ""}`} placeholder='Your email' name="subemailaddress" value={value?.subemailaddress || ""} onChange={handleChange} />
          <button className='noStyle'>
            <img src={images?.arrow_right} alt="" width={18} />
          </button>
        </form>
        <form className='form-group w-100 me-3 mb-3' onSubmit={(e) => handleSubmit(e, "subscribephonelist")}>
          <input type='text' className={`form-control sm ${errors == "subphonenumber" ? "error" : ""}`} placeholder='Phone number' name="subphonenumber" value={value?.subphonenumber || ""} onChange={handleChange} />
          <button className='noStyle'>
            <img src={images?.arrow_right} alt="" width={18} />
          </button>
        </form>
        <div className='form-group'>
          {/* <button className='btn btn-secondary btn-sm'>Subscribe</button> */}
          <span className='d-xl-none ms-3'><small>By subscribing, you accept the <NavLink to="/" className={"link"}>Privacy Policy</NavLink></small></span>
        </div>
      </div>
      <p className='d-xl-block d-none'><small>By subscribing, you accept the <NavLink to="/" className={"link"}>Privacy Policy</NavLink></small></p>
    </div>
  )
}

function SocialLinks() {
  return (
    <div className="mainFooter_information">
      <h5 className='d-md-none mt-4'>
        Stay Connected
      </h5>
      <div className="mainFooter-socialIcon">
        <a target="_blank" href="https://www.facebook.com/trulybeautyofficial">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="328px" height="616px" viewBox="232 -20 328 616" enableBackground="new 232 -20 328 616" xmlSpace="preserve">
            <path fill="#000" strokeWidth="40" strokeLinejoin="round" strokeMiterlimit="10" d="M432,198v-72
                                                               c0-19.913,16.088-36,36-36h36V0h-72c-59.625,0-108,48.375-108,108v90h-72v90h72v288h108V288h72l36-90H432z">
            </path>
          </svg>
        </a>
        <a target="_blank" href="https://twitter.com/truly_beauty_" className="icon_fill">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="666.018px" height="558px" viewBox="62.972 9 666.018 558" enableBackground="new 62.972 9 666.018 558" xmlSpace="preserve">
            <path d="M506.813,54c33.75,0,64.575,14.288,86.287,37.35c26.888-5.4,52.088-14.962,74.926-28.575
                                    c-8.775,27.675-27.45,50.625-51.976,65.25c23.851-3.038,46.575-9.225,68.063-18.675c-16.087,23.85-35.774,44.663-59.175,61.313
                                    c0.225,4.95,0.45,10.012,0.45,15.3C625.275,342,506.475,522,289.125,522C222.3,522,160.313,502.763,108,469.013
                                    c9.337,1.237,18.563,1.575,28.237,1.575c55.238,0,106.2-18.9,146.363-50.4c-51.638-1.125-95.063-35.55-110.363-82.237
                                    c7.2,1.575,14.85,2.024,22.388,2.024c10.913,0,21.375-1.237,30.938-3.938C171.9,325.013,130.95,277.425,130.95,220.05
                                    c0-0.45,0-0.9,0-1.35c15.75,8.662,34.425,14.175,53.325,14.512c-31.387-21.038-52.425-57.262-52.425-98.1
                                    c0-21.825,5.962-41.962,16.2-59.737c58.388,71.775,145.238,118.913,243.45,123.638c-1.913-8.55-2.7-17.55-2.7-26.888
                                    C388.8,107.1,441.45,54,506.813,54 M506.813,9c-43.65,0-84.6,16.987-115.425,47.925c-14.963,14.963-26.663,32.4-34.875,51.863
                                    c-5.288,12.487-9,25.538-10.913,38.925C282.263,133.65,224.775,98.438,183.038,47.25c-8.55-10.575-21.375-16.538-34.875-16.538
                                    c-1.238,0-2.363,0-3.6,0.113c-14.85,1.012-28.013,9.45-35.438,22.275c-14.513,25.2-22.163,53.55-22.163,82.125
                                    c0,18.675,3.263,37.237,9.563,54.788c-6.637,7.987-10.462,18.112-10.462,28.8v1.35c0,37.913,13.275,74.925,37.462,104.062
                                    c1.462,1.801,3.038,3.601,4.613,5.288c-1.463,7.313-1.013,15.075,1.462,22.5c9,27.337,24.637,51.188,44.775,69.75
                                    c-12.487,2.475-25.313,3.825-38.138,3.825c-8.662,0-15.862-0.45-22.5-1.238c-1.912-0.225-3.825-0.337-5.737-0.337
                                    c-18.675,0-35.663,11.7-42.3,29.587c-7.2,19.801,0.225,41.851,17.887,53.213C144.675,546.188,215.775,567,289.125,567
                                    c58.5,0,113.4-11.7,163.125-34.763c45.787-21.263,86.287-51.524,120.15-90c31.387-35.662,56.024-76.725,73.012-122.175
                                    c15.413-41.288,23.963-85.275,24.75-127.8c19.238-16.538,36.45-35.888,51.188-57.825c11.138-16.65,10.013-38.587-2.813-54
                                    c-2.137-2.475-4.5-4.725-6.975-6.75c4.275-17.1-1.688-35.212-15.638-46.237c-8.1-6.413-18-9.788-28.013-9.788
                                    c-7.987,0-15.862,2.137-23.063,6.3c-12.375,7.425-25.762,13.388-39.824,17.775C576.9,20.813,542.25,9,506.813,9L506.813,9z">
            </path>
          </svg>

        </a>
        <a target="_blank" href="https://www.pinterest.com/truly_beauty/">
          <svg aria-hidden="true" focusable="false" role="presentation" className="icon icon-pinterest" viewBox="0 0 20 20">
            <path fill="#444" d="M9.958.811q1.903 0 3.635.744t2.988 2 2 2.988.744 3.635q0 2.537-1.256 4.696t-3.415 3.415-4.696 1.256q-1.39 0-2.659-.366.707-1.147.951-2.025l.659-2.561q.244.463.903.817t1.39.354q1.464 0 2.622-.842t1.793-2.305.634-3.293q0-2.171-1.671-3.769t-4.257-1.598q-1.586 0-2.903.537T5.298 5.897 4.066 7.775t-.427 2.037q0 1.268.476 2.22t1.427 1.342q.171.073.293.012t.171-.232q.171-.61.195-.756.098-.268-.122-.512-.634-.707-.634-1.83 0-1.854 1.281-3.183t3.354-1.329q1.83 0 2.854 1t1.025 2.61q0 1.342-.366 2.476t-1.049 1.817-1.561.683q-.732 0-1.195-.537t-.293-1.269q.098-.342.256-.878t.268-.915.207-.817.098-.732q0-.61-.317-1t-.927-.39q-.756 0-1.269.695t-.512 1.744q0 .39.061.756t.134.537l.073.171q-1 4.342-1.22 5.098-.195.927-.146 2.171-2.513-1.122-4.062-3.44T.59 10.177q0-3.879 2.744-6.623T9.957.81z">
            </path>
          </svg>
        </a>
        <a target="_blank" href="https://www.instagram.com/trulybeauty/" className="icon_fill">
          <svg height="511pt" viewBox="0 0 511 511.9" width="511pt" xmlns="http://www.w3.org/2000/svg">
            <path d="m510.949219 150.5c-1.199219-27.199219-5.597657-45.898438-11.898438-62.101562-6.5-17.199219-16.5-32.597657-29.601562-45.398438-12.800781-13-28.300781-23.101562-45.300781-29.5-16.296876-6.300781-34.898438-10.699219-62.097657-11.898438-27.402343-1.300781-36.101562-1.601562-105.601562-1.601562s-78.199219.300781-105.5 1.5c-27.199219 1.199219-45.898438 5.601562-62.097657 11.898438-17.203124 6.5-32.601562 16.5-45.402343 29.601562-13 12.800781-23.097657 28.300781-29.5 45.300781-6.300781 16.300781-10.699219 34.898438-11.898438 62.097657-1.300781 27.402343-1.601562 36.101562-1.601562 105.601562s.300781 78.199219 1.5 105.5c1.199219 27.199219 5.601562 45.898438 11.902343 62.101562 6.5 17.199219 16.597657 32.597657 29.597657 45.398438 12.800781 13 28.300781 23.101562 45.300781 29.5 16.300781 6.300781 34.898438 10.699219 62.101562 11.898438 27.296876 1.203124 36 1.5 105.5 1.5s78.199219-.296876 105.5-1.5c27.199219-1.199219 45.898438-5.597657 62.097657-11.898438 34.402343-13.300781 61.601562-40.5 74.902343-74.898438 6.296876-16.300781 10.699219-34.902343 11.898438-62.101562 1.199219-27.300781 1.5-36 1.5-105.5s-.101562-78.199219-1.300781-105.5zm-46.097657 209c-1.101562 25-5.300781 38.5-8.800781 47.5-8.601562 22.300781-26.300781 40-48.601562 48.601562-9 3.5-22.597657 7.699219-47.5 8.796876-27 1.203124-35.097657 1.5-103.398438 1.5s-76.5-.296876-103.402343-1.5c-25-1.097657-38.5-5.296876-47.5-8.796876-11.097657-4.101562-21.199219-10.601562-29.398438-19.101562-8.5-8.300781-15-18.300781-19.101562-29.398438-3.5-9-7.699219-22.601562-8.796876-47.5-1.203124-27-1.5-35.101562-1.5-103.402343s.296876-76.5 1.5-103.398438c1.097657-25 5.296876-38.5 8.796876-47.5 4.101562-11.101562 10.601562-21.199219 19.203124-29.402343 8.296876-8.5 18.296876-15 29.398438-19.097657 9-3.5 22.601562-7.699219 47.5-8.800781 27-1.199219 35.101562-1.5 103.398438-1.5 68.402343 0 76.5.300781 103.402343 1.5 25 1.101562 38.5 5.300781 47.5 8.800781 11.097657 4.097657 21.199219 10.597657 29.398438 19.097657 8.5 8.300781 15 18.300781 19.101562 29.402343 3.5 9 7.699219 22.597657 8.800781 47.5 1.199219 27 1.5 35.097657 1.5 103.398438s-.300781 76.300781-1.5 103.300781zm0 0">
            </path>
            <path d="m256.449219 124.5c-72.597657 0-131.5 58.898438-131.5 131.5s58.902343 131.5 131.5 131.5c72.601562 0 131.5-58.898438 131.5-131.5s-58.898438-131.5-131.5-131.5zm0 216.800781c-47.097657 0-85.300781-38.199219-85.300781-85.300781s38.203124-85.300781 85.300781-85.300781c47.101562 0 85.300781 38.199219 85.300781 85.300781s-38.199219 85.300781-85.300781 85.300781zm0 0">
            </path>
            <path d="m423.851562 119.300781c0 16.953125-13.746093 30.699219-30.703124 30.699219-16.953126 0-30.699219-13.746094-30.699219-30.699219 0-16.957031 13.746093-30.699219 30.699219-30.699219 16.957031 0 30.703124 13.742188 30.703124 30.699219zm0 0">
            </path>
          </svg>
        </a>
        <a target="_blank" href="https://www.snapchat.com/add/trulybeauty1">
          <svg aria-hidden="true" focusable="false" role="presentation" className="icon icon-snapchat" viewBox="0 0 56.693 56.693">
            <path d="M28.66 51.683c-.128 0-.254-.004-.38-.01a3.24 3.24 0 0 1-.248.01c-2.944 0-4.834-1.336-6.661-2.628-1.262-.892-2.453-1.733-3.856-1.967a12.448 12.448 0 0 0-2.024-.17c-1.186 0-2.122.182-2.806.316-.415.081-.773.151-1.045.151-.285 0-.593-.061-.727-.519-.116-.397-.2-.78-.281-1.152-.209-.956-.357-1.544-.758-1.605-4.67-.722-6.006-1.705-6.304-2.403a.898.898 0 0 1-.072-.299.526.526 0 0 1 .44-.548c7.178-1.182 10.397-8.519 10.53-8.83l.012-.026c.44-.89.526-1.663.257-2.297-.493-1.16-2.1-1.67-3.163-2.008-.26-.082-.507-.16-.701-.237-2.123-.84-2.3-1.7-2.216-2.14.142-.747 1.142-1.268 1.95-1.268.222 0 .417.039.581.116.955.447 1.815.673 2.558.673 1.025 0 1.473-.43 1.528-.487-.026-.486-.059-.993-.092-1.517-.213-3.394-.478-7.61.595-10.018 3.218-7.215 10.043-7.776 12.057-7.776l.884-.009h.119c2.02 0 8.858.562 12.078 7.78 1.074 2.41.808 6.63.594 10.021l-.009.147c-.03.473-.058.932-.082 1.371.051.052.463.449 1.393.485h.001c.707-.028 1.52-.253 2.41-.67.262-.122.552-.148.75-.148.3 0 .607.058.86.164l.016.007c.721.255 1.193.76 1.204 1.289.009.497-.37 1.244-2.233 1.98-.193.076-.44.154-.7.237-1.065.338-2.671.848-3.164 2.008-.269.633-.183 1.406.257 2.297l.011.026c.134.311 3.35 7.646 10.532 8.83.265.043.454.28.44.548a.884.884 0 0 1-.074.3c-.296.693-1.632 1.675-6.303 2.397-.381.059-.53.556-.757 1.599-.083.38-.167.752-.282 1.144-.1.34-.312.5-.668.5h-.058c-.248 0-.6-.045-1.046-.133-.79-.154-1.677-.297-2.805-.297-.659 0-1.34.058-2.026.171-1.401.234-2.591 1.074-3.85 1.964-1.831 1.295-3.72 2.63-6.666 2.63z">
            </path>
          </svg>
        </a>
        <a target="_blank" href="https://www.youtube.com/channel/UCKEW0ZRDVYfSHnD5UlwMrvA" className='icon_stroke'>
          <svg version="1.1" id="Слой_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="582.19px" height="420.201px" viewBox="104.736 72.832 582.19 420.201" enableBackground="new 104.736 72.832 582.19 420.201" xmlSpace="preserve">
            <path fill="none" stroke="#ff779f" strokeWidth="42" strokeLinejoin="round" strokeMiterlimit="10" d="M654.608,153.037
                        c-6.249-23.142-24.492-41.384-47.634-47.634c-42.229-11.571-211.313-11.571-211.313-11.571s-169,0-211.313,11.148
                        c-22.719,6.25-41.384,24.915-47.634,48.057c-10.979,42.229-10.979,129.896-10.979,129.896s0,88.089,11.148,129.896
                        c6.25,23.142,24.493,41.384,47.634,47.634c42.735,11.571,211.313,11.571,211.313,11.571s168.999,0,211.313-11.148
                        c23.142-6.25,41.385-24.493,47.634-47.635c11.148-42.229,11.148-129.895,11.148-129.895S666.18,195.266,654.608,153.037z
                         M341.863,363.843V201.938l140.622,80.995L341.863,363.843z"></path>
          </svg>
        </a>
        <a target="_blank" href="https://www.tiktok.com/@trulybeauty" className='icon_stroke'>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="545.374px" height="615.212px" viewBox="123.211 -19.55 545.374 615.212" enableBackground="new 123.211 -19.55 545.374 615.212" xmlSpace="preserve">
            <g>
              <path fill="none" stroke="#ff779f" strokeWidth="40" strokeLinejoin="round" strokeMiterlimit="10" d="M648.338,144.45
                            c-32.851,0-63.226-10.913-87.525-29.25c-27.9-21.038-48.037-51.975-55.125-87.525c-1.8-8.775-2.7-17.887-2.813-27.225h-93.938
                            v256.612l-0.112,140.513c0,37.575-24.525,69.412-58.388,80.662c-9.9,3.263-20.475,4.838-31.5,4.163
                            c-14.175-0.788-27.337-5.063-38.925-11.926C255.487,455.85,238.95,429.3,238.5,398.813c-0.675-47.475,37.688-86.287,85.163-86.287
                            c9.337,0,18.337,1.574,26.775,4.274v-70.087v-25.087c-8.888-1.35-17.888-2.025-27.112-2.025c-51.975,0-100.575,21.6-135.338,60.525
                            c-26.212,29.362-41.962,66.938-44.438,106.313c-3.15,51.638,15.75,100.8,52.425,137.025c5.4,5.287,11.025,10.237,16.987,14.85
                            c31.5,24.188,69.863,37.35,110.363,37.35c9.112,0,18.225-0.675,27.112-2.024c37.8-5.625,72.675-22.95,100.237-50.175
                            c33.862-33.413,52.538-77.851,52.763-125.101l-0.45-209.925c16.2,12.487,33.75,22.725,52.763,30.712
                            c29.475,12.488,60.75,18.675,92.813,18.675V169.65v-25.313C648.675,144.45,648.338,144.45,648.338,144.45L648.338,144.45z">
              </path>
            </g>
          </svg>
        </a>
      </div>
      <p>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
      <p className='mb-0'>© {new Date().getFullYear()} All rights reserved.</p>
    </div>
  )
}

function FooterMenu({ menu }) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"

            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({ isActive, isPending }) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */

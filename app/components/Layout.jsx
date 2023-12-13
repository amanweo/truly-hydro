import { Await } from '@remix-run/react';
import { Suspense } from 'react';
import { Aside } from '~/components/Aside';
import { Footer } from '~/components/Footer';
import { Header, HeaderMenu } from '~/components/Header';
import { CartMain } from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import { Image } from '@shopify/hydrogen';

/**
 * @param {LayoutProps}
 */
export function Layout({ cart, children = null, footer, footer2, header, isLoggedIn }) {
  return (
    <>
      <CartAside cart={cart} />
      {/* <SearchAside /> */}
      <MobileMenuAside menu={header.menu} />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
      <HeaderCounter />
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer.menu} menu2={footer2.menu} />}
        </Await>
      </Suspense>
    </>
  );
}

export function HeaderCounter() {
  return (
    <div className='countdown__wrapper'>
      <div className='container-fluid'>
        <div className='d-flex justify-content-center'>
          <div className=''>
            <a href='/pages/santa-hat' className='count__downCols'>
              <Image
                alt={""}
                aspectRatio="0"
                data={{ url: 'https://www.trulybeauty.com/cdn/shop/files/Dec-off7.jpg?v=1702271774' }}
                sizes="200vw"
                style={{width: "auto"}}
              />
            </a>
          </div>
          <div className=''>
            
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * @param {{cart: LayoutProps['cart']}}
 */
function CartAside({ cart }) {
  const toggleCart = () => {
    window.location.hash = ""
    if (window.location.href.includes('#')) {
      const cleanedUrl = window.location.href.split('#')[0];
      window.history.replaceState(null, null, cleanedUrl);
    }
  }
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} toggleCart={toggleCart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        <PredictiveSearchForm>
          {({ fetchResults, inputRef }) => (
            <div className='d-flex'>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                className='form-control'
              />
              &nbsp;
              <button type="submit">Search</button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

/**
 * @param {{menu: HeaderQuery['menu']}}
 */
function MobileMenuAside({ menu }) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu menu={menu} viewport="mobile" />
    </Aside>
  );
}

/**
 * @typedef {{
 *   cart: Promise<CartApiQueryFragment | null>;
 *   children?: React.ReactNode;
 *   footer: Promise<FooterQuery>;
 *   header: HeaderQuery;
 *   isLoggedIn: boolean;
 * }} LayoutProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */

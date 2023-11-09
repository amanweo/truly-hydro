import { Await, NavLink, useMatches } from '@remix-run/react';
import { Suspense, useState } from 'react';
import Images from "./images";
import { PredictiveSearchForm, PredictiveSearchResults } from './Search';

/**
 * @param {HeaderProps}
 */
export function Header({ header, isLoggedIn, cart }) {
  const { shop, menu } = header;
  const [showSearch, setShowSearch] = useState(false)
  return (
    <header className='truly_header'>
      <div className='container-fluid'>
        <div className='main_header'>
          <div className='truly_logo'>
            <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
              <strong>
                <img src={Images?.logo} width="150" alt={shop.name} /></strong>
            </NavLink>
          </div>
          <div className='truly_navbar'>
            <HeaderMenu menu={menu} viewport="desktop" />
          </div>
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>
      {showSearch ?
        <HeaderSearch />
        : null
      }
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   viewport: Viewport;
 * }}
 */
export function HeaderMenu({ menu, viewport }) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;
  const className = `header-menu-${viewport}`;

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <ul>
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <li key={item.id}>
            <NavLink
              className="header-menu-item"
              end
              onClick={closeAside}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              {item.title}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

function HeaderSearch() {
  return (
    <div className="predictive-search">
      <div className="container-fluid">
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
              {/* <button className='noStyle ps-3' onClick={clearSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 10.667 10.667">
                  <path fill="currentColor" d="M4.723,4.723a.762.762,0,0,1,1.079,0L9.833,8.756l4.031-4.033A.763.763,0,1,1,14.942,5.8L10.91,9.833l4.033,4.031a.763.763,0,1,1-1.079,1.079L9.833,10.91,5.8,14.942a.763.763,0,1,1-1.079-1.079L8.756,9.833,4.723,5.8a.762.762,0,0,1,0-1.079Z" transform="translate(-4.499 -4.499)"></path>
                </svg>
              </button> */}
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </div>
  )
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({ isLoggedIn, cart }) {
  return (
    <div className="truly_header_links">
      <div className="navAccount search--icon">
        <SearchToggle />
      </div>
      <div className="navAccount user--icon">
        <NavLink prefetch="intent" to="/account">
          <img src={Images?.user} alt="user" />
        </NavLink>
      </div>
      <div className="navAccount cart--icon">
        <CartToggle cart={cart} />
      </div>
      {/* <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink> */}
    </div>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  return <a href="#search-aside"><img src={Images.search} alt="search" width={15} /></a>;
}

/**
 * @param {{count: number}}
 */
function CartBadge({ count }) {
  return <a href="#cart-aside">
    <img src={Images.cart} alt="cart" width={15} /> <strong className='cartItemCounter'>{count}</strong>
  </a>;
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({ cart }) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
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
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>} HeaderProps */
/** @typedef {'desktop' | 'mobile'} Viewport */

/** @typedef {import('./Layout').LayoutProps} LayoutProps */

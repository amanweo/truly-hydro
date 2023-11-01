import { Await, NavLink, useMatches } from '@remix-run/react';
import { Suspense } from 'react';

/**
 * @param {HeaderProps}
 */
export function Header({ header, isLoggedIn, cart }) {
  const { shop, menu } = header;
  return (
    <section className='shopify-section shopify-section-group-header-group headerSticky'>
      <div className='headerFixed__wrap'>
        <header id="header" className='trulyHeader headerSection slideDown'>
          <nav className="freshNav">
            <div className="wrapper">
              <div className="freshNav__wrap">
                <div className="freshNav__left">
                </div>
                <div className='freshNav__logo'>
                  <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
                    <strong>
                      <img src="//www.trulybeauty.com/cdn/shop/files/truly_logo_55901ef4-4456-41dc-b255-6944b936afc5.svg?v=1678797461" width="120" alt={shop.name} /></strong>
                  </NavLink>
                </div>
                <div className='freshNav__holder'>
                  <div className='desktop__nav'>
                    <HeaderMenu menu={menu} viewport="desktop" />
                  </div>
                </div>
                <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />

              </div>
            </div>
          </nav>

        </header>
      </div>
    </section>
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

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({ isLoggedIn, cart }) {
  return (
    <div className="freshNav__account">
      <div className="navAccount search--icon">
        <SearchToggle />
      </div>
      <div className="navAccount user--icon">

        <NavLink prefetch="intent" to="/account">
          <img src="https://cdn.shopify.com/s/files/1/0053/4462/4675/files/user--icon.svg?v=1687410589" alt="user" />
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
  return <a href="#search-aside"><img src="https://cdn.shopify.com/s/files/1/0053/4462/4675/files/search-icon.svg?v=1676476120" alt="search" /></a>;
}

/**
 * @param {{count: number}}
 */
function CartBadge({ count }) {
  return <a href="#cart-aside">
    <img src="https://cdn.shopify.com/s/files/1/0053/4462/4675/files/cart--bag.svg?v=1687410652" alt="cart" /> <strong className='cartItemCounter headerCartItems'>{count}</strong>
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

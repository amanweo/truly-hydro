import { CartForm, Image, Money } from '@shopify/hydrogen';
import { Link } from '@remix-run/react';
import { useVariantUrl } from '~/utils';

/**
 * @param {CartMainProps}
 */
export function CartMain({ layout, cart, toggleCart }) {
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      <div className='cart_overlay' onClick={toggleCart}></div>
      <CartDetails cart={cart} layout={layout} toggleCart={toggleCart} />
    </div>
  );
}

/**
 * @param {CartMainProps}
 */
function CartDetails({ layout, cart, toggleCart }) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  console.log("cart: ", cart)
  return (
    <div className="cart-details">
      <div className='d-flex justify-content-between align-items-start'>
        <div>
          <h4 className='mb-2'>Your Bag</h4>
          {linesCount ?
            <p><small><strong>{cart.totalQuantity}</strong> item(s) added to your cart</small></p>
            : null
          }
        </div>
        <button className='noStyle ps-3' onClick={toggleCart}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 10.667 10.667">
            <path fill="currentColor" d="M4.723,4.723a.762.762,0,0,1,1.079,0L9.833,8.756l4.031-4.033A.763.763,0,1,1,14.942,5.8L10.91,9.833l4.033,4.031a.763.763,0,1,1-1.079,1.079L9.833,10.91,5.8,14.942a.763.763,0,1,1-1.079-1.079L8.756,9.833,4.723,5.8a.762.762,0,0,1,0-1.079Z" transform="translate(-4.499 -4.499)"></path>
          </svg>
        </button>
      </div>
      <hr />
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <div className='mt-3'>
            <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
          </div>
        </CartSummary>
      )}
    </div>
  );
}

/**
 * @param {{
 *   layout: CartMainProps['layout'];
 *   lines: CartApiQueryFragment['lines'] | undefined;
 * }}
 */
function CartLines({ lines, layout }) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <ul>
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

/**
 * @param {{
 *   layout: CartMainProps['layout'];
 *   line: CartLine;
 * }}
 */
function CartLineItem({ layout, line }) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={id} className="cart-line">
      {image && (
        <Image
          alt={title}
          aspectRatio="0"
          data={image}
          loading="lazy"
          width={100}
          style={{ borderRadius: 15 }}
        />
      )}

      <div className='cart_detail_outer'>
        <div className='cart_detail_inner'>
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                // close the drawer
                window.location.href = lineItemUrl;
              }
            }}
          >
            <p>
              <strong>{product.title}</strong>
            </p>
          </Link>
          <div className='mb-2'>
            <CartLinePrice line={line} as="span" />
          </div>
          {/* <ul className='selectedOptions'>
            {selectedOptions.map((option) => (
              <li key={option.name}>
                <small>
                  {option.name}: {option.value}
                </small>
              </li>
            ))}
          </ul> */}
        </div>
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

/**
 * @param {{checkoutUrl: string}}
 */
function CartCheckoutActions({ checkoutUrl }) {
  if (!checkoutUrl) return null;

  return (
    <div>
      <a href={checkoutUrl} target="_self" className='btn btn-secondary w-100'>
        <p>Continue to Checkout &rarr;</p>
      </a>
      <br />
    </div>
  );
}

/**
 * @param {{
 *   children?: React.ReactNode;
 *   cost: CartApiQueryFragment['cost'];
 *   layout: CartMainProps['layout'];
 * }}
 */
export function CartSummary({ cost, layout, children = null }) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <dl className="cart-subtotal">
        <dt className='w-100'>Subtotal</dt>
        <dt className='w-100 text-end'>
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dt>
      </dl>
      {children}
    </div>
  );
}

/**
 * @param {{lineIds: string[]}}
 */
function CartLineRemoveButton({ lineIds }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <small>
        <button type="submit" className='noStyle link text-danger'>Remove</button>
      </small>
    </CartForm>
  );
}

/**
 * @param {{line: CartLine}}
 */
function CartLineQuantity({ line }) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity">
      <div className='cart_quantity_outer'>
        {/* <small>Quantity: {quantity} &nbsp;&nbsp;</small> */}
        <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            name="decrease-quantity"
            value={prevQuantity}
            className='noStyle'
          >
            <span>&#8722; </span>
          </button>
        </CartLineUpdateButton>
        <div className='cart_quantity'>
          {quantity}
        </div>
        <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            className='noStyle'
          >
            <span>&#43;</span>
          </button>
        </CartLineUpdateButton>
      </div>
      <div>
        <CartLineRemoveButton lineIds={[lineId]} />
      </div>
    </div>
  );
}

/**
 * @param {{
 *   line: CartLine;
 *   priceType?: 'regular' | 'compareAt';
 *   [key: string]: any;
 * }}
 */
function CartLinePrice({ line, priceType = 'regular', ...passthroughProps }) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div>
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
export function CartEmpty({ hidden = false, layout = 'aside' }) {
  return (
    <div hidden={hidden} className='empty_cart_alert'>
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link
        to="/collections"
        onClick={() => {
          if (layout === 'aside') {
            window.location.href = '/collections';
          }
        }}
      >
        Continue shopping →
      </Link>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({ discountCodes }) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className='d-flex'>
          <input type="text" name="discountCode" placeholder="Discount code" className='form-control sm' />
          <button type="submit" className='btn btn-sm btn-secondary ms-3'>Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({ discountCodes, children }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   children: React.ReactNode;
 *   lines: CartLineUpdateInput[];
 * }}
 */
function CartLineUpdateButton({ children, lines }) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}

/** @typedef {CartApiQueryFragment['lines']['nodes'][0]} CartLine */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: 'page' | 'aside';
 * }} CartMainProps
 */

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */

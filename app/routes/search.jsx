import { defer } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { getPaginationVariables } from '@shopify/hydrogen';

import { SearchForm, SearchResults, NoSearchResults } from '~/components/Search';

/**
 * @type {V2_MetaFunction}
 */
export const meta = () => {
  return [{ title: `Hydrogen | Search` }];
};

/**
 * @param {LoaderArgs}
 */
export async function loader({ request, context }) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const variables = getPaginationVariables(request, { pageBy: 8 });
  const searchTerm = String(searchParams.get('q') || '');

  if (!searchTerm) {
    return {
      searchResults: { results: null, totalResults: 0 },
      searchTerm,
    };
  }

  const data = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      query: searchTerm,
      ...variables,
    },
  });

  if (!data) {
    throw new Error('No search data returned from Shopify API');
  }

  const totalResults = Object.values(data).reduce((total, value) => {
    return total + value.nodes.length;
  }, 0);

  const searchResults = {
    results: data,
    totalResults,
  };

  return defer({ searchTerm, searchResults });
}

export default function SearchPage() {
  /** @type {LoaderReturnData} */
  const { searchTerm, searchResults } = useLoaderData();
  console.log("searchResults: ", searchResults)
  return (
    <div className="commonSection">
      <div className="search">
        <div className='container-fluid'>
          {searchResults.results?.products?.totalCount ?
            <h3>Search results: {searchResults.results?.products?.totalCount} results For "{searchTerm}"</h3>
            :
            <h3>Search results For "smooth"</h3>
          }
          {/* <SearchForm searchTerm={searchTerm} /> */}
          {!searchTerm || !searchResults.totalResults ? (
            <NoSearchResults />
          ) : (
            <SearchResults results={searchResults.results} />
          )}
        </div>
      </div>
    </div>
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

const SEARCH_QUERY = `#graphql
${PRODUCT_VARIANTS_FRAGMENT}
fragment MoneyProductItem on MoneyV2 {
  amount
  currencyCode
}
  fragment SearchProduct on Product {
    __typename
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
    ...ProductVariants
    metafields(
    identifiers: [{namespace: "accentuate", key: "bundle_product_short_title"}, {namespace: "accentuate", key: "sub_title_one"}, {namespace: "accentuate", key: "sub_title_two"}, {namespace: "accentuate", key: "sub_title_one"}, {namespace: "accentuate", key: "bundle_good_to_know"}, {namespace: "accentuate", key: "good_to_know_title"}, {namespace: "accentuate", key: "good_to_know"}, {namespace: "accentuate", key: "bundle_product_short_descripti"}, {namespace: "accentuate", key: "description"}, {namespace: "accentuate", key: "bundle_whats_inside"}, {namespace: "accentuate", key: "whats_inside_title"}, {namespace: "accentuate", key: "bundle_why_it_special_description"}, {namespace: "accentuate", key: "bundle_why_it_special"}, {namespace: "accentuate", key: "why_its_special"}, {namespace: "accentuate", key: "bundle_what_makes_good_title"}, {namespace: "accentuate", key: "bundle_what_makes_good_descrip"}, {namespace: "accentuate", key: "title"}, {namespace: "accentuate", key: "essential_ingradient_main_titl"}, {namespace: "accentuate", key: "description_essen"}, {namespace: "accentuate", key: "key_ingredients"}, {namespace: "accentuate", key: "full_ingradient_main_titl"}, {namespace: "accentuate", key: "full_ingredient_text"}, {namespace: "accentuate", key: "full_ingredient_title"}, {namespace: "product", key: "key_ingredients_text"}]
    ) {
      key
    value
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
  }
  
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
    image {
      url
      altText
      width
      height
    }
  }
  query search(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $query: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products: search(
      query: $query,
      unavailableProducts: HIDE,
      types: [PRODUCT],
      first: $first,
      sortKey: RELEVANCE,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
    pages: search(
      query: $query,
      types: [PAGE],
      first: 10
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    articles: search(
      query: $query,
      types: [ARTICLE],
      first: 10
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderArgs} LoaderArgs */
/** @template T @typedef {import('@remix-run/react').V2_MetaFunction<T>} V2_MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

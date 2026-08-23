import { PRODUCT_CARD_FRAGMENT, IMAGE_FRAGMENT, MONEY_FRAGMENT } from "./fragments";

export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts($first: Int = 24, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...ProductCardFields
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const GET_PRODUCT_BY_HANDLE = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      availableForSale
      images(first: 10) {
        nodes {
          ...ImageFields
        }
      }
      priceRange {
        minVariantPrice {
          ...MoneyFields
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          ...MoneyFields
        }
      }
      options {
        name
        values
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          price {
            ...MoneyFields
          }
          image {
            ...ImageFields
          }
        }
      }
      seo {
        title
        description
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`;

export const GET_COLLECTIONS = /* GraphQL */ `
  query GetCollections($first: Int = 12) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        image {
          ...ImageFields
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
`;

export const GET_COLLECTION_BY_HANDLE = /* GraphQL */ `
  query GetCollectionByHandle($handle: String!, $first: Int = 24, $after: String, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        ...ImageFields
      }
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ...ProductCardFields
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
`;

export const SEARCH_PRODUCTS = /* GraphQL */ `
  query SearchProducts($query: String!, $first: Int = 24) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductCardFields
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

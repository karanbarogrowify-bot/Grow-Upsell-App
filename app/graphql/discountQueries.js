export const GET_DISCOUNT_CODES = `
  query {
    discountCodes(first: 50) {
      edges {
        node {
          id
          code
          endsAt
          startsAt
          asyncUsageCount
          combinesWith {
            orderDiscounts
            productDiscounts
            shippingDiscounts
          }
          customers(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRICE_RULES = `
  query {
    priceRules(first: 50) {
      edges {
        node {
          id
          title
          valueType
          value
          target
          startsAt
          endsAt
          allocationMethod
        }
      }
    }
  }
`;

export const GET_ALL_DISCOUNTS = `
  query {
    discountCodes(first: 50) {
      edges {
        node {
          id
          code
          endsAt
          startsAt
          asyncUsageCount
        }
      }
    }
    priceRules(first: 50) {
      edges {
        node {
          id
          title
          valueType
          value
          target
          startsAt
          endsAt
        }
      }
    }
  }
`;

export const CREATE_DISCOUNT_CODE = `
  mutation createDiscountCode($input: DiscountCodeInput!) {
    discountCodeCreate(input: $input) {
      codeDiscount {
        id
        code
        endsAt
        startsAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_DISCOUNT_CODE = `
  mutation updateDiscountCode($id: ID!, $input: DiscountCodeInput!) {
    discountCodeUpdate(id: $id, input: $input) {
      codeDiscount {
        id
        code
        endsAt
        startsAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const DELETE_DISCOUNT_CODE = `
  mutation deleteDiscountCode($id: ID!) {
    discountCodeDelete(id: $id) {
      deletedCodeDiscountId
      userErrors {
        field
        message
      }
    }
  }
`;

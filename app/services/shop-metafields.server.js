export const APP_METAFIELD_NAMESPACE = "$app";

export async function getCurrentShopId(admin) {
  const shopResponse = await admin.graphql(
    `#graphql
      query CurrentShop {
        shop {
          id
        }
      }
    `,
  );
  const shopBody = await shopResponse.json();
  const ownerId = shopBody.data?.shop?.id;

  if (!ownerId) {
    throw new Error("Unable to find current shop");
  }

  return ownerId;
}

export async function readShopJsonMetafield(admin, metafield, fallback = []) {
  const response = await admin.graphql(
    `#graphql
      query ReadShopJsonMetafield($namespace: String!, $key: String!) {
        shop {
          metafield(namespace: $namespace, key: $key) {
            value
          }
        }
      }
    `,
    {
      variables: {
        namespace: metafield.namespace,
        key: metafield.key,
      },
    },
  );
  const body = await response.json();
  const value = body.data?.shop?.metafield?.value;

  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// export async function setShopJsonMetafields(admin, metafields) {
//   const ownerId = await getCurrentShopId(admin);
//   const metafieldResponse = await admin.graphql(
//     `#graphql
//       mutation SetShopJsonMetafields($metafields: [MetafieldsSetInput!]!) {
//         metafieldsSet(metafields: $metafields) {
//           metafields {
//             id
//             namespace
//             key
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }
//     `,
//     {
//       variables: {
//         metafields: metafields.map((metafield) => ({
//           ownerId,
//           namespace: metafield.namespace,
//           key: metafield.key,
//           type: "json",
//           value: JSON.stringify(metafield.value),
//         })),
//       },
//     },
//   );
//   const metafieldBody = await metafieldResponse.json();
//   const errors = metafieldBody.data?.metafieldsSet?.userErrors ?? [];

//   if (errors.length > 0) {
//     throw new Error(errors.map((error) => error.message).join(", "));
//   }

//   return metafields;
// }

export async function setShopJsonMetafields(admin, metafields) {
  const ownerId = await getCurrentShopId(admin);

  const input = metafields.map((metafield) => ({
    ownerId,
    namespace: metafield.namespace,
    key: metafield.key,
    type: "json",
    value: JSON.stringify(metafield.value),
  }));

  console.log(
    "SET SHOP METAFIELDS INPUT:",
    JSON.stringify(input, null, 2),
  );

  const metafieldResponse = await admin.graphql(
    `#graphql
      mutation SetShopJsonMetafields(
        $metafields: [MetafieldsSetInput!]!
      ) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            type
            value
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `,
    {
      variables: {
        metafields: input,
      },
    },
  );

  const metafieldBody = await metafieldResponse.json();

  console.log(
    "SHOPIFY METAFIELDS RESPONSE:",
    JSON.stringify(metafieldBody, null, 2),
  );

  // GraphQL-level errors
  if (metafieldBody.errors?.length) {
    throw new Error(
      metafieldBody.errors
        .map((error) => error.message)
        .join(", "),
    );
  }

  const result = metafieldBody.data?.metafieldsSet;

  if (!result) {
    throw new Error(
      "Shopify did not return a metafieldsSet response.",
    );
  }

  // Shopify user errors
  if (result.userErrors?.length) {
    throw new Error(
      result.userErrors
        .map((error) => {
          const field = error.field?.length
            ? ` [${error.field.join(".")}]`
            : "";

          const code = error.code
            ? ` (${error.code})`
            : "";

          return `${error.message}${field}${code}`;
        })
        .join(", "),
    );
  }

  return metafields;
}

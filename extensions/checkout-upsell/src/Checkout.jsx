/* eslint-disable react/prop-types */
import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useEffect, useState } from "preact/hooks";

const EMPTY_ARRAY = [];

const CHECKOUT_UPSELLS_METAFIELD = {
  namespace: "$app",
  key: "checkoutUpsells",
};

function truncateProductTitle(title, maxChars = 18) {
  const text = String(title || "").trim();

  if (text.length <= maxChars) {
    return text;
  }

  return `${text.slice(0, maxChars).trim()}...`;
}

export default async () => {
  render(<CheckoutUpsell />, document.body);
};

function CheckoutUpsell() {
  const cartLines = shopify.lines.value ?? EMPTY_ARRAY;

  const subtotal = Number(
    shopify.cost.subtotalAmount.value?.amount ?? 0,
  );

  const cartQuantity = cartLines.reduce(
    (total, line) =>
      total + Number(line.quantity ?? 0),
    0,
  );

  /*
   * Current checkout localization
   */
  const buyerCountry =
    shopify.localization.country.value?.isoCode || "";

  const checkoutCurrency =
    shopify.localization.currency.value?.isoCode || "";

  /*
   * Selected upsell block
   */
  const selectedUpsellId = String(
    shopify.settings.value?.upsell_id ?? "",
  ).trim();

  /*
   * Checkout upsell metafield
   */
  const appMetafields =
    shopify.appMetafields.value ?? EMPTY_ARRAY;

  const checkoutUpsellsMetafield =
    appMetafields.find(
      (appMetafield) =>
        appMetafield?.target?.type === "shop" &&
        appMetafield?.metafield?.namespace ===
          CHECKOUT_UPSELLS_METAFIELD.namespace &&
        appMetafield?.metafield?.key ===
          CHECKOUT_UPSELLS_METAFIELD.key,
    );

  const checkoutUpsellsValue =
    checkoutUpsellsMetafield?.metafield?.value ?? "";

  console.log(
    "GROW CHECKOUT UPSSELL DATA:",
    checkoutUpsellsValue,
  );

  const [visibleUpsells, setVisibleUpsells] =
    useState([]);

  const [localizedPrices, setLocalizedPrices] =
    useState({});

  /*
   * Find which upsells should currently be visible.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadVisibleUpsells() {
      const checkoutUpsells =
        parseCheckoutUpsells(
          checkoutUpsellsValue,
        );

      const upsellsForThisBlock =
        checkoutUpsells.filter((upsell) => {
          if (!selectedUpsellId) {
            return true;
          }

          return (
            String(upsell.id || "").trim() ===
            selectedUpsellId
          );
        });

      const matchedUpsells = [];

      for (const upsell of upsellsForThisBlock) {
        const shouldShow =
          await shouldShowUpsell(
            upsell,
            cartLines,
            subtotal,
            cartQuantity,
          );

        if (shouldShow) {
          matchedUpsells.push(upsell);
        }
      }

      if (!cancelled) {
        setVisibleUpsells(matchedUpsells);
      }
    }

    loadVisibleUpsells();

    return () => {
      cancelled = true;
    };
  }, [
    checkoutUpsellsValue,
    selectedUpsellId,
    cartLines,
    subtotal,
    cartQuantity,
  ]);

  /*
   * Fetch prices using the current Shopify market/country.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadLocalizedPrices() {
      const products = visibleUpsells.flatMap(
        (upsell) =>
          upsell.recommendedProducts || [],
      );

      if (products.length === 0) {
        setLocalizedPrices({});
        return;
      }

      const prices = await fetchLocalizedPrices(
        products,
        buyerCountry,
      );

      if (!cancelled) {
        setLocalizedPrices(prices);
      }
    }

    loadLocalizedPrices();

    return () => {
      cancelled = true;
    };
  }, [
    visibleUpsells,
    buyerCountry,
    checkoutCurrency,
  ]);

  if (visibleUpsells.length === 0) {
    return null;
  }

  return (
    <s-stack gap="base">
      {visibleUpsells.map((upsell) => (
        <s-stack
          key={String(upsell.id)}
          gap="base"
        >
          {/* =====================================
              UPSELL HEADING
              ===================================== */}

          <s-stack gap="small">
            <s-text type="strong">
              {upsell.title ||
                "Recommended for you"}
            </s-text>

            {upsell.description && (
              <s-text>
                {upsell.description}
              </s-text>
            )}
          </s-stack>

          {/* =====================================
              PRODUCTS
              ===================================== */}

          <ProductsLayout
            upsell={upsell}
            cartLines={cartLines}
            localizedPrices={localizedPrices}
          />
        </s-stack>
      ))}
    </s-stack>
  );
}

/* =========================================================
   LOCALIZED PRODUCT PRICES
   ========================================================= */

async function fetchLocalizedPrices(
  products,
  country,
) {
  const variantIds = [
    ...new Set(
      products
        .map((product) => product.variantId)
        .filter(Boolean),
    ),
  ];

  if (variantIds.length === 0) {
    return {};
  }

  try {
    const query = country
      ? `#graphql
        query CheckoutUpsellPrices(
          $variantIds: [ID!]!
          $country: CountryCode
        ) @inContext(country: $country) {
          nodes(ids: $variantIds) {
            ... on ProductVariant {
              id
              price {
                amount
                currencyCode
              }
            }
          }
        }
      `
      : `#graphql
        query CheckoutUpsellPrices(
          $variantIds: [ID!]!
        ) {
          nodes(ids: $variantIds) {
            ... on ProductVariant {
              id
              price {
                amount
                currencyCode
              }
            }
          }
        }
      `;

    const variables = country
      ? {
          variantIds,
          country,
        }
      : {
          variantIds,
        };

    const response = await shopify.query(
      query,
      {
        variables,
        version: "2026-04",
      },
    );

    if (response?.errors?.length) {
      console.error(
        "Localized price query errors:",
        response.errors,
      );

      return {};
    }

    const prices = {};

    for (
      const node of response?.data?.nodes || []
    ) {
      if (!node?.id || !node?.price) {
        continue;
      }

      prices[node.id] = {
        amount: Number(node.price.amount),
        currencyCode:
          node.price.currencyCode,
      };
    }

    return prices;
  } catch (error) {
    console.error(
      "Failed to fetch localized upsell prices:",
      error,
    );

    return {};
  }
}

/* =========================================================
   PRODUCTS LAYOUT
   ========================================================= */

function ProductsLayout({
  upsell,
  cartLines,
  localizedPrices,
}) {
  const products =
    upsell.recommendedProducts || [];

  const layout =
    upsell.layout === "stack"
      ? "stack"
      : upsell.layout === "slider"
        ? "slider"
        : "grid";

  /*
   * =======================================================
   * STACK
   * =======================================================
   */

  if (layout === "stack") {
    return (
      <s-scroll-box
        overflow="auto auto"
        maxBlockSize="430px"
        maxInlineSize="100%"
      >
        <s-stack gap="base">
          {products.map((product) => (
            <ProductCard
              key={
                product.id ||
                product.variantId ||
                product.title
              }
              product={product}
              cartLine={findCartLine(
                product,
                cartLines,
              )}
              localizedPrice={
                localizedPrices[
                  product.variantId
                ]
              }
              actionType={upsell.actionType}
              layout="stack"
            />
          ))}
        </s-stack>
      </s-scroll-box>
    );
  }

  /*
   * =======================================================
   * SLIDER
   * =======================================================
   */

  if (layout === "slider") {
    return (
      <SliderLayout
        products={products}
        cartLines={cartLines}
        localizedPrices={localizedPrices}
        actionType={upsell.actionType}
      />
    );
  }

  /*
   * =======================================================
   * GRID
   * =======================================================
   */

  return (
    <s-scroll-box
      overflow="auto auto"
      maxBlockSize="430px"
      maxInlineSize="100%"
    >
      <s-grid
        gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
        gap="base"
      >
        {products.map((product) => (
          <ProductCard
            key={
              product.id ||
              product.variantId ||
              product.title
            }
            product={product}
            cartLine={findCartLine(
              product,
              cartLines,
            )}
            localizedPrice={
              localizedPrices[
                product.variantId
              ]
            }
            actionType={
              upsell.actionType
            }
          />
        ))}
      </s-grid>
    </s-scroll-box>
  );
}

// Slider function
function SliderLayout({
  products,
  cartLines,
  localizedPrices,
  actionType,
}) {
  const PRODUCTS_PER_PAGE = 2;

  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(
    products.length / PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [products.length]);

  if (products.length === 0) {
    return null;
  }

  const startIndex =
    currentPage * PRODUCTS_PER_PAGE;

  const visibleProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <s-stack
      gap="base"
      inlineSize="100%"
      minInlineSize="0"
    >

      {/* =========================================
          TWO PRODUCTS PER VIEW
          ========================================= */}

      <s-grid
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        gap="base"
        inlineSize="100%"
        minInlineSize="0"
      >
        {visibleProducts.map((product) => (
          <ProductCard
            key={
              product.id ||
              product.variantId ||
              product.title
            }
            product={product}
            cartLine={findCartLine(
              product,
              cartLines,
            )}
            localizedPrice={
              localizedPrices[product.variantId]
            }
            actionType={actionType}
            layout="slider"
          />
        ))}
      </s-grid>

      {/* =========================================
          SLIDER ARROWS
          ========================================= */}

      {totalPages > 1 && (
        <s-stack
          direction="inline"
          justifyContent="center"
          alignItems="center"
          gap="large"
          inlineSize="100%"
        >
          <s-button
            variant="tertiary"
            accessibilityLabel="Previous products"
            disabled={!canGoPrevious}
            onClick={() =>
              setCurrentPage(
                (page) => page - 1,
              )
            }
          >
            ‹
          </s-button>

          <s-button
            variant="tertiary"
            accessibilityLabel="Next products"
            disabled={!canGoNext}
            onClick={() =>
              setCurrentPage(
                (page) => page + 1,
              )
            }
          >
            ›
          </s-button>
        </s-stack>
      )}
    </s-stack>
  );
}


/* =========================================================
   NORMAL PRODUCT CARD
   ========================================================= */

function ProductCard({
  product,
  cartLine,
  localizedPrice,
  actionType,
  layout,
}) {
  const canAdd =
    Boolean(product.variantId);

  const canRemove =
    Boolean(cartLine?.id);

  const productTitle =
    titleCase(product.title);

  const displayProductTitle =
    truncateProductTitle(productTitle, 18);

  const isDirectAdd =
    actionType === "directAdd";

  const isSlider =
    layout === "slider";


  const modalId =
    `product-details-${String(
      product.id ||
        product.variantId ||
        product.title,
    ).replace(
      /[^a-zA-Z0-9_-]/g,
      "-",
    )}`;

  const productDescription =
    product.description?.trim() ||
    "No additional product details available.";

  return (
    <>
      {/* =====================================================
          PRODUCT CARD
          ===================================================== */}

      <s-box
        border="base"
        borderRadius="base"
        padding="none"
        background="base"
        inlineSize="100%"
        minInlineSize="0"
      >

        {isSlider ? (
            /* =================================================
              SLIDER CARD
              ================================================= */
          <s-stack
              gap="none"
              inlineSize="100%"
              minInlineSize="0"
              alignItems="center"
            >
              {/* PRODUCT IMAGE */}
              {product.image ? (
                <s-image
                  src={product.image}
                  alt={product.title}
                  inlineSize="100%"
                  aspectRatio="4/5"
                  objectFit="cover"
                />
              ) : (
                <s-box
                  background="subdued"
                  inlineSize="100%"
                  aspectRatio="4/5"
                />
              )}

              {/* PRODUCT CONTENT */}
              <s-box
                paddingBlockStart="base"
                paddingBlockEnd="base"
                paddingInlineStart="base"
                paddingInlineEnd="base"
                inlineSize="100%"
                minInlineSize="0"
              >
                <s-stack
                  gap="small"
                  inlineSize="100%"
                  minInlineSize="0"
                  alignItems="center"
                >
                  {/* TITLE */}
                  <s-stack
                    inlineSize="100%"
                    alignItems="center"
                  >
                    <s-text
                      type="strong"
                      alignment="center"
                    >
                      {displayProductTitle}
                    </s-text>
                  </s-stack>

                  {/* PRICE */}
                  {localizedPrice ? (
                    <s-text alignment="center">
                      {formatPrice(
                        localizedPrice.amount,
                        localizedPrice.currencyCode
                      )}
                    </s-text>
                  ) : product.price ? (
                    <s-text alignment="center">
                      {product.price}
                    </s-text>
                  ) : null}

                  {/* ADD BUTTON */}
                  <s-box
                    inlineSize="100%"
                    paddingInlineStart="small"
                    paddingInlineEnd="small"
                  >
                    <s-button
                      variant="secondary"
                      inlineSize="fill"
                      disabled={!canAdd}
                      onClick={() => addProduct(product.variantId)}
                    >
                      Add
                    </s-button>
                  </s-box>

                  {/* VIEW DETAILS */}
                  {!isDirectAdd && (
                    <s-link
                      command="--show"
                      commandFor={modalId}
                      accessibilityLabel={`View details for ${productTitle}`}
                    >
                      View details →
                    </s-link>
                  )}

                  {/* REMOVE */}
                  {canRemove && (
                    <s-button
                      variant="tertiary"
                      inlineSize="fit-content"
                      accessibilityLabel={`Remove ${productTitle}`}
                      onClick={() => removeProduct(cartLine)}
                    >
                      Remove
                    </s-button>
                  )}
                </s-stack>
              </s-box>
            </s-stack>
          ) : (
          /* =================================================
             EXISTING GRID / STACK CARD
             ================================================= */

          <>
            <s-grid
              gridTemplateColumns={
                product.image
                  ? "56px minmax(0, 1fr) auto"
                  : "minmax(0, 1fr) auto"
              }
              gap="base"
              alignItems="center"
            >

              {product.image && (
                <s-image
                  src={product.image}
                  alt={product.title}
                  inlineSize="56px"
                  aspectRatio="1/1"
                  objectFit="cover"
                  borderRadius="base"
                />
              )}

              <s-stack gap="small">
                <s-text>
                  {productTitle}
                </s-text>

                {localizedPrice ? (
                  <s-text type="strong">
                    {formatPrice(
                      localizedPrice.amount,
                      localizedPrice.currencyCode,
                    )}
                  </s-text>
                ) : product.price ? (
                  <s-text type="strong">
                    {product.price}
                  </s-text>
                ) : null}
              </s-stack>

              {isDirectAdd ? (
                <s-button
                  variant="primary"
                  inlineSize="fit-content"
                  disabled={!canAdd}
                  onClick={() =>
                    addProduct(
                      product.variantId,
                    )
                  }
                >
                  Add
                </s-button>
              ) : (
                <s-button
                  variant="secondary"
                  inlineSize="fit-content"
                  command="--show"
                  commandFor={modalId}
                  disabled={!canAdd}
                >
                  View details
                </s-button>
              )}

            </s-grid>

            {canRemove && (
              <s-box paddingBlockStart="small">
                <s-button
                  variant="tertiary"
                  inlineSize="fit-content"
                  accessibilityLabel={`Remove ${productTitle}`}
                  onClick={() =>
                    removeProduct(
                      cartLine,
                    )
                  }
                >
                  Remove
                </s-button>
              </s-box>
            )}
          </>
        )}
      </s-box>


      {/* =====================================================
          PRODUCT DETAILS MODAL
          ===================================================== */}

      <s-modal
        id={modalId}
        heading=""
        size="large"
      >
        <s-grid
          gridTemplateColumns="
            minmax(240px, 42%)
            minmax(0, 58%)
          "
          gap="large"
          alignItems="stretch"
          inlineSize="100%"
          minInlineSize="0"
        >

          {/* LEFT - PRODUCT IMAGE */}

          <s-box
            inlineSize="100%"
            minInlineSize="0"
          >
            {product.image ? (
              <s-image
                src={product.image}
                alt={product.title}
                inlineSize="100%"
                aspectRatio="3/4"
                objectFit="cover"
              />
            ) : (
              <s-box
                background="subdued"
                aspectRatio="3/4"
              />
            )}
          </s-box>


          {/* RIGHT - PRODUCT INFORMATION */}

          <s-box
            inlineSize="100%"
            minInlineSize="0"
            paddingBlock="large"
            paddingInlineEnd="large"
          >
            <s-stack
              gap="base"
              inlineSize="100%"
              minInlineSize="0"
            >

              {/* TITLE */}

              <s-text type="strong">
                {productTitle}
              </s-text>


              {/* PRICE */}

              {localizedPrice ? (
                <s-text type="strong">
                  {formatPrice(
                    localizedPrice.amount,
                    localizedPrice.currencyCode,
                  )}
                </s-text>
              ) : product.price ? (
                <s-text type="strong">
                  {product.price}
                </s-text>
              ) : null}


              <s-divider />


              {/* DESCRIPTION */}

              <s-scroll-box
                overflow="auto"
                maxBlockSize="360px"
                inlineSize="100%"
              >
                <s-box
                  inlineSize="100%"
                  minInlineSize="0"
                  paddingBlockEnd="small"
                >
                  <ProductDescription
                    description={
                      productDescription
                    }
                  />
                </s-box>
              </s-scroll-box>


              {/* ADD TO CHECKOUT */}

              <s-box
                paddingBlockStart="base"
              >
                <s-button
                  variant="primary"
                  disabled={!canAdd}
                  onClick={() =>
                    addProduct(
                      product.variantId,
                    )
                  }
                  command="--hide"
                  commandFor={modalId}
                >
                  Add to Checkout
                </s-button>
              </s-box>

            </s-stack>
          </s-box>

        </s-grid>
      </s-modal>
    </>
  );
}

/* =========================================================
   PRODUCT DESCRIPTION
   ========================================================= */

function ProductDescription({
  description,
}) {
  if (!description) {
    return null;
  }

  const blocks =
    parseDescription(description);

  return (
    <s-stack
      gap="small"
      inlineSize="100%"
      minInlineSize="0"
    >
      {blocks.map(
        (block, index) => {
          if (
            block.type ===
            "bullet"
          ) {
            return (
              <s-stack
                key={index}
                direction="inline"
                gap="small"
                inlineSize="100%"
                minInlineSize="0"
              >
                <s-text>
                  •
                </s-text>

                <s-text>
                  {block.text}
                </s-text>
              </s-stack>
            );
          }

          return (
            <s-text key={index}>
              {block.text}
            </s-text>
          );
        },
      )}
    </s-stack>
  );
}

/* =========================================================
   DESCRIPTION PARSER
   ========================================================= */

function parseDescription(html) {
  if (!html) {
    return [];
  }

  let value =
    String(html);

  value = value
    .replace(
      /<br\s*\/?>/gi,
      "\n",
    )
    .replace(
      /<\/p>/gi,
      "\n",
    )
    .replace(
      /<\/div>/gi,
      "\n",
    )
    .replace(
      /<\/h[1-6]>/gi,
      "\n",
    );

  const bulletItems = [];

  value =
    value.replace(
      /<li[^>]*>([\s\S]*?)<\/li>/gi,
      (_, content) => {
        bulletItems.push(
          cleanDescriptionText(
            content,
          ),
        );

        return "\n";
      },
    );

  value = value
    .replace(
      /<ul[^>]*>/gi,
      "",
    )
    .replace(
      /<\/ul>/gi,
      "",
    )
    .replace(
      /<ol[^>]*>/gi,
      "",
    )
    .replace(
      /<\/ol>/gi,
      "",
    );

  const normalText =
    cleanDescriptionText(
      value,
    );

  const normalBlocks =
    normalText
      .split(/\n+/)
      .map(
        (text) =>
          text.trim(),
      )
      .filter(Boolean)
      .map(
        (text) => ({
          type: "text",
          text,
        }),
      );

  const bulletBlocks =
    bulletItems
      .filter(Boolean)
      .map(
        (text) => ({
          type: "bullet",
          text,
        }),
      );

  return [
    ...normalBlocks,
    ...bulletBlocks,
  ];
}

function cleanDescriptionText(
  value,
) {
  return String(value)
    .replace(
      /<strong[^>]*>/gi,
      "",
    )
    .replace(
      /<\/strong>/gi,
      "",
    )
    .replace(
      /<b[^>]*>/gi,
      "",
    )
    .replace(
      /<\/b>/gi,
      "",
    )
    .replace(
      /<em[^>]*>/gi,
      "",
    )
    .replace(
      /<\/em>/gi,
      "",
    )
    .replace(
      /<i[^>]*>/gi,
      "",
    )
    .replace(
      /<\/i>/gi,
      "",
    )
    .replace(
      /<[^>]+>/g,
      "",
    )
    .replace(
      /&nbsp;/gi,
      " ",
    )
    .replace(
      /&amp;/gi,
      "&",
    )
    .replace(
      /&quot;/gi,
      '"',
    )
    .replace(
      /&#39;/gi,
      "'",
    )
    .replace(
      /&lt;/gi,
      "<",
    )
    .replace(
      /&gt;/gi,
      ">",
    )
    .replace(
      /[ \t]+/g,
      " ",
    )
    .replace(
      /\n[ \t]+/g,
      "\n",
    )
    .trim();
}

/* =========================================================
   PRICE FORMAT
   ========================================================= */

function formatPrice(
  amount,
  currencyCode,
) {
  try {
    return new Intl.NumberFormat(
      undefined,
      {
        style:
          "currency",
        currency:
          currencyCode,
      },
    ).format(amount);
  } catch {
    return `${currencyCode} ${amount}`;
  }
}

/* =========================================================
   HELPERS
   ========================================================= */

function titleCase(
  value = "",
) {
  return String(value)
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function findCartLine(
  product,
  cartLines,
) {
  if (!product.variantId) {
    return null;
  }

  return cartLines.find(
    (line) =>
      line.merchandise
        ?.id ===
      product.variantId,
  );
}

/* =========================================================
   CART ACTIONS
   ========================================================= */

async function addProduct(
  variantId,
) {
  if (!variantId) {
    return;
  }

  try {
    const result =
      await shopify.applyCartLinesChange(
        {
          type:
            "addCartLine",
          merchandiseId:
            variantId,
          quantity: 1,
        },
      );

    if (
      result?.type ===
      "error"
    ) {
      console.error(
        "Failed to add upsell:",
        result,
      );
    }
  } catch (error) {
    console.error(
      "Failed to add upsell product:",
      error,
    );
  }
}

async function removeProduct(
  cartLine,
) {
  if (!cartLine?.id) {
    return;
  }

  try {
    const result =
      await shopify.applyCartLinesChange(
        {
          type:
            "removeCartLine",
          id: cartLine.id,
          quantity: 1,
        },
      );

    if (
      result?.type ===
      "error"
    ) {
      console.error(
        "Failed to remove upsell:",
        result,
      );
    }
  } catch (error) {
    console.error(
      "Failed to remove upsell product:",
      error,
    );
  }
}

/* =========================================================
   METAFIELD
   ========================================================= */

function parseCheckoutUpsells(
  value,
) {
  if (!value) {
    return [];
  }

  try {
    const parsedValue =
      JSON.parse(value);

    return Array.isArray(
      parsedValue,
    )
      ? parsedValue
      : [];
  } catch (error) {
    console.error(
      "Checkout upsell metafield parse error:",
      error,
    );

    return [];
  }
}

/* =========================================================
   UPSELL VISIBILITY
   ========================================================= */

async function shouldShowUpsell(
  upsell,
  cartLines,
  subtotal,
  cartQuantity,
) {
  const matchesTarget =
    await targetMatches(
      upsell,
      cartLines,
    );

  if (!matchesTarget) {
    return false;
  }

  if (
    !upsell.rules?.length
  ) {
    return true;
  }

  return upsell.rules.every(
    (rule) =>
      ruleMatches(
        rule,
        cartLines,
        subtotal,
        cartQuantity,
      ),
  );
}

/* =========================================================
   TARGET MATCHING
   ========================================================= */

async function targetMatches(
  upsell,
  cartLines,
) {
  const targetType =
    String(
      upsell.targetType ||
        "all",
    ).toLowerCase();

  /*
   * ALL PRODUCTS
   */

  if (
    targetType ===
      "all" ||
    targetType ===
      "allproducts" ||
    targetType ===
      "all-products"
  ) {
    return true;
  }

  /*
   * PRODUCTS
   */

  if (
    targetType ===
      "products" ||
    targetType ===
      "product"
  ) {
    const targetProductIds =
      (
        upsell.targetProducts ||
        []
      )
        .map((product) =>
          normalizeShopifyId(
            product?.id ||
              product?.value ||
              product?.admin_graphql_api_id,
            "Product",
          ),
        )
        .filter(Boolean);

    if (
      targetProductIds.length ===
      0
    ) {
      return false;
    }

    return cartLines.some(
      (line) => {
        const cartProductId =
          normalizeShopifyId(
            line.merchandise
              ?.product
              ?.id,
            "Product",
          );

        return targetProductIds.includes(
          cartProductId,
        );
      },
    );
  }

  /*
   * COLLECTIONS
   */

  if (
    targetType ===
      "collections" ||
    targetType ===
      "collection"
  ) {
    const targetCollectionIds =
      (
        upsell.targetCollections ||
        []
      )
        .map(
          (
            collection,
          ) =>
            normalizeShopifyId(
              collection?.id ||
                collection?.value ||
                collection?.admin_graphql_api_id,
              "Collection",
            ),
        )
        .filter(Boolean);

    if (
      targetCollectionIds.length ===
      0
    ) {
      return false;
    }

    const cartProductIds = [
      ...new Set(
        cartLines
          .map((line) =>
            normalizeShopifyId(
              line.merchandise
                ?.product
                ?.id,
              "Product",
            ),
          )
          .filter(Boolean),
      ),
    ];

    if (
      cartProductIds.length ===
      0
    ) {
      return false;
    }

    return await cartContainsTargetCollection(
      cartProductIds,
      targetCollectionIds,
    );
  }

  return false;
}

/* =========================================================
   COLLECTION MATCHING
   ========================================================= */

async function cartContainsTargetCollection(
  productIds,
  targetCollectionIds,
) {
  if (
    !Array.isArray(
      productIds,
    ) ||
    productIds.length ===
      0 ||
    !Array.isArray(
      targetCollectionIds,
    ) ||
    targetCollectionIds.length ===
      0
  ) {
    return false;
  }

  try {
    const response =
      await shopify.query(
        `#graphql
          query CheckoutUpsellProductCollections(
            $productIds: [ID!]!
          ) {
            nodes(ids: $productIds) {
              ... on Product {
                id

                collections(first: 250) {
                  nodes {
                    id
                  }
                }
              }
            }
          }
        `,
        {
          variables: {
            productIds,
          },
        },
      );

    if (
      response?.errors
        ?.length
    ) {
      console.error(
        "Collection query errors:",
        response.errors,
      );

      return false;
    }

    const products =
      response?.data?.nodes ||
      [];

    return products.some(
      (product) => {
        if (!product) {
          return false;
        }

        const productCollectionIds =
          (
            product
              .collections
              ?.nodes || []
          )
            .map(
              (
                collection,
              ) =>
                normalizeShopifyId(
                  collection?.id,
                  "Collection",
                ),
            )
            .filter(Boolean);

        return productCollectionIds.some(
          (collectionId) =>
            targetCollectionIds.includes(
              collectionId,
            ),
        );
      },
    );
  } catch (error) {
    console.error(
      "Failed to check cart product collections:",
      error,
    );

    return false;
  }
}

/* =========================================================
   SHOPIFY ID NORMALIZATION
   ========================================================= */

function normalizeShopifyId(
  value,
  resourceType,
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const id =
    String(value).trim();

  if (!id) {
    return "";
  }

  if (
    id.startsWith(
      "gid://shopify/",
    )
  ) {
    return id;
  }

  const numericId =
    id.match(
      /\d+$/,
    )?.[0];

  if (!numericId) {
    return id;
  }

  return `gid://shopify/${resourceType}/${numericId}`;
}

/* =========================================================
   RULES
   ========================================================= */

function ruleMatches(
  rule,
  cartLines,
  subtotal,
  cartQuantity,
) {
  if (!rule?.value) {
    return true;
  }

  if (
    rule.condition ===
    "cartQuantity"
  ) {
    return compare(
      cartQuantity,
      rule.operator,
      Number(
        rule.value,
      ),
    );
  }

  if (
    rule.condition ===
      "cartTotal" ||
    rule.condition ===
      "minimumPurchase"
  ) {
    return compare(
      subtotal,
      rule.operator,
      Number(
        rule.value,
      ),
    );
  }

  if (
    rule.condition ===
    "productInCart"
  ) {
    const hasProduct =
      cartLines.some(
        (line) =>
          String(
            line.merchandise
              ?.product
              ?.id || "",
          ).includes(
            String(
              rule.value,
            ),
          ),
      );

    return rule.operator ===
      "excludes"
      ? !hasProduct
      : hasProduct;
  }

  return true;
}

function compare(
  actual,
  operator,
  expected,
) {
  if (
    Number.isNaN(
      expected,
    )
  ) {
    return true;
  }

  if (
    operator ===
    "lessThan"
  ) {
    return (
      actual < expected
    );
  }

  if (
    operator === "equals"
  ) {
    return (
      actual === expected
    );
  }

  if (
    operator ===
    "greaterThanOrEqual"
  ) {
    return (
      actual >= expected
    );
  }

  return (
    actual > expected
  );
}


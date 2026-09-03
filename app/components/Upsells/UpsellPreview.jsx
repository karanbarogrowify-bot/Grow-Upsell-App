import PropTypes from "prop-types";
import { useState } from "react";

export default function UpsellPreview({
  layout = "grid",
  title = "Recommended Products",
  description = "We think you'll love these",
  actionType = "recommend",
}) {
  const [selectedLayout, setSelectedLayout] =
    useState(layout);

  const [sliderPage, setSliderPage] =
    useState(0);

  const mockProducts = [
    {
      id: "1",
      title: "Product A",
      price: "$99",
      image: "🖼️",
    },
    {
      id: "2",
      title: "Product B",
      price: "$149",
      image: "🖼️",
    },
    {
      id: "3",
      title: "Product C",
      price: "$199",
      image: "🖼️",
    },
    {
      id: "4",
      title: "Product D",
      price: "$249",
      image: "🖼️",
    },
  ];

  const layouts = [
    {
      value: "grid",
      label: "Grid",
      icon: "⊞",
    },
    {
      value: "stack",
      label: "Stack",
      icon: "≡",
    },
    {
      value: "slider",
      label: "Slider",
      icon: "‹ ›",
    },
  ];

  const renderGridLayout = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "12px",
      }}
    >
      {mockProducts.map((product) => (
        <ProductPreviewCard
          key={product.id}
          product={product}
          actionType={actionType}
        />
      ))}
    </div>
  );

  const renderStackLayout = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {mockProducts.map((product) => (
        <div
          key={product.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            border: "1px solid #e1e3e5",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "32px",
            }}
          >
            {product.image}
          </div>

          <div
            style={{
              flex: 1,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {product.title}
            </p>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "12px",
                color: "#6d7175",
              }}
            >
              Premium quality item
            </p>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 700,
              color: "#005bd3",
            }}
          >
            {product.price}
          </p>
        </div>
      ))}
    </div>
  );

  const renderSliderLayout = () => {
    const productsPerPage = 2;

    const totalPages = Math.ceil(
      mockProducts.length /
        productsPerPage,
    );

    const startIndex =
      sliderPage * productsPerPage;

    const visibleProducts =
      mockProducts.slice(
        startIndex,
        startIndex + productsPerPage,
      );

    const canGoPrevious =
      sliderPage > 0;

    const canGoNext =
      sliderPage < totalPages - 1;

    return (
      <div
        style={{
          width: "100%",
        }}
      >
        {/* PRODUCTS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: "12px",
          }}
        >
          {visibleProducts.map(
            (product) => (
              <ProductPreviewCard
                key={product.id}
                product={product}
                actionType={actionType}
              />
            ),
          )}
        </div>

        {/* ARROWS */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "28px",
            marginTop: "14px",
          }}
        >
          <button
            type="button"
            disabled={!canGoPrevious}
            onClick={() =>
              setSliderPage(
                (page) => page - 1,
              )
            }
            style={{
              border: 0,
              background: "transparent",
              fontSize: "24px",
              lineHeight: 1,
              cursor: canGoPrevious
                ? "pointer"
                : "default",
              opacity:
                canGoPrevious ? 1 : 0.3,
            }}
          >
            ‹
          </button>

          <button
            type="button"
            disabled={!canGoNext}
            onClick={() =>
              setSliderPage(
                (page) => page + 1,
              )
            }
            style={{
              border: 0,
              background: "transparent",
              fontSize: "24px",
              lineHeight: 1,
              cursor: canGoNext
                ? "pointer"
                : "default",
              opacity:
                canGoNext ? 1 : 0.3,
            }}
          >
            ›
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        borderRadius: "10px",
        border: "1px solid #e1e3e5",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            margin: "0 0 4px",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: 0,
            color: "#6d7175",
            fontSize: "13px",
          }}
        >
          {description}
        </p>
      </div>

      {/* LAYOUT SELECTOR */}

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "8px",
        }}
      >
        {layouts.map(
          (layoutOption) => (
            <button
              key={layoutOption.value}
              type="button"
              onClick={() => {
                setSelectedLayout(
                  layoutOption.value,
                );

                setSliderPage(0);
              }}
              style={{
                padding: "10px 16px",
                border:
                  selectedLayout ===
                  layoutOption.value
                    ? "2px solid #005bd3"
                    : "1px solid #c9cccf",
                borderRadius: "8px",
                background:
                  selectedLayout ===
                  layoutOption.value
                    ? "#f1f8ff"
                    : "#fff",
                color:
                  selectedLayout ===
                  layoutOption.value
                    ? "#005bd3"
                    : "#202223",
                cursor: "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>
                {layoutOption.icon}
              </span>

              {layoutOption.label}
            </button>
          ),
        )}
      </div>

      {/* PREVIEW */}

      <div
        style={{
          minHeight: "200px",
        }}
      >
        {selectedLayout ===
          "grid" &&
          renderGridLayout()}

        {selectedLayout ===
          "stack" &&
          renderStackLayout()}

        {selectedLayout ===
          "slider" &&
          renderSliderLayout()}
      </div>

      {/* INFO */}

      <div
        style={{
          marginTop: "16px",
          display: "grid",
          gap: "10px",
        }}
      >
        <div
          style={{
            padding: "12px",
            background: "#f1f8ff",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#005bd3",
          }}
        >
          Layout:{" "}
          <strong>
            {selectedLayout
              .charAt(0)
              .toUpperCase() +
              selectedLayout.slice(1)}
          </strong>
        </div>

        <div
          style={{
            padding: "12px",
            background: "#eef6ff",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#1b4d91",
          }}
        >
          Action:{" "}
          <strong>
            {actionType ===
            "directAdd"
              ? "Direct Add to Checkout"
              : "View Details"
            }
          </strong>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCT PREVIEW CARD
   ========================================================= */

function ProductPreviewCard({
  product,
  actionType,
}) {
  const isDirectAdd =
    actionType === "directAdd";

  return (
    <div
      style={{
        border: "1px solid #e1e3e5",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* IMAGE */}

      <div
        style={{
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f6f7",
          fontSize: "48px",
        }}
      >
        {product.image}
      </div>

      {/* CONTENT */}

      <div
        style={{
          padding: "12px",
        }}
      >
        <p
          style={{
            margin: "0 0 5px",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {product.title}
        </p>

        <p
          style={{
            margin: "0 0 10px",
            fontSize: "14px",
            fontWeight: 700,
            color: "#005bd3",
          }}
        >
          {product.price}
        </p>

        {/* ACTION */}

        {isDirectAdd ? (
          <button
            type="button"
            style={{
              width: "100%",
              padding: "8px",
              border:
                "1px solid #c9cccf",
              borderRadius: "6px",
              background: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        ) : (
          <button
            type="button"
            style={{
              width: "100%",
              padding: "6px",
              border: 0,
              background: "transparent",
              color: "#6d7175",
              textDecoration:
                "underline",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            View details →
          </button>
        )}
      </div>
    </div>
  );
}

UpsellPreview.propTypes = {
  layout: PropTypes.oneOf([
    "grid",
    "stack",
    "slider",
  ]),

  title: PropTypes.string,

  description: PropTypes.string,

  actionType: PropTypes.oneOf([
    "recommend",
    "directAdd",
  ]),
};

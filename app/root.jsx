import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>{`
          html,
          body,
          button,
          input,
          select,
          textarea {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Helvetica, Arial, sans-serif;
          }

          body {
            margin: 0;
          }
        `}</style>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

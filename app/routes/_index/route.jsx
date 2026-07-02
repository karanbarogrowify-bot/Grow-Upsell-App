import { redirect } from "react-router";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.toString();
  throw redirect(`/app/dashboard${search ? `?${search}` : ""}`);
};

export default function App() {
  return null;
}

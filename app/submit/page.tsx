import { redirect } from "next/navigation"

/** Short URL for the price submission form. */
export default function SubmitRedirectPage() {
  redirect("/submit-price")
}

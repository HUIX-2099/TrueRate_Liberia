import { redirect } from "next/navigation"

/** Alias so “+ Submit Price” can link to `/submit`. */
export default function SubmitRedirectPage() {
  redirect("/submit-price")
}

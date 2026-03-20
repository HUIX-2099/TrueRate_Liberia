import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Budget Tool | UL, Cuttington, Stella Maris",
  description:
    "Semester budget estimator, tuition breakdown, monthly transport estimate, and 'Can I afford this?' calculator for University of Liberia, Cuttington University, and Stella Maris Polytechnic students.",
}

export default function StudentBudgetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

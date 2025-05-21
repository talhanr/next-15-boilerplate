// /app/[locale]/layout.tsx
import { ReactNode } from "react";

type LocaleLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({
  children,
  params,
}: Readonly<LocaleLayoutProps>) {
  return <>{children}</>;
}

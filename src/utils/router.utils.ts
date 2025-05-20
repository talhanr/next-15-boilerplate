import type { NextRouter } from "next/router";

type NavigationMethod = NextRouter["push"] | NextRouter["replace"];

interface UpdateQueryOptions {
  router: NextRouter;
  lang?: string;
  method?: NavigationMethod;
  shallow?: boolean;
  scroll?: boolean;
  newQuery?: Record<string, any>;
}

export const updateQuery = ({
  router,
  lang,
  method,
  shallow = false,
  scroll = false,
  newQuery,
}: UpdateQueryOptions) => {
  const navigationMethod = method || router.push;

  // If you want to prevent redundant navigation:
  // if (router.asPath === router.pathname) return;

  navigationMethod(
    {
      pathname: router.pathname,
      query: { ...router.query, ...newQuery },
    },
    undefined,
    {
      locale: lang,
      scroll,
      shallow,
    }
  );
};

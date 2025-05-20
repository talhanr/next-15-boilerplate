import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "./reducers";

export const makeStore = () => {
  return configureStore({
    reducer,
    // middleware: () => new Tuple(additionalMiddleware, logger),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

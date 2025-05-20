const localStoreUtil = {
  store_data: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  },

  get_data: (key: string) => {
    const item = localStorage.getItem(key);
    if (!item) return undefined;
    return JSON.parse(item);
  },

  remove_data: (key: string) => {
    localStorage.removeItem(key);
    return true;
  },

  remove_all: () => {
    localStorage.clear();
    return true;
  },
};

export default localStoreUtil;

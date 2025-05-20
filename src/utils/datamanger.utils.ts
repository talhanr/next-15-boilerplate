const dataStorage: Record<string, any> = {};

export const setData = <T>(newData: T): string => {
  const dataId = Date.now().toString();
  dataStorage[dataId] = newData;
  return dataId;
};

export const getData = <T>(dataId: string): T => {
  const data = dataStorage[dataId];
  if (data === undefined) {
    console.warn(`No data found for dataId: ${dataId}`);
  }
  return dataStorage[dataId];
};

export const clearData = (dataId: string) => {
  delete dataStorage[dataId];
};

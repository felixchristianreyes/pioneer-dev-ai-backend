export type PlacesResponse = {
  results: {
    name: string;
    location: {
      address: string;
    };
    categories: {
      // this is the cuisine
      name: string;
    }[];
  }[];
};

export type QueryParams = {
  message: string;
  code: string;
};
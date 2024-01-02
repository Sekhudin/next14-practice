import { createApi, OrderBy,  } from 'unsplash-js';
import { Basic  } from 'unsplash-js/dist/methods/photos/types';

export { OrderBy };
export type { Basic };
export type Unsplash = ReturnType<typeof createApi>;
export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY as string,
});

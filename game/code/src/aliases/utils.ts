export type Listener<T> = {
  key: string;
  callback: (arg: T) => void;
};

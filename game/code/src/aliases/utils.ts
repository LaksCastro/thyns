export type Listener<T> = (arg: T) => void;

export type ListenerHashMap<T> = {
  [key: string]: Listener<T>;
};

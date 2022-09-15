import { createStore } from "react-use-sub";

export type Connection = { from: string; to: string };
export type ArchvData = { services: string[]; grpc: Connection[] };

export type State = {
  archvData?: ArchvData;
};
const initialState: State = {
  archvData: undefined,
};

export const [useSub, Store] = createStore(initialState);

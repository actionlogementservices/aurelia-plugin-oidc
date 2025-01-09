declare type Mandatory<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

declare type SimulatedUser = {
  profile: {
    name: string;
  };
  expired: boolean;
  access_token: string;
  expires_in?: number;
};

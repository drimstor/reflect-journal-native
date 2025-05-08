import { useGetCurrentUserQuery } from "@/src/entities";

export const usePrefetch = () => {
  useGetCurrentUserQuery();
};

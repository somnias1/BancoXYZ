import useCallbackApi from "@/utils/callbackApi";
import type { BalanceResponse } from "./types";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { balanceQueryKey, balancePaths } from "./constants";
import { config } from "@/config";

export function useGetBalance(options?: Partial<UseQueryOptions<BalanceResponse, Error>>) {
    const { callbackApi } = useCallbackApi();
    return useQuery({
        queryKey: [balanceQueryKey],
        queryFn: () => callbackApi<BalanceResponse>(balancePaths.get, {
            method: "GET",
            baseURL: config.apiURLs.balance,
        }),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        ...options,
    });
}
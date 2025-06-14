// This file is auto-generated by @hey-api/openapi-ts

import {
  type Options,
  entriesListPublicEntries,
  entriesCreateEntry,
  entriesDeleteEntry,
  entriesGetEntryById,
  entriesUpdateEntry,
  entriesGetEntryByShareLink,
  entriesGetEntryShareLink,
  viewsListViewsForEntry,
  viewsCreateView,
  viewsDeleteView,
  viewsGetViewById,
  viewsUpdateView,
  viewsGetViewSnapshot,
  viewsGetViewThumbnailImage,
  entriesListEntriesForUser,
  shareLinksGetShareLink,
  shareLinksUpdateShareLink,
  authLoginAdmin,
  authLoginUser,
  authLogout,
  authReadUsersMe,
  authProtectedRoute,
  authCheckAuth,
  testUploadFile,
  volsegEntriesListEntries,
  volsegEntriesUploadEntry,
  volsegEntriesDeleteView,
  volsegEntriesGetEntryById,
  volsegEntriesListPublicEntries,
} from "../sdk.gen";
import {
  queryOptions,
  infiniteQueryOptions,
  type InfiniteData,
  type UseMutationOptions,
  type DefaultError,
} from "@tanstack/react-query";
import type {
  EntriesListPublicEntriesData,
  EntriesListPublicEntriesError,
  EntriesListPublicEntriesResponse,
  EntriesCreateEntryData,
  EntriesCreateEntryError,
  EntriesCreateEntryResponse,
  EntriesDeleteEntryData,
  EntriesDeleteEntryError,
  EntriesDeleteEntryResponse,
  EntriesGetEntryByIdData,
  EntriesUpdateEntryData,
  EntriesUpdateEntryError,
  EntriesUpdateEntryResponse,
  EntriesGetEntryByShareLinkData,
  EntriesGetEntryShareLinkData,
  ViewsListViewsForEntryData,
  ViewsCreateViewData,
  ViewsCreateViewError,
  ViewsCreateViewResponse,
  ViewsDeleteViewData,
  ViewsDeleteViewError,
  ViewsDeleteViewResponse,
  ViewsGetViewByIdData,
  ViewsUpdateViewData,
  ViewsUpdateViewError,
  ViewsUpdateViewResponse,
  ViewsGetViewSnapshotData,
  ViewsGetViewThumbnailImageData,
  EntriesListEntriesForUserData,
  EntriesListEntriesForUserError,
  EntriesListEntriesForUserResponse,
  ShareLinksGetShareLinkData,
  ShareLinksUpdateShareLinkData,
  ShareLinksUpdateShareLinkError,
  ShareLinksUpdateShareLinkResponse,
  AuthLoginAdminData,
  AuthLoginUserData,
  AuthLogoutData,
  AuthReadUsersMeData,
  AuthProtectedRouteData,
  AuthCheckAuthData,
  TestUploadFileData,
  TestUploadFileError,
  VolsegEntriesListEntriesData,
  VolsegEntriesUploadEntryData,
  VolsegEntriesUploadEntryError,
  VolsegEntriesUploadEntryResponse,
  VolsegEntriesDeleteViewData,
  VolsegEntriesDeleteViewError,
  VolsegEntriesDeleteViewResponse,
  VolsegEntriesGetEntryByIdData,
  VolsegEntriesListPublicEntriesData,
} from "../types.gen";
import { client as _heyApiClient } from "../client.gen";

export type QueryKey<TOptions extends Options> = [
  Pick<TOptions, "baseUrl" | "body" | "headers" | "path" | "query"> & {
    _id: string;
    _infinite?: boolean;
  },
];

const createQueryKey = <TOptions extends Options>(
  id: string,
  options?: TOptions,
  infinite?: boolean,
): [QueryKey<TOptions>[0]] => {
  const params: QueryKey<TOptions>[0] = {
    _id: id,
    baseUrl: (options?.client ?? _heyApiClient).getConfig().baseUrl,
  } as QueryKey<TOptions>[0];
  if (infinite) {
    params._infinite = infinite;
  }
  if (options?.body) {
    params.body = options.body;
  }
  if (options?.headers) {
    params.headers = options.headers;
  }
  if (options?.path) {
    params.path = options.path;
  }
  if (options?.query) {
    params.query = options.query;
  }
  return [params];
};

export const entriesListPublicEntriesQueryKey = (
  options?: Options<EntriesListPublicEntriesData>,
) => createQueryKey("entriesListPublicEntries", options);

export const entriesListPublicEntriesOptions = (
  options?: Options<EntriesListPublicEntriesData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await entriesListPublicEntries({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: entriesListPublicEntriesQueryKey(options),
  });
};

const createInfiniteParams = <
  K extends Pick<QueryKey<Options>[0], "body" | "headers" | "path" | "query">,
>(
  queryKey: QueryKey<Options>,
  page: K,
) => {
  const params = queryKey[0];
  if (page.body) {
    params.body = {
      ...(queryKey[0].body as any),
      ...(page.body as any),
    };
  }
  if (page.headers) {
    params.headers = {
      ...queryKey[0].headers,
      ...page.headers,
    };
  }
  if (page.path) {
    params.path = {
      ...(queryKey[0].path as any),
      ...(page.path as any),
    };
  }
  if (page.query) {
    params.query = {
      ...(queryKey[0].query as any),
      ...(page.query as any),
    };
  }
  return params as unknown as typeof page;
};

export const entriesListPublicEntriesInfiniteQueryKey = (
  options?: Options<EntriesListPublicEntriesData>,
): QueryKey<Options<EntriesListPublicEntriesData>> =>
  createQueryKey("entriesListPublicEntries", options, true);

export const entriesListPublicEntriesInfiniteOptions = (
  options?: Options<EntriesListPublicEntriesData>,
) => {
  return infiniteQueryOptions<
    EntriesListPublicEntriesResponse,
    EntriesListPublicEntriesError,
    InfiniteData<EntriesListPublicEntriesResponse>,
    QueryKey<Options<EntriesListPublicEntriesData>>,
    | number
    | Pick<
        QueryKey<Options<EntriesListPublicEntriesData>>[0],
        "body" | "headers" | "path" | "query"
      >
  >(
    // @ts-ignore
    {
      queryFn: async ({ pageParam, queryKey, signal }) => {
        // @ts-ignore
        const page: Pick<
          QueryKey<Options<EntriesListPublicEntriesData>>[0],
          "body" | "headers" | "path" | "query"
        > =
          typeof pageParam === "object"
            ? pageParam
            : {
                query: {
                  page: pageParam,
                },
              };
        const params = createInfiniteParams(queryKey, page);
        const { data } = await entriesListPublicEntries({
          ...options,
          ...params,
          signal,
          throwOnError: true,
        });
        return data;
      },
      queryKey: entriesListPublicEntriesInfiniteQueryKey(options),
    },
  );
};

export const entriesCreateEntryQueryKey = (
  options: Options<EntriesCreateEntryData>,
) => createQueryKey("entriesCreateEntry", options);

export const entriesCreateEntryOptions = (
  options: Options<EntriesCreateEntryData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await entriesCreateEntry({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: entriesCreateEntryQueryKey(options),
  });
};

export const entriesCreateEntryMutation = (
  options?: Partial<Options<EntriesCreateEntryData>>,
): UseMutationOptions<
  EntriesCreateEntryResponse,
  EntriesCreateEntryError,
  Options<EntriesCreateEntryData>
> => {
  const mutationOptions: UseMutationOptions<
    EntriesCreateEntryResponse,
    EntriesCreateEntryError,
    Options<EntriesCreateEntryData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await entriesCreateEntry({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const entriesDeleteEntryMutation = (
  options?: Partial<Options<EntriesDeleteEntryData>>,
): UseMutationOptions<
  EntriesDeleteEntryResponse,
  EntriesDeleteEntryError,
  Options<EntriesDeleteEntryData>
> => {
  const mutationOptions: UseMutationOptions<
    EntriesDeleteEntryResponse,
    EntriesDeleteEntryError,
    Options<EntriesDeleteEntryData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await entriesDeleteEntry({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const entriesGetEntryByIdQueryKey = (
  options: Options<EntriesGetEntryByIdData>,
) => createQueryKey("entriesGetEntryById", options);

export const entriesGetEntryByIdOptions = (
  options: Options<EntriesGetEntryByIdData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await entriesGetEntryById({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: entriesGetEntryByIdQueryKey(options),
  });
};

export const entriesUpdateEntryMutation = (
  options?: Partial<Options<EntriesUpdateEntryData>>,
): UseMutationOptions<
  EntriesUpdateEntryResponse,
  EntriesUpdateEntryError,
  Options<EntriesUpdateEntryData>
> => {
  const mutationOptions: UseMutationOptions<
    EntriesUpdateEntryResponse,
    EntriesUpdateEntryError,
    Options<EntriesUpdateEntryData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await entriesUpdateEntry({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const entriesGetEntryByShareLinkQueryKey = (
  options: Options<EntriesGetEntryByShareLinkData>,
) => createQueryKey("entriesGetEntryByShareLink", options);

export const entriesGetEntryByShareLinkOptions = (
  options: Options<EntriesGetEntryByShareLinkData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await entriesGetEntryByShareLink({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: entriesGetEntryByShareLinkQueryKey(options),
  });
};

export const entriesGetEntryShareLinkQueryKey = (
  options: Options<EntriesGetEntryShareLinkData>,
) => createQueryKey("entriesGetEntryShareLink", options);

export const entriesGetEntryShareLinkOptions = (
  options: Options<EntriesGetEntryShareLinkData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await entriesGetEntryShareLink({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: entriesGetEntryShareLinkQueryKey(options),
  });
};

export const viewsListViewsForEntryQueryKey = (
  options: Options<ViewsListViewsForEntryData>,
) => createQueryKey("viewsListViewsForEntry", options);

export const viewsListViewsForEntryOptions = (
  options: Options<ViewsListViewsForEntryData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await viewsListViewsForEntry({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: viewsListViewsForEntryQueryKey(options),
  });
};

export const viewsCreateViewQueryKey = (
  options: Options<ViewsCreateViewData>,
) => createQueryKey("viewsCreateView", options);

export const viewsCreateViewOptions = (
  options: Options<ViewsCreateViewData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await viewsCreateView({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: viewsCreateViewQueryKey(options),
  });
};

export const viewsCreateViewMutation = (
  options?: Partial<Options<ViewsCreateViewData>>,
): UseMutationOptions<
  ViewsCreateViewResponse,
  ViewsCreateViewError,
  Options<ViewsCreateViewData>
> => {
  const mutationOptions: UseMutationOptions<
    ViewsCreateViewResponse,
    ViewsCreateViewError,
    Options<ViewsCreateViewData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await viewsCreateView({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const viewsDeleteViewMutation = (
  options?: Partial<Options<ViewsDeleteViewData>>,
): UseMutationOptions<
  ViewsDeleteViewResponse,
  ViewsDeleteViewError,
  Options<ViewsDeleteViewData>
> => {
  const mutationOptions: UseMutationOptions<
    ViewsDeleteViewResponse,
    ViewsDeleteViewError,
    Options<ViewsDeleteViewData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await viewsDeleteView({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const viewsGetViewByIdQueryKey = (
  options: Options<ViewsGetViewByIdData>,
) => createQueryKey("viewsGetViewById", options);

export const viewsGetViewByIdOptions = (
  options: Options<ViewsGetViewByIdData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await viewsGetViewById({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: viewsGetViewByIdQueryKey(options),
  });
};

export const viewsUpdateViewMutation = (
  options?: Partial<Options<ViewsUpdateViewData>>,
): UseMutationOptions<
  ViewsUpdateViewResponse,
  ViewsUpdateViewError,
  Options<ViewsUpdateViewData>
> => {
  const mutationOptions: UseMutationOptions<
    ViewsUpdateViewResponse,
    ViewsUpdateViewError,
    Options<ViewsUpdateViewData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await viewsUpdateView({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const viewsGetViewSnapshotQueryKey = (
  options: Options<ViewsGetViewSnapshotData>,
) => createQueryKey("viewsGetViewSnapshot", options);

export const viewsGetViewSnapshotOptions = (
  options: Options<ViewsGetViewSnapshotData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await viewsGetViewSnapshot({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: viewsGetViewSnapshotQueryKey(options),
  });
};

export const viewsGetViewThumbnailImageQueryKey = (
  options: Options<ViewsGetViewThumbnailImageData>,
) => createQueryKey("viewsGetViewThumbnailImage", options);

export const viewsGetViewThumbnailImageOptions = (
  options: Options<ViewsGetViewThumbnailImageData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await viewsGetViewThumbnailImage({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: viewsGetViewThumbnailImageQueryKey(options),
  });
};

export const entriesListEntriesForUserQueryKey = (
  options?: Options<EntriesListEntriesForUserData>,
) => createQueryKey("entriesListEntriesForUser", options);

export const entriesListEntriesForUserOptions = (
  options?: Options<EntriesListEntriesForUserData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await entriesListEntriesForUser({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: entriesListEntriesForUserQueryKey(options),
  });
};

export const entriesListEntriesForUserInfiniteQueryKey = (
  options?: Options<EntriesListEntriesForUserData>,
): QueryKey<Options<EntriesListEntriesForUserData>> =>
  createQueryKey("entriesListEntriesForUser", options, true);

export const entriesListEntriesForUserInfiniteOptions = (
  options?: Options<EntriesListEntriesForUserData>,
) => {
  return infiniteQueryOptions<
    EntriesListEntriesForUserResponse,
    EntriesListEntriesForUserError,
    InfiniteData<EntriesListEntriesForUserResponse>,
    QueryKey<Options<EntriesListEntriesForUserData>>,
    | number
    | Pick<
        QueryKey<Options<EntriesListEntriesForUserData>>[0],
        "body" | "headers" | "path" | "query"
      >
  >(
    // @ts-ignore
    {
      queryFn: async ({ pageParam, queryKey, signal }) => {
        // @ts-ignore
        const page: Pick<
          QueryKey<Options<EntriesListEntriesForUserData>>[0],
          "body" | "headers" | "path" | "query"
        > =
          typeof pageParam === "object"
            ? pageParam
            : {
                query: {
                  page: pageParam,
                },
              };
        const params = createInfiniteParams(queryKey, page);
        const { data } = await entriesListEntriesForUser({
          ...options,
          ...params,
          signal,
          throwOnError: true,
        });
        return data;
      },
      queryKey: entriesListEntriesForUserInfiniteQueryKey(options),
    },
  );
};

export const shareLinksGetShareLinkQueryKey = (
  options: Options<ShareLinksGetShareLinkData>,
) => createQueryKey("shareLinksGetShareLink", options);

export const shareLinksGetShareLinkOptions = (
  options: Options<ShareLinksGetShareLinkData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await shareLinksGetShareLink({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: shareLinksGetShareLinkQueryKey(options),
  });
};

export const shareLinksUpdateShareLinkMutation = (
  options?: Partial<Options<ShareLinksUpdateShareLinkData>>,
): UseMutationOptions<
  ShareLinksUpdateShareLinkResponse,
  ShareLinksUpdateShareLinkError,
  Options<ShareLinksUpdateShareLinkData>
> => {
  const mutationOptions: UseMutationOptions<
    ShareLinksUpdateShareLinkResponse,
    ShareLinksUpdateShareLinkError,
    Options<ShareLinksUpdateShareLinkData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await shareLinksUpdateShareLink({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const authLoginAdminQueryKey = (options?: Options<AuthLoginAdminData>) =>
  createQueryKey("authLoginAdmin", options);

export const authLoginAdminOptions = (
  options?: Options<AuthLoginAdminData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await authLoginAdmin({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: authLoginAdminQueryKey(options),
  });
};

export const authLoginAdminMutation = (
  options?: Partial<Options<AuthLoginAdminData>>,
): UseMutationOptions<unknown, DefaultError, Options<AuthLoginAdminData>> => {
  const mutationOptions: UseMutationOptions<
    unknown,
    DefaultError,
    Options<AuthLoginAdminData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await authLoginAdmin({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const authLoginUserQueryKey = (options?: Options<AuthLoginUserData>) =>
  createQueryKey("authLoginUser", options);

export const authLoginUserOptions = (options?: Options<AuthLoginUserData>) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await authLoginUser({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: authLoginUserQueryKey(options),
  });
};

export const authLoginUserMutation = (
  options?: Partial<Options<AuthLoginUserData>>,
): UseMutationOptions<unknown, DefaultError, Options<AuthLoginUserData>> => {
  const mutationOptions: UseMutationOptions<
    unknown,
    DefaultError,
    Options<AuthLoginUserData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await authLoginUser({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const authLogoutQueryKey = (options?: Options<AuthLogoutData>) =>
  createQueryKey("authLogout", options);

export const authLogoutOptions = (options?: Options<AuthLogoutData>) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await authLogout({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: authLogoutQueryKey(options),
  });
};

export const authLogoutMutation = (
  options?: Partial<Options<AuthLogoutData>>,
): UseMutationOptions<unknown, DefaultError, Options<AuthLogoutData>> => {
  const mutationOptions: UseMutationOptions<
    unknown,
    DefaultError,
    Options<AuthLogoutData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await authLogout({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const authReadUsersMeQueryKey = (
  options?: Options<AuthReadUsersMeData>,
) => createQueryKey("authReadUsersMe", options);

export const authReadUsersMeOptions = (
  options?: Options<AuthReadUsersMeData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await authReadUsersMe({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: authReadUsersMeQueryKey(options),
  });
};

export const authProtectedRouteQueryKey = (
  options?: Options<AuthProtectedRouteData>,
) => createQueryKey("authProtectedRoute", options);

export const authProtectedRouteOptions = (
  options?: Options<AuthProtectedRouteData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await authProtectedRoute({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: authProtectedRouteQueryKey(options),
  });
};

export const authCheckAuthQueryKey = (options?: Options<AuthCheckAuthData>) =>
  createQueryKey("authCheckAuth", options);

export const authCheckAuthOptions = (options?: Options<AuthCheckAuthData>) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await authCheckAuth({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: authCheckAuthQueryKey(options),
  });
};

export const testUploadFileQueryKey = (options: Options<TestUploadFileData>) =>
  createQueryKey("testUploadFile", options);

export const testUploadFileOptions = (options: Options<TestUploadFileData>) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await testUploadFile({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: testUploadFileQueryKey(options),
  });
};

export const testUploadFileMutation = (
  options?: Partial<Options<TestUploadFileData>>,
): UseMutationOptions<
  unknown,
  TestUploadFileError,
  Options<TestUploadFileData>
> => {
  const mutationOptions: UseMutationOptions<
    unknown,
    TestUploadFileError,
    Options<TestUploadFileData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await testUploadFile({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const volsegEntriesListEntriesQueryKey = (
  options?: Options<VolsegEntriesListEntriesData>,
) => createQueryKey("volsegEntriesListEntries", options);

export const volsegEntriesListEntriesOptions = (
  options?: Options<VolsegEntriesListEntriesData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await volsegEntriesListEntries({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: volsegEntriesListEntriesQueryKey(options),
  });
};

export const volsegEntriesUploadEntryQueryKey = (
  options: Options<VolsegEntriesUploadEntryData>,
) => createQueryKey("volsegEntriesUploadEntry", options);

export const volsegEntriesUploadEntryOptions = (
  options: Options<VolsegEntriesUploadEntryData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await volsegEntriesUploadEntry({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: volsegEntriesUploadEntryQueryKey(options),
  });
};

export const volsegEntriesUploadEntryMutation = (
  options?: Partial<Options<VolsegEntriesUploadEntryData>>,
): UseMutationOptions<
  VolsegEntriesUploadEntryResponse,
  VolsegEntriesUploadEntryError,
  Options<VolsegEntriesUploadEntryData>
> => {
  const mutationOptions: UseMutationOptions<
    VolsegEntriesUploadEntryResponse,
    VolsegEntriesUploadEntryError,
    Options<VolsegEntriesUploadEntryData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await volsegEntriesUploadEntry({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const volsegEntriesDeleteViewMutation = (
  options?: Partial<Options<VolsegEntriesDeleteViewData>>,
): UseMutationOptions<
  VolsegEntriesDeleteViewResponse,
  VolsegEntriesDeleteViewError,
  Options<VolsegEntriesDeleteViewData>
> => {
  const mutationOptions: UseMutationOptions<
    VolsegEntriesDeleteViewResponse,
    VolsegEntriesDeleteViewError,
    Options<VolsegEntriesDeleteViewData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await volsegEntriesDeleteView({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const volsegEntriesGetEntryByIdQueryKey = (
  options: Options<VolsegEntriesGetEntryByIdData>,
) => createQueryKey("volsegEntriesGetEntryById", options);

export const volsegEntriesGetEntryByIdOptions = (
  options: Options<VolsegEntriesGetEntryByIdData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await volsegEntriesGetEntryById({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: volsegEntriesGetEntryByIdQueryKey(options),
  });
};

export const volsegEntriesListPublicEntriesQueryKey = (
  options?: Options<VolsegEntriesListPublicEntriesData>,
) => createQueryKey("volsegEntriesListPublicEntries", options);

export const volsegEntriesListPublicEntriesOptions = (
  options?: Options<VolsegEntriesListPublicEntriesData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await volsegEntriesListPublicEntries({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: volsegEntriesListPublicEntriesQueryKey(options),
  });
};

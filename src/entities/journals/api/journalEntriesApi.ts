import { baseApi } from "@/src/shared/api/baseApi";
// import { formatValidationErrors } from "@/src/shared/store";
import type {
  JournalEntry,
  JournalEntryResponse,
  CreateJournalEntryRequest,
  UpdateJournalEntryRequest,
} from "../model/types";
// import { Alert } from "react-native";
import { mergeQueryData } from "@/src/shared/store";
import { ENTITY_NAME } from "@/src/shared/const/ENTITIES";
// import { journalsApiUtil } from "./journalsApi";

export const journalEntriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJournalEntries: builder.query<JournalEntryResponse, { params?: string }>(
      {
        query: ({ params }) => ({
          url: `/journal-entries${params ? `?${params}` : ""}`,
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.data.map(({ id }) => ({
                  type: ENTITY_NAME.JOURNAL_ENTRY,
                  id,
                })),
                { type: ENTITY_NAME.JOURNAL_ENTRY, id: "LIST" },
              ]
            : [{ type: ENTITY_NAME.JOURNAL_ENTRY, id: "LIST" }],
        serializeQueryArgs: ({ endpointName, queryArgs }) => {
          const params = new URLSearchParams(queryArgs.params || "");
          const hasOnlyPagination = Array.from(params.keys()).every(
            (key) => key === "page" || key === "limit"
          );

          return hasOnlyPagination
            ? endpointName
            : `${endpointName}-${queryArgs.params}`;
        },
        merge: (currentCache, newItems, { arg }) => {
          return mergeQueryData(currentCache, newItems, arg.params);
        },
        forceRefetch({ currentArg, previousArg }) {
          return currentArg !== previousArg;
        },
      }
    ),
    getJournalEntry: builder.query<JournalEntry, { id: string }>({
      query: ({ id }) => ({
        url: `/journal-entries/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [
        { type: ENTITY_NAME.JOURNAL_ENTRY, id: id },
      ],
    }),
    searchEntries: builder.query<
      JournalEntry[],
      { query: string; journal_id?: string }
    >({
      query: ({ query, journal_id }) => ({
        url: "/journal-entries/search",
        method: "GET",
        params: { query, journal_id },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: ENTITY_NAME.JOURNAL_ENTRY,
                id,
              })),
              { type: ENTITY_NAME.JOURNAL_ENTRY, id: "SEARCH" },
            ]
          : [{ type: ENTITY_NAME.JOURNAL_ENTRY, id: "SEARCH" }],
    }),

    createJournalEntry: builder.mutation<
      JournalEntry,
      CreateJournalEntryRequest
    >({
      query: (body) => ({
        url: "/journal-entries/create",
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => [
        { type: ENTITY_NAME.JOURNAL_ENTRY, id: "LIST" },
        { type: ENTITY_NAME.JOURNAL, id: "LIST" },
      ],
      // async onQueryStarted(body, { dispatch, queryFulfilled }) {
      //   try {
      //     await queryFulfilled;

      //     // Принудительно обновляем список дневников после создания новой записи
      //     dispatch(
      //       journalsApiUtil.invalidateTags([
      //         { type: ENTITY_NAME.JOURNAL, id: "LIST" },
      //       ])
      //     );

      //     // Если указан journal_id, также принудительно обновляем конкретный дневник
      //     if (body.journal_id) {
      //       dispatch(
      //         journalsApiUtil.invalidateTags([
      //           { type: ENTITY_NAME.JOURNAL, id: body.journal_id },
      //         ])
      //       );
      //     }
      //   } catch (error: any) {
      //     Alert.alert(
      //       "Ошибка",
      //       formatValidationErrors(error.error?.data) ||
      //         "Не удалось создать запись"
      //     );
      //   }
      // },
    }),

    updateJournalEntry: builder.mutation<
      JournalEntry,
      { id: string; body: UpdateJournalEntryRequest }
    >({
      query: ({ id, body }) => ({
        url: `/journal-entries/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id, body }) => [
        { type: ENTITY_NAME.JOURNAL_ENTRY, id },
        { type: ENTITY_NAME.JOURNAL_ENTRY, id: "LIST" },
        { type: ENTITY_NAME.JOURNAL, id: "LIST" },
      ],
      // // Если изменена запись, нужно обновить и журнал
      // async onQueryStarted({ body }, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled;

      //     // Если у записи есть journal_id, обновляем также дневник
      //     if (data && data.journal_id) {
      //       dispatch(
      //         journalsApiUtil.invalidateTags([
      //           { type: ENTITY_NAME.JOURNAL, id: data.journal_id },
      //           { type: ENTITY_NAME.JOURNAL, id: "LIST" },
      //         ])
      //       );
      //     }
      //   } catch (error) {
      //     // Игнорируем ошибки
      //   }
      // },
    }),

    deleteJournalEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/journal-entries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: ENTITY_NAME.JOURNAL_ENTRY, id: "LIST" },
        { type: ENTITY_NAME.JOURNAL, id: "LIST" },
      ],
      // // При удалении записи также обновляем список дневников
      // async onQueryStarted(_, { dispatch, queryFulfilled }) {
      //   try {
      //     await queryFulfilled;

      //     // Принудительно обновляем список дневников
      //     dispatch(
      //       journalsApiUtil.invalidateTags([
      //         { type: ENTITY_NAME.JOURNAL, id: "LIST" },
      //       ])
      //     );
      //   } catch (error) {
      //     // Игнорируем ошибки
      //   }
      // },
    }),
  }),
});

export const {
  useGetJournalEntriesQuery,
  useGetJournalEntryQuery,
  useSearchEntriesQuery,
  useCreateJournalEntryMutation,
  useUpdateJournalEntryMutation,
  useDeleteJournalEntryMutation,
} = journalEntriesApi;

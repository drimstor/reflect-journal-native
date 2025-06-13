import { baseApi } from "@/src/shared/api/baseApi";
import {
  DocumentResponse,
  GetAllDocumentsRequest,
  GetDocumentByIdRequest,
} from "../model/types";

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDocuments: builder.query<DocumentResponse[], GetAllDocumentsRequest>({
      query: () => ({
        url: "/documents",
        method: "GET",
      }),
      providesTags: ["Documents"],
      // Кэшируем на 12 часов (как в affirmations)
      keepUnusedDataFor: 12 * 60 * 60, // 12 часов в секундах
    }),
    getDocumentById: builder.query<DocumentResponse, GetDocumentByIdRequest>({
      query: ({ id }) => ({
        url: `/documents/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "Documents", id }],
      // Кэшируем на 12 часов
      keepUnusedDataFor: 12 * 60 * 60, // 12 часов в секундах
    }),
  }),
});

export const {
  useGetAllDocumentsQuery,
  useGetDocumentByIdQuery,
  useLazyGetAllDocumentsQuery,
  useLazyGetDocumentByIdQuery,
} = documentsApi;

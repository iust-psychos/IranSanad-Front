import { api } from "./ApiManager";

export const contentEditorLoader = async ({ params }) => {
  const { doc_uuid } = params;
  const response = await api.post(`/docs/document_lookup/`, {
    doc_uuid: doc_uuid,
  });
  return response.data;
};

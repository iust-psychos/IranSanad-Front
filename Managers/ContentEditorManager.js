import { apiFetch } from "@/utils/ApiFetch";
import constants from "./constants.js";

export const contentEditorLoader = async ({ params }) => {
  const { doc_uuid } = params;
  return apiFetch(`${constants.baseUrl}docs/document_lookup/`, {
    method: "Post",
    body: JSON.stringify({ doc_uuid: doc_uuid }),
  });
};

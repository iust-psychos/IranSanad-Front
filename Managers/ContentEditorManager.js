import { apiFetch } from "@/utils/ApiFetch";

export const contentEditorLoader = async ({ params }) => {
  const { doc_uuid } = params;
  return apiFetch("http://iransanad.fiust.ir/api/v1/docs/document_lookup/", {
    method: "Post",
    body: JSON.stringify({ doc_uuid: doc_uuid }),
  });
};

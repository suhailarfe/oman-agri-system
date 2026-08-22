export type ExportableDocument = {
  title: string;
  versionTag: string;
  status: string;
  summary: string;
  content: string;
  changeSummary: string;
};

export function createRoleAwareExport(document: ExportableDocument, role: "admin" | "user") {
  const isAdmin = role === "admin";
  return {
    title: document.title,
    versionTag: document.versionTag,
    status: document.status,
    summary: document.summary,
    content: isAdmin ? document.content : document.summary,
    changeSummary: isAdmin
      ? document.changeSummary
      : "تتضمن نسخة المستثمر الملخص التنفيذي والنطاق المعتمد للوثيقة فقط.",
    exportAudience: isAdmin ? "المشرف" : "المستثمر",
  };
}

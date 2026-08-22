export function buildVersionApproval(releaseToInvestors: boolean, approvalNote: string, approvedByOpenId: string) {
  return {
    status: releaseToInvestors ? "معتمد ومتاح للمستثمرين" : "معتمد للاستخدام الإداري",
    accessLevel: releaseToInvestors ? ("investor" as const) : ("admin" as const),
    publicationState: "approved" as const,
    approvedByOpenId,
    approvedAt: new Date(),
    approvalNote,
  };
}

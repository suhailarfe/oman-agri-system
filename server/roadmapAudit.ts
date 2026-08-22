export function buildRoadmapProgressAudit(input: {
  milestoneCode: string;
  previousProgressPercent: number;
  nextProgressPercent: number;
  reason: string;
  changedByOpenId: string;
  changedByName: string | null;
}) {
  return {
    milestoneCode: input.milestoneCode,
    previousProgressPercent: input.previousProgressPercent,
    nextProgressPercent: input.nextProgressPercent,
    reason: input.reason,
    changedByOpenId: input.changedByOpenId,
    changedByName: input.changedByName,
  };
}

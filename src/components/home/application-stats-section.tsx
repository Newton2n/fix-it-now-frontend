import { getAppStats } from "@/actions/stats.action";
import { ApplicationStats } from "./application-stats";

export async function ApplicationStatsSection() {
  const response = await getAppStats();
  console.log("stats response",response)

  if (!response.success || !response.data) {
    return null;
  }

  return <ApplicationStats stats={response.data} />;
}
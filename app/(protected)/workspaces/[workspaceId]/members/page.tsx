import { AppShell } from "@/components/global/shell";
import { WorkspaceMembers } from "@/components/workspace/workspace-members";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WorkspaceMembersPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  return (
    <AppShell>
      <div className="grid gap-8">
        <WorkspaceMembers workspaceId={params.workspaceId} />
      </div>
    </AppShell>
  );
}

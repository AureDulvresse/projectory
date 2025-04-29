import { AppShell } from "@/components/global/shell";
import { NewWorkspaceForm } from "@/components/workspace/new-workspace-form";

export default function NewWorkspacePage() {
  return (
    <AppShell>
      <div className="grid gap-8">
        <NewWorkspaceForm />
      </div>
    </AppShell>
  );
}

import { Button } from "@/registry/components/button/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/registry/components/dialog/dialog";
import { Input } from "@/registry/components/input/input";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  Preview: () => <Dialog>
    <DialogTrigger asChild><Button variant="secondary">Rename project</Button></DialogTrigger>
    <DialogContent title="Rename project" description="Everyone with access sees the new name.">
      <div style={{ display: "grid", gap: 16 }}>
        <Input label="Project name" defaultValue="Silicon onboarding" />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
          <DialogClose asChild><Button>Save</Button></DialogClose>
        </div>
      </div>
    </DialogContent>
  </Dialog>,
  usage: `<Dialog>
  <DialogTrigger asChild>
    <Button variant="secondary">Rename project</Button>
  </DialogTrigger>
  <DialogContent title="Rename project" description="Everyone with access sees the new name.">
    <Input label="Project name" defaultValue="Silicon onboarding" />
  </DialogContent>
</Dialog>`,
});

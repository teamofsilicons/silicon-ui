"use client";

import { useState } from "react";
import { Button } from "@/registry/components/button/button";
import { CommandPalette } from "@/registry/components/command-palette/command-palette";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/registry/components/dialog/dialog";
import { Input } from "@/registry/components/input/input";
import { defineDemo } from "../lib/demo";

export default defineDemo({
  Preview: () => {
    const [paletteOpen, setPaletteOpen] = useState(false);
    return <div style={{ display: "flex", gap: "var(--space-related)", flexWrap: "wrap" }}>
      <Dialog>
        <DialogTrigger asChild><Button variant="secondary">Rename project</Button></DialogTrigger>
        <DialogContent title="Rename project" description="Everyone with access sees the new name.">
          <div style={{ display: "grid", gap: "var(--space-inset)" }}>
            <Input label="Project name" defaultValue="Silicon onboarding" />
            <div style={{ display: "flex", gap: "var(--space-related)", justifyContent: "flex-end" }}>
              <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
              <DialogClose asChild><Button>Save</Button></DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={paletteOpen} onOpenChange={setPaletteOpen}>
        <DialogTrigger asChild><Button variant="secondary">Search actions</Button></DialogTrigger>
        <DialogContent title="Search actions" hideHeader placement="top">
          <CommandPalette autoFocus items={[{ id: "rename", label: "Rename project" }, { id: "invite", label: "Invite a teammate" }]} onClose={() => setPaletteOpen(false)} onSelect={() => setPaletteOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>;
  },
  usage: `<Dialog>
  <DialogTrigger asChild>
    <Button variant="secondary">Rename project</Button>
  </DialogTrigger>
  <DialogContent title="Rename project" description="Everyone with access sees the new name.">
    <Input label="Project name" defaultValue="Silicon onboarding" />
  </DialogContent>
</Dialog>`,
});

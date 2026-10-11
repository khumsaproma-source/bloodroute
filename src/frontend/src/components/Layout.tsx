import { AppNav } from "@/components/AppNav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile, useSetProfile } from "@/hooks/useQueries";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import { Building2, Droplet, LogOut, UserRound } from "lucide-react";
import { useState } from "react";

function ProfileMenu() {
  const { data: profile } = useProfile();
  const { clear } = useInternetIdentity();
  const [editOpen, setEditOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const setProfile = useSetProfile();

  const name = profile?.displayName?.trim() || "ผู้ใช้ใหม่";
  const organization = profile?.organizationName?.trim() || "ยังไม่ระบุหน่วยงาน";

  function openEdit() {
    setDisplayName(profile?.displayName ?? "");
    setOrganizationName(profile?.organizationName ?? "");
    setEditOpen(true);
  }

  function handleSave() {
    const nextName = displayName.trim();
    const nextOrg = organizationName.trim();
    if (!nextName) return;
    setProfile.mutate(
      { displayName: nextName, organizationName: nextOrg },
      { onSuccess: () => setEditOpen(false) },
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="gap-2 px-2"
            data-ocid="profile.dropdown_menu"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRound className="size-4" />
            </span>
            <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:inline">
              {name}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="truncate font-medium">{name}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {organization}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={openEdit} data-ocid="profile.edit_button">
            <UserRound className="size-4" />
            แก้ไขโปรไฟล์
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => clear()}
            data-ocid="profile.logout_button"
          >
            <LogOut className="size-4" />
            ออกจากระบบ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-ocid="profile.modal">
          <DialogHeader>
            <DialogTitle>แก้ไขโปรไฟล์</DialogTitle>
            <DialogDescription>
              ระบุชื่อที่แสดงและหน่วยงานของคุณสำหรับเอกสารเส้นทางส่งเลือด
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-name">ชื่อที่แสดง</Label>
              <Input
                id="profile-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="เช่น แอนนา วิน"
                data-ocid="profile.input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-org">หน่วยงาน</Label>
              <Input
                id="profile-org"
                value={organizationName}
                onChange={(event) => setOrganizationName(event.target.value)}
                placeholder="เช่น ศูนย์บริการโลหิตแห่งชาติ"
                data-ocid="profile.organization_input"
              />
            </div>
            {setProfile.isError && (
              <p
                className="text-sm text-destructive"
                data-ocid="profile.error_state"
              >
                บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditOpen(false)}
              data-ocid="profile.cancel_button"
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={setProfile.isPending || !displayName.trim()}
              data-ocid="profile.save_button"
            >
              {setProfile.isPending ? "กำลังบันทึก…" : "บันทึก"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-4 px-4 lg:px-6">
          <Link
            to="/"
            className="flex items-center gap-2.5"
            data-ocid="nav.link.home"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-crimson">
              <Droplet className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              BloodRoute
            </span>
          </Link>

          <div className="ml-2 hidden md:block">
            <AppNav />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground lg:inline-flex">
              <Building2 className="size-3.5" />
              ระบบวางแผนเส้นทางส่งเลือด
            </span>
            <ProfileMenu />
            <div className="md:hidden">
              <AppNav />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-background">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-muted-foreground sm:flex-row lg:px-6">
          <p>
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs">วางแผนเส้นทางส่งเลือดอย่างแม่นยำ</p>
        </div>
      </footer>
    </div>
  );
}

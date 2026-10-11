import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  ArrowRight,
  Droplet,
  Loader2,
  MapPinned,
  Route,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: MapPinned,
    title: "แผนที่โรงพยาบาล",
    description: "ดูตำแหน่งโรงพยาบาลและปริมาณเลือดคงคลังแยกตามกลุ่มเลือดบนแผนที่เดียว",
  },
  {
    icon: Route,
    title: "คำนวณเส้นทางส่งเลือด",
    description:
      "เลือกจุดเริ่มต้น โรงพยาบาลปลายทาง กลุ่มเลือด และจำนวนยูนิต แล้วประเมินระยะทางกับเวลาได้ทันที",
  },
  {
    icon: ShieldCheck,
    title: "ติดตามสถานะคำขอ",
    description: "บันทึกและติดตามสถานะการขนส่งเลือดตั้งแต่รอดำเนินการจนถึงส่งถึงแล้ว",
  },
];

export function LoginPage() {
  const { login, isLoggingIn, isLoginError, loginError } =
    useInternetIdentity();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2.5 px-4 lg:px-6">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-crimson">
            <Droplet className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            BloodRoute
          </span>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-12 lg:grid-cols-2 lg:gap-16 lg:px-6">
        <section className="flex flex-col">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Droplet className="size-3.5" />
            ระบบวางแผนเส้นทางส่งเลือด
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
            ส่งเลือดถึงผู้ป่วย
            <br />
            <span className="text-primary">อย่างแม่นยำและทันเวลา</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            BloodRoute ช่วยทีมคลังเลือดวางแผนเส้นทางขนส่งเลือดไปยังโรงพยาบาล
            ตรวจสอบปริมาณคงคลัง และติดตามสถานะคำขอได้ในที่เดียว
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              type="button"
              size="lg"
              onClick={() => login()}
              disabled={isLoggingIn}
              className="w-full rounded-full shadow-crimson sm:w-fit"
              data-ocid="login.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  กำลังเชื่อมต่อ…
                </>
              ) : (
                <>
                  เข้าสู่ระบบด้วย Internet Identity
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
            {isLoginError && (
              <p
                className="text-sm text-destructive"
                data-ocid="login.error_state"
              >
                {loginError?.message ?? "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง"}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              ใช้ Internet Identity ในการยืนยันตัวตนอย่างปลอดภัย
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4" aria-label="คุณสมบัติหลัก">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-elevated"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <feature.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-base font-semibold">
                  {feature.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-5 text-sm text-muted-foreground lg:px-6">
          <p>
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

// app/page.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      
      {/* ---------------- HEADER ---------------- */}
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">

          {/* 로고 */}
          <a href="/" className="flex items-center gap-2">
            <img
              src="/images/soopify-logo.png"
              alt="Soopify Logo"
              className="h-9 w-auto md:h-11"
            />
            <span className="sr-only">Soopify</span>
          </a>

          {/* 메뉴 */}
          <nav className="hidden md:flex items-center gap-6 text-[15px] font-semibold">
            <a href="#services" className="hover:text-primary">서비스</a>
            <a href="#workflow" className="hover:text-primary">프로세스</a>
            <a href="#contact" className="hover:text-primary">문의</a>
          </nav>

          {/* 우측 영역 */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contact"
              className="rounded-full border border-primary px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              상담 요청
            </a>
            <ModeToggle />
          </div>

        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section className="bg-gradient-to-b from-muted to-background">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-[13px] border-primary/30 text-primary bg-background"
              >
                생활권 수목 × IT 컨설팅
              </Badge>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-snug">
                생활권 수목 관리와<br />
                나무병원·조경 <span className="text-primary">업무 시스템</span>을<br />
                함께 만드는 Soopify
              </h1>

              <p className="text-muted-foreground leading-relaxed text-[17px] md:text-[18px]">
                수목조사·관리 업무를 돕는 <strong>웹 프로그램</strong>과<br />
                나무병원·조경 회사용 <strong>업무 시스템·홈페이지</strong>를 개발합니다.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button className="rounded-full px-6 py-2 text-[15px] font-semibold">
                  상담 · 개발 의뢰
                </Button>

                <Button
                  variant="outline"
                  className="rounded-full px-6 py-2 text-[15px]"
                  asChild
                >
                  <a href="#services">서비스 보기</a>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 text-[13px] text-muted-foreground">
                <span className="rounded-full bg-background px-3 py-1 border border-border">
                  학교 · 아파트 · 공원 · 공공시설
                </span>
                <span className="rounded-full bg-background px-3 py-1 border border-border">
                  수목조사·보고서 작성 지원
                </span>
                <span className="rounded-full bg-background px-3 py-1 border border-border">
                  나무병원·조경사 전산화
                </span>
              </div>
            </div>

            <div className="space-y-4">
              
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-lg font-semibold">Soopify 소개</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">
                  “생활권 수목 관리와 나무병원·조경 회사의 업무를<br />
                  IT로 정리하고 보기 좋게 만들어드립니다.”
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground shadow-md">
                <CardContent className="pt-4 space-y-1 text-sm">
                  <p className="font-semibold">현재 진행 중</p>
                  <p>· 수목조사·관리 웹 프로그램 개발</p>
                  <p>· 생활권 수목 컨설팅 (학교·아파트 등)</p>
                  <p>· 나무병원/조경 회사 홈페이지·업무 시스템 구축</p>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section id="services" className="max-w-5xl mx-auto px-4 py-14 md:py-16">
        <header className="text-center mb-10 space-y-2">
          <h2 className="text-2xl font-semibold">무엇을 도와드리나요?</h2>
          <p className="text-muted-foreground text-[15px]">
            수목 관리 업무와 나무병원·조경사의 전산화를 지원합니다.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* 1 */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                🌳 수목조사·관리 프로그램
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>현장조사, 사진, 위치 기록을 쉽게! 보고서도 자동화.</p>
              <ul className="space-y-1 text-[13px]">
                <li>• 조사 양식 디지털화</li>
                <li>• 수목·이력 관리</li>
                <li>• 보고서 초안 자동 생성</li>
              </ul>
              <Badge
                variant="outline"
                className="mt-auto w-max text-[11px] border-primary/40 text-primary"
              >
                Beta 개발 중
              </Badge>
            </CardContent>
          </Card>

          {/* 2 */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                🏙️ 생활권 수목 컨설팅
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>학교·아파트·공원 등 생활권 수목의 현황을 조사하고 정리합니다.</p>
              <ul className="space-y-1 text-[13px]">
                <li>• 수목 조사 및 목록화</li>
                <li>• 우선 관리 대상 도출</li>
                <li>• 안내판 및 수목지도 활용 제안</li>
              </ul>
              <Badge className="w-max text-[11px] mt-auto">
                서울권 중심
              </Badge>
            </CardContent>
          </Card>

          {/* 3 */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                💻 나무병원·조경 회사 시스템 개발
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>홈페이지, 상담·예약, 내부관리 시스템을 맞춤 제작.</p>
              <ul className="space-y-1 text-[13px]">
                <li>• 기업 소개형 홈페이지</li>
                <li>• 상담·접수·예약 기능</li>
                <li>• 내부 업무 시스템 개발</li>
              </ul>
              <Badge
                variant="outline"
                className="w-max text-[11px] mt-auto border-border"
              >
                프로젝트 단위 협의
              </Badge>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* ---------------- GREEN CARD ---------------- */}
      <section className="bg-background py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <Card className="bg-primary text-primary-foreground shadow-md">
            <CardContent className="p-8 md:p-10 lg:p-12 space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold">
                생활권 수목 관리에 초점을 맞추고 있습니다.
              </h2>

              <p className="leading-relaxed text-primary-foreground/90 text-[15px] md:text-base">
                학교, 아파트, 공원, 도로변 가로수 등 사람과 가까운 나무들이
                Soopify의 주요 대상입니다.
              </p>

              <div className="flex flex-wrap gap-2 pt-2 text-[13px]">
                <span className="px-4 py-1.5 rounded-full bg-background/10 border border-primary-foreground/30">
                  초·중·고등학교 캠퍼스
                </span>
                <span className="px-4 py-1.5 rounded-full bg-background/10 border border-primary-foreground/30">
                  아파트 단지·어린이공원
                </span>
                <span className="px-4 py-1.5 rounded-full bg-background/10 border border-primary-foreground/30">
                  공공기관·생활권 공원
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ---------------- WORKFLOW ---------------- */}
      <section id="workflow" className="max-w-5xl mx-auto px-4 py-14 md:py-16">
        <header className="text-center mb-8 space-y-2">
          <h2 className="text-2xl font-semibold">수목 조사 프로세스</h2>
          <p className="text-sm text-muted-foreground">
            복잡한 용어 대신 실제 흐름만 담았습니다.
          </p>
        </header>

        <div className="grid md:grid-cols-4 gap-4 text-[15px]">
          {[
            ["1단계", "사전 미팅", "대상지·범위·일정을 정합니다."],
            ["2단계", "현장 조사", "위치·사진·상태를 기록합니다."],
            ["3단계", "우선 정리", "관리 우선순위를 나눕니다."],
            ["4단계", "보고 자료", "지도·사진·목록을 정리합니다."],
          ].map(([step, title, desc]) => (
            <Card key={step}>
              <CardContent className="p-4 space-y-1 text-muted-foreground">
                <div className="text-[12px] font-semibold text-primary">{step}</div>
                <div className="font-semibold text-foreground">{title}</div>
                <p>{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" className="bg-background border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-16">
          <div className="grid md:grid-cols-2 gap-12">

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">상담 및 개발 의뢰</h2>
              <p className="text-[15px] text-muted-foreground">
                하고 싶은 업무가 있다면 자유롭게 남겨주세요.
              </p>
              <ul className="text-[15px] text-muted-foreground space-y-1.5">
                <li>• 대상지 또는 회사명</li>
                <li>• 필요한 업무 범위</li>
                <li>• 희망 일정 / 연락처</li>
              </ul>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4 text-[15px]">
                
                <div>
                  <label className="block text-[12px] font-semibold text-muted-foreground mb-1">
                    담당자 성함
                  </label>
                  <Input placeholder="이름" />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-muted-foreground mb-1">
                    이메일 또는 연락처
                  </label>
                  <Input placeholder="example@company.kr / 010-0000-0000" />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-muted-foreground mb-1">
                    기관 / 회사 / 학교명
                  </label>
                  <Input placeholder="○○나무병원 / ○○조경 / ○○초등학교 등" />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-muted-foreground mb-1">
                    문의 내용
                  </label>
                  <Textarea rows={4} placeholder="문의 내용을 적어주세요." />
                </div>

                <Button className="w-full rounded-full py-2.5">문의 보내기</Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-foreground text-background text-[13px]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p>
            © {new Date().getFullYear()} Soopify. All rights reserved.
          </p>
          <p className="opacity-80">
            IT로 생활권을 숲으로 만드는 수목 관리 & 시스템 개발
          </p>
        </div>
      </footer>

    </main>
  )
}

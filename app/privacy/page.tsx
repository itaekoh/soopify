// app/privacy/page.tsx
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "개인정보처리방침 | Soopify",
  description: "Soopify 개인정보처리방침",
}

const EFFECTIVE_DATE = "2026년 9월 6일"

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-16">
          <h1 className="text-3xl font-semibold tracking-tight">개인정보처리방침</h1>
          <p className="mt-3 text-sm text-muted-foreground">시행일자: {EFFECTIVE_DATE}</p>

          <div className="mt-10 space-y-10 text-base leading-relaxed text-slate-700 dark:text-slate-200">
            <section>
              <p>
                Soopify(이하 &ldquo;회사&rdquo;)는 이용자의 개인정보를 중요하게 생각하며,
                「개인정보 보호법」 등 관련 법령을 준수합니다. 회사는 본 방침을 통해
                이용자가 제공하는 개인정보가 어떤 목적과 방식으로 이용되고 있으며,
                개인정보 보호를 위해 어떤 조치가 취해지고 있는지 알려드립니다.
              </p>
            </section>

            <Section title="1. 수집하는 개인정보 항목 및 수집 방법">
              <p>회사는 홈페이지의 &ldquo;문의하기&rdquo; 양식을 통해 아래 정보를 이용자가 직접 입력하는 방식으로 수집합니다.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>필수: 담당자 성함, 이메일 또는 연락처, 문의 내용</li>
                <li>선택: 기관 / 회사 / 학교명</li>
              </ul>
              <p className="mt-3">
                또한 서비스 이용 과정에서 아래 정보가 자동으로 생성되어 수집될 수 있습니다.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Google Analytics를 통한 방문 기록(접속 로그, 쿠키, 접속 IP, 브라우저 및 기기 정보 등)</li>
              </ul>
            </Section>

            <Section title="2. 개인정보의 수집 및 이용 목적">
              <ul className="list-disc space-y-1 pl-5">
                <li>서비스 문의, 상담 요청 및 협업 제안에 대한 확인 및 회신</li>
                <li>공지사항 등 게시판 서비스 운영</li>
                <li>웹사이트 이용 통계 분석을 통한 서비스 개선</li>
              </ul>
            </Section>

            <Section title="3. 개인정보의 보유 및 이용기간">
              <p>
                회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를
                지체 없이 파기합니다. 다만 문의 내용은 응대 이력 확인을 위해 문의 처리
                완료일로부터 3년간 보관 후 파기하며, 관련 법령에 따라 보존할 필요가 있는
                경우 해당 법령에서 정한 기간 동안 보관합니다.
              </p>
            </Section>

            <Section title="4. 개인정보의 제3자 제공">
              <p>
                회사는 이용자의 개인정보를 본 방침에서 고지한 범위를 초과하여 이용하거나
                제3자에게 제공하지 않습니다. 다만 이용자가 사전에 동의하거나, 법령의
                규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의
                요구가 있는 경우는 예외로 합니다.
              </p>
            </Section>

            <Section title="5. 개인정보 처리의 위탁">
              <p>회사는 서비스 운영을 위해 아래와 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Supabase Inc. — 데이터베이스 호스팅 및 저장</li>
                <li>Resend — 문의 접수 알림 메일 발송</li>
              </ul>
              <p className="mt-3">
                회사는 위탁계약 체결 시 관련 법령에 따라 개인정보가 안전하게 관리될 수
                있도록 필요한 사항을 규정하고 있습니다.
              </p>
            </Section>

            <Section title="6. 정보주체의 권리와 행사방법">
              <p>
                이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지를
                요구할 수 있습니다. 권리 행사는 아래 &ldquo;9. 개인정보 보호책임자&rdquo;에
                기재된 연락처로 서면, 이메일 등을 통해 하실 수 있으며, 회사는 이에 대해
                지체 없이 조치합니다.
              </p>
            </Section>

            <Section title="7. 개인정보의 파기절차 및 방법">
              <p>
                전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을
                사용하여 삭제하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나
                소각하여 파기합니다.
              </p>
            </Section>

            <Section title="8. 쿠키(Cookie)의 운영 및 거부">
              <p>
                회사는 이용자에게 최적화된 서비스를 제공하기 위해 Google Analytics를
                이용하며, 이 과정에서 쿠키가 사용될 수 있습니다. 이용자는 웹 브라우저의
                설정을 통해 쿠키 저장을 거부할 수 있으며, 이 경우 서비스 이용에 일부
                제한이 있을 수 있습니다.
              </p>
            </Section>

            <Section title="9. 개인정보 보호책임자">
              <p>
                회사는 개인정보 처리에 관한 업무를 총괄하고 이용자의 불만처리 및 피해구제를
                위해 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>개인정보 보호책임자: 대표이사</li>
                <li>이메일: treedoctor@kakao.com</li>
                <li>주소: 서울특별시 성북구 동소문로63 드림트리빌딩 6F</li>
              </ul>
            </Section>

            <Section title="10. 고지의 의무">
              <p>
                본 방침은 법령, 정책 또는 서비스 내용의 변경에 따라 개정될 수 있으며,
                내용의 추가·삭제 및 수정이 있는 경우 개정 최소 7일 전부터 홈페이지를 통해
                공지합니다.
              </p>
            </Section>
          </div>
        </div>
      </main>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

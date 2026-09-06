// app/terms/page.tsx
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "이용약관 | Soopify",
  description: "Soopify 이용약관",
}

const EFFECTIVE_DATE = "2026년 9월 6일"

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-16">
          <h1 className="text-3xl font-semibold tracking-tight">이용약관</h1>
          <p className="mt-3 text-sm text-muted-foreground">시행일자: {EFFECTIVE_DATE}</p>

          <div className="mt-10 space-y-10 text-base leading-relaxed text-slate-700 dark:text-slate-200">
            <Section title="제1조 (목적)">
              <p>
                본 약관은 Soopify(이하 &ldquo;회사&rdquo;)가 제공하는 웹사이트 및 관련
                서비스(이하 &ldquo;서비스&rdquo;)의 이용과 관련하여 회사와 이용자의 권리,
                의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </Section>

            <Section title="제2조 (정의)">
              <ul className="list-disc space-y-1 pl-5">
                <li>&ldquo;서비스&rdquo;란 회사가 제공하는 홈페이지 및 그에 부수한 문의·상담, 공지사항 등 일체의 서비스를 의미합니다.</li>
                <li>&ldquo;이용자&rdquo;란 서비스에 접속하여 본 약관에 따라 서비스를 이용하는 자를 의미합니다.</li>
              </ul>
            </Section>

            <Section title="제3조 (약관의 효력 및 변경)">
              <p>
                본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써
                효력이 발생합니다. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을
                개정할 수 있으며, 개정 시 적용일자 및 개정사유를 명시하여 최소 7일 전부터
                공지합니다.
              </p>
            </Section>

            <Section title="제4조 (서비스의 제공 및 변경)">
              <p>회사는 다음과 같은 서비스를 제공합니다.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>수목 보고서 작성 지원 도구(Soopify) 안내 및 문의 접수</li>
                <li>나무병원 홈페이지 제작 서비스 안내 및 문의 접수</li>
                <li>공지사항 등 정보 제공 게시판</li>
              </ul>
              <p className="mt-3">
                회사는 서비스의 내용, 운영상·기술상 필요에 따라 제공하는 서비스의 전부
                또는 일부를 변경할 수 있으며, 이 경우 변경 사유와 내용을 사전에
                공지합니다.
              </p>
            </Section>

            <Section title="제5조 (수목관련 서비스에 관한 특칙)">
              <p>
                「산림보호법」에 따른 수목의 진단, 치료 등 나무의사가 수행하여야 하는
                수목관련 서비스는 나무병원에 소속된 나무의사가 별도로 수행하며, 본
                웹사이트를 통해 제공되는 정보 및 도구는 해당 업무를 보조하는 목적으로
                제공됩니다. 회사가 제공하는 서비스가 수목 진단·치료 행위 자체를
                대체하지 않습니다.
              </p>
            </Section>

            <Section title="제6조 (문의 및 상담)">
              <p>
                이용자가 서비스 내 문의 양식을 통해 제출한 정보는 상담 및 응대 목적으로만
                사용되며, 처리 절차는 회사의 개인정보처리방침을 따릅니다.
              </p>
            </Section>

            <Section title="제7조 (이용자의 의무)">
              <p>이용자는 서비스 이용과 관련하여 다음 각 호의 행위를 하여서는 안 됩니다.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
                <li>회사가 게시한 정보를 무단으로 변경하거나 서비스 운영을 방해하는 행위</li>
                <li>회사 또는 제3자의 지식재산권을 침해하는 행위</li>
                <li>관련 법령에 위배되는 행위</li>
              </ul>
            </Section>

            <Section title="제8조 (지식재산권)">
              <p>
                서비스와 관련하여 회사가 작성한 콘텐츠(텍스트, 이미지, 상표, 로고 등)에
                대한 저작권 및 지식재산권은 회사에 귀속됩니다. 이용자는 회사의 사전 서면
                동의 없이 이를 복제, 전송, 배포, 2차적 저작물 작성 등의 방법으로 이용할
                수 없습니다.
              </p>
            </Section>

            <Section title="제9조 (면책조항)">
              <p>
                회사는 천재지변, 불가항력적 사유 또는 이용자의 귀책사유로 인한 서비스
                장애에 대해서는 책임을 지지 않습니다. 회사가 제공하는 정보의 정확성,
                완전성에 대해서는 관련 법령이 허용하는 범위 내에서 보증하지 않으며, 이를
                신뢰하여 발생한 손해에 대해 회사는 책임을 지지 않습니다.
              </p>
            </Section>

            <Section title="제10조 (분쟁해결 및 관할법원)">
              <p>
                본 약관과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는 대한민국
                법령을 적용하며, 분쟁으로 인한 소송이 제기될 경우 민사소송법상의 관할
                법원에 제기합니다.
              </p>
            </Section>

            <Section title="부칙">
              <p>본 약관은 {EFFECTIVE_DATE}부터 시행합니다.</p>
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

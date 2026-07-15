import LegalPageLayout from "@/components/LegalPageLayout";

const SECTIONS = [
  { titleKey: "cookies.s1.title", bodyKey: "cookies.s1.body" },
  { titleKey: "cookies.s2.title", bodyKey: "cookies.s2.body" },
  { titleKey: "cookies.s3.title", bodyKey: "cookies.s3.body" },
  { titleKey: "cookies.s4.title", bodyKey: "cookies.s4.body" },
  { titleKey: "cookies.s5.title", bodyKey: "cookies.s5.body" },
  { titleKey: "cookies.s6.title", bodyKey: "cookies.s6.body" },
];

export default function Cookies() {
  return (
    <LegalPageLayout
      badgeKey="cookies.badge"
      titleKey="cookies.title"
      lastUpdatedKey="cookies.lastUpdated"
      sections={SECTIONS}
    />
  );
}

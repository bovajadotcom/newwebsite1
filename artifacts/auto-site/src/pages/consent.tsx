import LegalPageLayout from "@/components/LegalPageLayout";

const SECTIONS = [
  { titleKey: "consent.s1.title", bodyKey: "consent.s1.body" },
];

export default function Consent() {
  return (
    <LegalPageLayout
      badgeKey="consent.badge"
      titleKey="consent.title"
      lastUpdatedKey="consent.lastUpdated"
      introKey="consent.intro"
      sections={SECTIONS}
    />
  );
}

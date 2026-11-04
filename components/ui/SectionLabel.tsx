export default function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label">
      <span className="section-index">{index}</span>
      <span>{children}</span>
    </div>
  );
}

import Link from "next/link";

export type RuleCardProps = {
  id: string;
  name: string;
  description: string;
};
const RuleCard: React.FC<RuleCardProps> = (rule) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{rule.name}</h2>
        <p>{rule.description}</p>
        <div className="card-actions justify-end">
          <Link href={`/config/${rule.id}`} className="btn-primary btn">
            設定する
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RuleCard;

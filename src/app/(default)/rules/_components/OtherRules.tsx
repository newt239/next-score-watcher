import { Title } from "@mantine/core";
import Link from "next/link";

const OtherRules: React.FC = () => {
  return (
    <div>
      <Title order={2}>その他の形式</Title>
      <ul>
        <li>
          <Link href="/aql">AQLルール</Link>
        </li>
      </ul>
    </div>
  );
};

export default OtherRules;

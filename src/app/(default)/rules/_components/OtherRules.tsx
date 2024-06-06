import Link from "next/link";

import { Title } from "@mantine/core";

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

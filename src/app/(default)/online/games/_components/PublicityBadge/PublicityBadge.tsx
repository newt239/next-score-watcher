import { Badge } from "@mantine/core";
import { IconGlobe, IconLock } from "@tabler/icons-react";

type PublicityBadgeProps = {
  isPublic: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};

/**
 * ゲーム公開状態表示バッジコンポーネント
 */
const PublicityBadge: React.FC<PublicityBadgeProps> = ({
  isPublic,
  size = "sm",
}) => {
  if (isPublic) {
    return (
      <Badge
        color="green"
        variant="light"
        size={size}
        leftSection={<IconGlobe size={12} />}
      >
        公開中
      </Badge>
    );
  }

  return (
    <Badge
      color="gray"
      variant="light"
      size={size}
      leftSection={<IconLock size={12} />}
    >
      非公開
    </Badge>
  );
};

export default PublicityBadge;

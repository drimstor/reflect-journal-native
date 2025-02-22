import { FC } from "react";
import { Layout } from "@/src/shared/ui";
import { Header } from "@/src/widgets";
import { useT } from "@/src/shared/lib/hooks";

interface ProfileScreenProps {}

const ProfileScreen: FC<ProfileScreenProps> = () => {
  const t = useT();
  return (
    <Layout>
      <Header title={t("profile.title")} subtitle="Wed, Oct 21 - Sun, Nov 1" />
    </Layout>
  );
};

export default ProfileScreen;

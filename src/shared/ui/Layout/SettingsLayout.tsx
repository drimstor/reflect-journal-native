import { FC, ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { Layout, PaddingLayout } from "..";
import { Header } from "../../../widgets";
import { useT } from "../../lib/hooks";
import { settingsLayoutStyles as styles } from "./Layout.styles";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const SettingsLayout: FC<LayoutProps> = ({ children, title, subtitle }) => {
  const t = useT();
  return (
    <Layout>
      <Header
        backButton
        title={title}
        subtitle={subtitle || t("settings.title")}
      />
      <ScrollView>
        <PaddingLayout style={styles.contentContainer}>
          <View style={styles.formContainer}>{children}</View>
        </PaddingLayout>
      </ScrollView>
    </Layout>
  );
};

export default SettingsLayout;

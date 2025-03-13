import { View } from "react-native";
import { styles } from "./FiltersSearch.styles";
import { IconButtonSearchField } from "@/src/shared/ui";
import { useFiltersStore } from "@/src/shared/store";

const FiltersSearch = () => {
  const { setSearch, search } = useFiltersStore();

  return (
    <View style={styles.globalBox}>
      <IconButtonSearchField value={search} onChangeText={setSearch} />
    </View>
  );
};

export default FiltersSearch;

import { useFiltersStore } from "@/src/shared/store";
import { IconButtonSearchField } from "@/src/shared/ui";
import { View } from "react-native";
import { styles } from "./FiltersSearch.styles";

const FiltersSearch = () => {
  const { setSearch, search } = useFiltersStore();

  return (
    <View style={styles.globalBox}>
      <IconButtonSearchField value={search} onChangeText={setSearch} />
    </View>
  );
};

export default FiltersSearch;

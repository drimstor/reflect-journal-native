import {
  Button,
  BottomSheetHeader,
  BottomSheetFooter,
  PaddingLayout,
  BottomSheetBox,
  List,
  ArrowRightLongIcon,
  CalendarIcon,
  CheckIcon,
} from "@/src/shared/ui";
import {
  useBottomSheetStore,
  useFiltersStore,
  useThemeStore,
} from "@/src/shared/store";
import { useT } from "@/src/shared/lib/hooks";
import { View } from "react-native";

const DatePickerListView = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const {
    created_at_from,
    updated_at_from,
    setCreatedAtRange,
    setUpdatedAtRange,
  } = useFiltersStore();

  const { navigateToFlow, setFlowData, setBottomSheetVisible } =
    useBottomSheetStore();

  const isFiltered = created_at_from || updated_at_from;

  const actions = [
    {
      text: t("sort.sortByCreated"),
      key: "created_at_from",
      IconComponent: CalendarIcon,
      onPress: () => {
        setFlowData({
          sort_field: "created_at",
        });
      },
    },
    {
      text: t("sort.sortByUpdated"),
      key: "updated_at_from",
      IconComponent: CalendarIcon,
      onPress: () => {
        setFlowData({
          sort_field: "updated_at",
        });
      },
    },
  ];

  const handleReset = () => {
    setCreatedAtRange(undefined, undefined);
    setUpdatedAtRange(undefined, undefined);
    setBottomSheetVisible(false);
  };

  return (
    <BottomSheetBox>
      <BottomSheetHeader title={t("filter.filterBy")} />
      <PaddingLayout>
        <List
          listItemVariant="reverse"
          style={{ marginVertical: -10 }}
          items={actions.map(({ text, IconComponent, onPress, key }) => ({
            text,
            onPress: () => {
              navigateToFlow("date", "pickerPeriod");
              onPress();
            },
            IconComponent: (props) => (
              <IconComponent {...props} color={props.color} size={props.size} />
            ),
            element: ((key === "created_at_from" && created_at_from) ||
              (key === "updated_at_from" && updated_at_from)) && (
              <CheckIcon color={colors.contrast} size={22} />
            ),
          }))}
        />
      </PaddingLayout>
      <BottomSheetFooter>
        <Button
          backgroundColor={colors.alternate}
          onPress={handleReset}
          disabled={!isFiltered}
        >
          {t("shared.actions.reset")}
        </Button>
      </BottomSheetFooter>
    </BottomSheetBox>
  );
};

export default DatePickerListView;

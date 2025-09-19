import { useKeyboard, useT } from "@/src/shared/lib/hooks";
import { useBottomSheetStore, useFiltersStore } from "@/src/shared/store";
import React, { useEffect } from "react";
import CreateSummaryView from "./CreateSummaryView";

const CreateSummaryViewWithDatePicker = () => {
  const t = useT();
  const { navigateToFlow, setFlowData, flowData, isBottomSheetVisible } =
    useBottomSheetStore();

  const { setMultiSelectIds } = useFiltersStore();

  const { startDate, endDate } = flowData.datePickerProps || {};

  const { keyboardHeight, isKeyboardVisible } = useKeyboard();

  console.log({ keyboardHeight, isKeyboardVisible });

  const handleDateRangeChange = (dates: {
    startDate: string | null;
    endDate: string | null;
  }) => {
    navigateToFlow("summary", "create");
    setFlowData({
      datePickerProps: {
        startDate: dates.startDate,
        endDate: dates.endDate,
      },
    });
  };

  const handleDateReset = () => {
    setFlowData({
      datePickerProps: {},
    });
  };

  useEffect(() => {
    if (!isBottomSheetVisible) {
      handleDateReset();
    }
  }, [isBottomSheetVisible]);

  useEffect(() => {
    if (flowData.entitiesValues) {
      setMultiSelectIds(flowData.entitiesValues);
    }
  }, [flowData.entitiesValues, flowData.variant]);

  return (
    <CreateSummaryView
      entityType={flowData.variant}
      entityId={flowData.id}
      dateValue={[startDate, endDate]}
      onDateReset={handleDateReset}
      onDateClick={() => {
        navigateToFlow("date", "pickerPeriod");

        setFlowData({
          datePickerProps: {
            title: t("date.period.title"),
            onBack: () => {
              navigateToFlow("summary", "create");
            },
            onDateSelected: handleDateRangeChange,
            startDate,
            endDate,
          },
        });
      }}
    />
  );
};

export default CreateSummaryViewWithDatePicker;

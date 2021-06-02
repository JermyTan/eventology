import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { startOfToday } from "date-fns";
import { DATE_PERIOD_SEPARATOR } from "../../constants";
import { getDatePeriods } from "../../utils/date-time-utils";

type SearchState = {
  isSidebarOpened: boolean;
  selectedDatePeriod: string;
  selectedCategory: string;
  datePeriods: {
    today: string;
    tomorrow: string;
    thisWeek: string;
    thisMonth: string;
  };
  categories: string[];
  isLoadingCategories: boolean;
};

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    isSidebarOpened: false,
    selectedDatePeriod: DATE_PERIOD_SEPARATOR,
    selectedCategory: "",
    datePeriods: getDatePeriods({ currentDateTime: startOfToday().getTime() }),
    categories: [],
    isLoadingCategories: false,
  } as SearchState,
  reducers: {
    setSidebarOpened: (
      state,
      { payload }: PayloadAction<SearchState["isSidebarOpened"]>,
    ) => {
      state.isSidebarOpened = payload;
    },
    setLoadingCategories: (
      state,
      { payload }: PayloadAction<SearchState["isSidebarOpened"]>,
    ) => {
      state.isLoadingCategories = payload;
    },
    setSelectedDatePeriod: (
      state,
      { payload }: PayloadAction<SearchState["selectedDatePeriod"]>,
    ) => {
      state.selectedDatePeriod = payload;
    },
    setSelectedCategory: (
      state,
      { payload }: PayloadAction<SearchState["selectedCategory"]>,
    ) => {
      state.selectedCategory = payload;
    },
    loadCategories: (
      state,
      {
        payload,
      }: PayloadAction<{
        categories: SearchState["categories"];
        searchQuery: {
          category?: string | null;
          startDateTime?: string | null;
          endDateTime?: string | null;
        };
      }>,
    ) => {
      state.categories = payload.categories;

      const { category } = payload.searchQuery;
      const defaultCategory = !category ? "" : category;

      state.selectedCategory = ["", ...payload.categories].includes(
        defaultCategory,
      )
        ? defaultCategory
        : "";
    },
    loadDates: (
      state,
      {
        payload,
      }: PayloadAction<{
        searchQuery: {
          category?: string | null;
          startDateTime?: string | null;
          endDateTime?: string | null;
        };
      }>,
    ) => {
      const { startDateTime, endDateTime } = payload.searchQuery;

      state.selectedDatePeriod = `${
        startDateTime ?? ""
      }${DATE_PERIOD_SEPARATOR}${endDateTime ?? ""}`;
    },
  },
});

export const {
  setSidebarOpened,
  setLoadingCategories,
  setSelectedDatePeriod,
  setSelectedCategory,
  loadDates,
  loadCategories,
} = searchSlice.actions;

export default searchSlice.reducer;

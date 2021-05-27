import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { startOfToday } from "date-fns";
import { getDatePeriods } from "../../utils/date-time-utils";

type SearchState = {
  isSidebarOpened: boolean;
  selectedDate?: string;
  selectedCategory?: string;
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
    setSelectedDate: (
      state,
      { payload }: PayloadAction<SearchState["selectedDate"]>,
    ) => {
      state.selectedDate =
        state.selectedDate === undefined || state.selectedDate !== payload
          ? payload
          : undefined;
    },
    setSelectedCategory: (
      state,
      { payload }: PayloadAction<SearchState["selectedCategory"]>,
    ) => {
      state.selectedCategory =
        state.selectedCategory === undefined ||
        state.selectedCategory !== payload
          ? payload
          : undefined;
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
        : undefined;
    },
    loadDates: (
      state,
      {
        payload,
      }: PayloadAction<{
        datePeriods: SearchState["datePeriods"];
        searchQuery: {
          category?: string | null;
          startDateTime?: string | null;
          endDateTime?: string | null;
        };
      }>,
    ) => {
      const { startDateTime, endDateTime } = payload.searchQuery;

      const defaultDatePeriod =
        !startDateTime && !endDateTime ? "" : `${startDateTime}-${endDateTime}`;

      state.selectedDate = ["", ...Object.values(payload.datePeriods)].includes(
        defaultDatePeriod,
      )
        ? defaultDatePeriod
        : undefined;
    },
  },
});

export const {
  setSidebarOpened,
  setLoadingCategories,
  setSelectedDate,
  setSelectedCategory,
  loadDates,
  loadCategories,
} = searchSlice.actions;

export default searchSlice.reducer;

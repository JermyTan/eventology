import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { startOfToday } from "date-fns";
import { useQueryParams, StringParam } from "use-query-params";
import { useGetCategories } from "../custom-hooks/api/events-api";
import { CATEGORY, END_DATE_TIME, START_DATE_TIME } from "../constants";
import useDatePeriods from "../custom-hooks/use-date-periods";

type SearchContextType = {
  isSidebarOpened: boolean;
  setSidebarOpened: (newValue: boolean) => void;
  selectedDate?: string;
  setSelectedDate: Dispatch<SetStateAction<string | undefined>>;
  selectedCategory?: string;
  setSelectedCategory: Dispatch<SetStateAction<string | undefined>>;
  onSearch: () => void;
  searchQuery: {
    [CATEGORY]?: string | null;
    [START_DATE_TIME]?: string | null;
    [END_DATE_TIME]?: string | null;
  };
  datePeriods: {
    today?: string;
    tomorrow?: string;
    thisWeek?: string;
    thisMonth?: string;
  };
  categories: string[];
  isLoadingCategories: boolean;
};

export const SearchContext = createContext<SearchContextType>({
  isSidebarOpened: false,
  setSidebarOpened: () => {
    throw new Error("setSidebarOpened is not defined.");
  },
  setSelectedDate: () => {
    throw new Error("setSelectedDate is not defined.");
  },
  setSelectedCategory: () => {
    throw new Error("setSelectedCategory is not defined.");
  },
  onSearch: () => {
    throw new Error("onSearch is not defined.");
  },
  searchQuery: {},
  datePeriods: {},
  categories: [],
  isLoadingCategories: false,
});

type Props = {
  children: ReactNode;
};

function SearchProvider({ children }: Props) {
  const [isSidebarOpened, _setSidebarOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [searchQuery, setSearchQuery] = useQueryParams({
    [CATEGORY]: StringParam,
    [START_DATE_TIME]: StringParam,
    [END_DATE_TIME]: StringParam,
  });
  const datePeriods = useDatePeriods(startOfToday().getTime());
  const {
    categories,
    isLoading: isLoadingCategories,
    getCategories,
  } = useGetCategories();

  const { category, startDateTime, endDateTime } = searchQuery;
  const { today, tomorrow, thisWeek, thisMonth } = datePeriods;

  const allCategories = useMemo(() => ["", ...categories], [categories]);
  const allDatePeriods = useMemo(
    () => ["", today, tomorrow, thisWeek, thisMonth],
    [today, tomorrow, thisWeek, thisMonth],
  );

  useEffect(() => {
    if (isSidebarOpened) {
      const defaultDatePeriod =
        !startDateTime && !endDateTime ? "" : `${startDateTime}-${endDateTime}`;
      const defaultCategory = !category ? "" : category;

      setSelectedDate(
        allDatePeriods.includes(defaultDatePeriod)
          ? defaultDatePeriod
          : undefined,
      );
      setSelectedCategory(
        allCategories.includes(defaultCategory) ? defaultCategory : undefined,
      );
    }
  }, [
    isSidebarOpened,
    category,
    startDateTime,
    endDateTime,
    allCategories,
    allDatePeriods,
  ]);

  const setSidebarOpened = useCallback(
    (newValue: boolean) => {
      if (newValue) {
        getCategories();
      }

      _setSidebarOpened(newValue);
    },
    [getCategories],
  );

  const onSearch = useCallback(() => {
    if (selectedDate === undefined || selectedCategory === undefined) {
      return;
    }

    const [startDateTime, endDateTime] = selectedDate.split("-");

    setSearchQuery({
      category: !selectedCategory ? undefined : selectedCategory,
      startDateTime: !startDateTime ? undefined : startDateTime,
      endDateTime: !endDateTime ? undefined : endDateTime,
    });
    _setSidebarOpened(false);
  }, [selectedDate, selectedCategory, setSearchQuery]);

  return (
    <SearchContext.Provider
      value={{
        isSidebarOpened,
        setSidebarOpened,
        selectedDate,
        setSelectedDate,
        selectedCategory,
        setSelectedCategory,
        onSearch,
        searchQuery,
        datePeriods,
        categories,
        isLoadingCategories,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
export default SearchProvider;

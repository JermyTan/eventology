import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { startOfToday } from "date-fns";
import { useGetEventCategories } from "../custom-hooks/api/events-api";
import useDatePeriods from "../custom-hooks/use-date-periods";
import useSearchQueryParams from "../custom-hooks/use-search-query-params";

type SearchContextType = {
  isSidebarOpened: boolean;
  setSidebarOpened: (newValue: boolean) => void;
  selectedDate?: string;
  setSelectedDate: Dispatch<SetStateAction<string | undefined>>;
  selectedCategory?: string;
  setSelectedCategory: Dispatch<SetStateAction<string | undefined>>;
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
  const {
    searchQuery: { category, startDateTime, endDateTime },
  } = useSearchQueryParams();
  const datePeriods = useDatePeriods(startOfToday().getTime());
  const {
    categories,
    isLoading: isLoadingCategories,
    getEventCategories,
  } = useGetEventCategories();

  const { today, tomorrow, thisWeek, thisMonth } = datePeriods;

  const setSidebarOpened = useCallback(
    (newValue: boolean) => {
      _setSidebarOpened(newValue);

      if (newValue) {
        const defaultDatePeriod =
          !startDateTime && !endDateTime
            ? ""
            : `${startDateTime}-${endDateTime}`;

        setSelectedDate(
          ["", today, tomorrow, thisWeek, thisMonth].includes(defaultDatePeriod)
            ? defaultDatePeriod
            : undefined,
        );

        (async () => {
          const categories = await getEventCategories();
          const defaultCategory = !category ? "" : category;

          setSelectedCategory(
            ["", ...categories].includes(defaultCategory)
              ? defaultCategory
              : undefined,
          );
        })();
      }
    },
    [
      getEventCategories,
      category,
      startDateTime,
      endDateTime,
      today,
      tomorrow,
      thisWeek,
      thisMonth,
    ],
  );

  return (
    <SearchContext.Provider
      value={{
        isSidebarOpened,
        setSidebarOpened,
        selectedDate,
        setSelectedDate,
        selectedCategory,
        setSelectedCategory,
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

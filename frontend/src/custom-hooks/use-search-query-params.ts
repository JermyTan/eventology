import { StringParam, useQueryParams } from "use-query-params";
import { CATEGORY, START_DATE_TIME, END_DATE_TIME } from "../constants";

function useSearchQueryParams() {
  const [searchQuery, setSearchQuery] = useQueryParams({
    [CATEGORY]: StringParam,
    [START_DATE_TIME]: StringParam,
    [END_DATE_TIME]: StringParam,
  });

  return { searchQuery, setSearchQuery };
}

export default useSearchQueryParams;

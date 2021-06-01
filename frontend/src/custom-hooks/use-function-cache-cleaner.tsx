import { useRef, useEffect } from "react";
import memoize from "lodash.memoize";
import usePrevious from "./use-previous";

function useFunctionCacheCleaner(
  memoizedFunction: ReturnType<typeof memoize>,
  maxCacheSize: number,
  numEntries: number,
) {
  const previousNumEntries = usePrevious(numEntries);
  const cacheSize = useRef(0);

  useEffect(() => {
    // regular clean up to clear cache
    cacheSize.current += Math.abs(numEntries - previousNumEntries);

    if (cacheSize.current > maxCacheSize) {
      memoizedFunction.cache.clear?.();
      cacheSize.current = 0;
    }
  }, [memoizedFunction, previousNumEntries, maxCacheSize, numEntries]);
}

export default useFunctionCacheCleaner;

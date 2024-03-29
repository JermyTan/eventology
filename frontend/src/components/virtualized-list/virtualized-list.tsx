import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  Ref,
  ReactNode,
} from "react";
import {
  AutoSizer,
  List,
  ListRowRenderer,
  CellMeasurerCache,
  WindowScroller,
  InfiniteLoader,
  IndexRange,
  Index,
  CellMeasurer,
} from "react-virtualized";
import { Divider } from "semantic-ui-react";
import PlaceholderWrapper from "../placeholder-wrapper";

type Props = {
  itemRenderer: (index: number) => ReactNode;
  loaderRenderer?: (index: number) => ReactNode;
  noRowsRenderer?: () => JSX.Element;
  dividerRenderer?: (index: number, isLastRow: boolean) => JSX.Element;
  hasNextPage?: boolean;
  isNextPageLoading?: boolean;
  numItems: number;
  loadNextPage?: (params: IndexRange) => Promise<unknown>;
  scrollElement?: HTMLElement;
  defaultRowHeight?: number;
  cachePreviousRowHeight?: boolean;
};

type VirtualizedListHandle = {
  rerenderList: (index?: number) => void;
};

const defaultLoadNextPage = () => new Promise<unknown>(() => {});
const defaultLoaderRenderer = () => <PlaceholderWrapper isLoading />;
const defaultDividerRenderer = (_: number, isLastRow: boolean) => (
  <Divider hidden={isLastRow} />
);

function VirtualizedList(
  {
    itemRenderer,
    loaderRenderer = defaultLoaderRenderer,
    noRowsRenderer,
    dividerRenderer = defaultDividerRenderer,
    hasNextPage = false,
    isNextPageLoading = false,
    numItems,
    loadNextPage = defaultLoadNextPage,
    scrollElement,
    defaultRowHeight = 200,
    cachePreviousRowHeight = false,
  }: Props,
  ref: Ref<VirtualizedListHandle>,
) {
  const listRef = useRef<List>(null) as MutableRefObject<List | null>;
  const previousRowCountRef = useRef(0);
  const cellMeasurerCacheRef = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: defaultRowHeight,
    }),
  );

  const rerenderList = useCallback((index?: number) => {
    if (index === undefined) {
      cellMeasurerCacheRef.current.clearAll();
    } else {
      cellMeasurerCacheRef.current.clear(index, 0);
    }

    listRef.current?.recomputeRowHeights(index);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      rerenderList,
    }),
    [rerenderList],
  );

  const rowCount = hasNextPage ? numItems + 1 : numItems;

  const loadMoreRows = isNextPageLoading ? defaultLoadNextPage : loadNextPage;

  const isRowLoaded = useCallback(
    (params: Index) => !hasNextPage || params.index < numItems,
    [hasNextPage, numItems],
  );

  const rowRenderer: ListRowRenderer = useCallback(
    ({ index, parent, key, style }) => (
      <CellMeasurer
        key={key}
        cache={cellMeasurerCacheRef.current}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {({ registerChild }) => (
          <div
            ref={registerChild as (element: HTMLDivElement) => void}
            style={style}
          >
            {isRowLoaded({ index })
              ? itemRenderer(index)
              : loaderRenderer(index)}

            {dividerRenderer(index, index === rowCount - 1)}
          </div>
        )}
      </CellMeasurer>
    ),
    [rowCount, isRowLoaded, itemRenderer, loaderRenderer, dividerRenderer],
  );

  useEffect(() => {
    if (
      previousRowCountRef.current !== 0 &&
      numItems >= previousRowCountRef.current &&
      cachePreviousRowHeight
    ) {
      rerenderList(previousRowCountRef.current - 1);
    } else {
      rerenderList();
    }

    previousRowCountRef.current = rowCount;
  }, [rowCount, numItems, cachePreviousRowHeight, rerenderList]);

  return (
    <InfiniteLoader
      rowCount={rowCount}
      isRowLoaded={isRowLoaded}
      threshold={5}
      loadMoreRows={loadMoreRows}
    >
      {({ onRowsRendered, registerChild }) => (
        <WindowScroller scrollElement={scrollElement}>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <AutoSizer onResize={() => rerenderList()} disableHeight>
              {({ width }) => (
                <List
                  autoHeight
                  ref={(element) => {
                    registerChild(element);
                    listRef.current = element;
                  }}
                  height={height}
                  width={width}
                  rowHeight={cellMeasurerCacheRef.current.rowHeight}
                  deferredMeasurementCache={cellMeasurerCacheRef.current}
                  rowRenderer={rowRenderer}
                  rowCount={rowCount}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  overscanRowCount={10}
                  onRowsRendered={onRowsRendered}
                  noRowsRenderer={noRowsRenderer}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  );
}

export default forwardRef(VirtualizedList);

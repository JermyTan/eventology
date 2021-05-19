import { useCallback, useContext, MouseEvent } from "react";
import classNames from "classnames";
import { Label, LabelProps } from "semantic-ui-react";
import { SearchContext } from "../../context-providers";
import PlaceholderWrapper from "../placeholder-wrapper";
import styles from "./search-category-section.module.scss";

function SearchCategorySection() {
  const {
    selectedCategory,
    setSelectedCategory,
    categories,
    isLoadingCategories,
  } = useContext(SearchContext);

  const onLabelClick: (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    data: LabelProps,
  ) => void = useCallback(
    (_, { value }) => {
      setSelectedCategory((selectedCategory) =>
        selectedCategory === undefined || selectedCategory !== value
          ? value
          : undefined,
      );
    },
    [setSelectedCategory],
  );

  return (
    <PlaceholderWrapper
      isLoading={isLoadingCategories}
      inverted
      showDefaultContent={categories.length === 0}
      defaultContent="No available category"
    >
      <Label.Group className={styles.searchCategorySection}>
        <Label
          className={classNames(styles.label, {
            [styles.active]: selectedCategory === "",
          })}
          circular
          content="All"
          value=""
          onClick={onLabelClick}
        />

        {categories.map((category) => (
          <Label
            className={classNames(styles.label, {
              [styles.active]: selectedCategory === category,
            })}
            circular
            content={category}
            value={category}
            onClick={onLabelClick}
          />
        ))}
      </Label.Group>
    </PlaceholderWrapper>
  );
}

export default SearchCategorySection;

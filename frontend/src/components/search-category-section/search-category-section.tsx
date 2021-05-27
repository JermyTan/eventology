import { MouseEvent } from "react";
import classNames from "classnames";
import isEqual from "lodash.isequal";
import { Label, LabelProps } from "semantic-ui-react";
import PlaceholderWrapper from "../placeholder-wrapper";
import styles from "./search-category-section.module.scss";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSelectedCategory } from "../../redux/slices/search-slice";

function SearchCategorySection() {
  const { selectedCategory, categories, isLoadingCategories } = useAppSelector(
    ({ search: { selectedCategory, categories, isLoadingCategories } }) => ({
      selectedCategory,
      categories,
      isLoadingCategories,
    }),
    isEqual,
  );
  const dispatch = useAppDispatch();

  const onLabelClick: (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    data: LabelProps,
  ) => void = (_, { value }) => dispatch(setSelectedCategory(value));

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

        {categories.map((category, index) => (
          <Label
            key={`${index}-${category}`}
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

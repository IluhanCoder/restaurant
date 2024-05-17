import { useState } from "react";
import RangePicker from "./search-bar-components/range-picker";
import { ProductFilter } from "./product-types";
import { inputStyle } from "../styles/form-styles";
import { buttonStyle } from "../styles/button-styles";
import categoriesArray from "../misc/categories-array";

type LocalParams = {
  onSubmit: (filter: ProductFilter) => {};
};

const ProductSearchBar = (params: LocalParams) => {
  const minState = useState<number>(0);
  const maxState = useState<number>(0);

  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");

  const { onSubmit } = params;

  const handleSubmit = () => {
    const filter: ProductFilter = {};
    if (!(minState[0] === 0 && maxState[0] === 0))
      filter.price = {
        gt: minState[0],
        lt: maxState[0],
      };
    if (name.length > 0) {
      filter["name"] = { contains: name };
    }
    if (category.length > 0) {
      filter["category"] = { contains: category };
    }
    onSubmit(filter);
  };

  return (
    <div className="bg-yellow-50 border">
      <form className="flex justify-center p-3 gap-3">
        <div className="font-bold mr-3">Фільтрація:</div>
        <div className="flex gap-1">
          <label>Назва товару:</label>
          <input
            className={inputStyle}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          <label>Категорія:</label>
          <select
            className={inputStyle}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">всі</option>
            {categoriesArray.map((cat: string) => <option value={cat}>
              {cat}
            </option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <label>Діaпазон ціни (грн):</label>
          <RangePicker minState={minState} maxState={maxState} />
        </div>
        <button className={buttonStyle} type="button" onClick={handleSubmit}>
          знайти
        </button>
      </form>
    </div>
  );
};

export default ProductSearchBar;

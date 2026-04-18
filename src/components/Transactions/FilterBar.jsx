import { categoryOptions, typeOptions } from "../../utils/dataHelpers";
import { useAppContext } from "../../context/AppContext";

function FilterBar() {
  const { filters, setFilters } = useAppContext();

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Transactions</p>
          <h3>Filter Activity</h3>
        </div>
      </div>
      <div className="filter-grid">
        <label>
          <span>Category</span>
          <select
            value={filters.category}
            onChange={(event) => setFilters({ category: event.target.value })}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Type</span>
          <select
            value={filters.type}
            onChange={(event) => setFilters({ type: event.target.value })}
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-grid__search">
          <span>Search</span>
          <input
            type="search"
            placeholder="Search description or account"
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
          />
        </label>
      </div>
    </section>
  );
}

export default FilterBar;

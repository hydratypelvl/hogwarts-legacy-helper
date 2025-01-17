import categories from "../../../data/categories";

export default async function CategoryPage({ params }) {
  // Ensure this function is asynchronous to handle params properly
  const { category } = await params; // Extract the category from URL params

  // Find the current category
  const currentCategory = categories.find((c) => c.key === category);

  if (!currentCategory) {
    return <p>Category not found</p>;
  }

  return (
    <div>
      <h1>{currentCategory.title}</h1>
      {currentCategory.items.map((location, index) =>
        typeof location === "string" ? (
          <div key={index}>
            <label>
              <input type="checkbox" /> {location}
            </label>
          </div>
        ) : (
          <div key={location.location}>
            <h2>{location.location}</h2>
            <ul>
              {location.items.map((item, subIndex) => (
                <li key={subIndex}>
                  <label>
                    <input type="checkbox" /> {item}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}

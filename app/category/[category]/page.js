"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import categories from "../../../data/categories";

export default function CategoryPage() {
  const params = useParams(); // Access params using useParams hook
  const [category, setCategory] = useState(null);
  const [progress, setProgress] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);
  const router = useRouter(); // useRouter hook for navigation

  useEffect(() => {
    const fetchCategory = async () => {
      const categoryKey = params.category;
      const currentCategory = categories.find((c) => c.key === categoryKey);

      if (currentCategory) {
        setCategory(currentCategory);
        // Load checked items from localStorage for this category
        const storedCheckedItems = JSON.parse(localStorage.getItem(categoryKey)) || [];
        setCheckedItems(storedCheckedItems);
      }
    };

    fetchCategory();
  }, [params]);

  const handleCheckboxChange = (categoryKey, location, item) => {
    // Toggle the checked state of the checkbox
    const updatedCheckedItems = [...checkedItems];
    const itemIdentifier = `${categoryKey}-${location}-${item}`;

    if (updatedCheckedItems.includes(itemIdentifier)) {
      // Remove from checked items if unchecked
      updatedCheckedItems.splice(updatedCheckedItems.indexOf(itemIdentifier), 1);
    } else {
      // Add to checked items if checked
      updatedCheckedItems.push(itemIdentifier);
    }

    setCheckedItems(updatedCheckedItems);
    // Update localStorage with the checked items
    localStorage.setItem(categoryKey, JSON.stringify(updatedCheckedItems));
  };

  useEffect(() => {
    if (category) {
      // Calculate the progress of checked items
      const totalItems = category.items.reduce((acc, location) => {
        return acc + (typeof location === "string" ? 1 : location.items.length);
      }, 0);

      const checkedItemsCount = checkedItems.filter(item =>
        item.startsWith(category.key)
      ).length;

      setProgress(Math.floor((checkedItemsCount / totalItems) * 100));
    }
  }, [checkedItems, category]);

  const handleBackToCategories = () => {
    // Navigate back to the main page where the categories are listed
    router.push("/");
  };

  if (!category) {
    return <p>Category not found</p>;
  }

  return (
    <div>
      <h1>{category.title}</h1>
      {/* Progress Bar */}
      <div style={{ margin: "20px 0", width: "100%", backgroundColor: "#e0e0e0", borderRadius: "5px" }}>
        <div
          style={{
            height: "10px",
            width: `${progress}%`,
            backgroundColor: "#4caf50",
            borderRadius: "5px",
          }}
        ></div>
      </div>
      <p>{progress}% Completed</p>

      {category.items.map((location, index) =>
        typeof location === "string" ? (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                checked={checkedItems.includes(`${category.key}-${location}`)}
                onChange={() => handleCheckboxChange(category.key, location, location)}
              />{" "}
              {location}
            </label>
          </div>
        ) : (
          <div key={location.location}>
            <h2>{location.location}</h2>
            <ul>
              {location.items.map((item, subIndex) => {
                const itemIdentifier = `${category.key}-${location.location}-${item}`;
                return (
                  <li key={subIndex}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checkedItems.includes(itemIdentifier)}
                        onChange={() => handleCheckboxChange(category.key, location.location, item)}
                      />{" "}
                      {item}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )
      )}

      {/* Back to Categories Button */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleBackToCategories}
          style={{
            padding: "10px 20px",
            fontSize: "1em",
            backgroundColor: "#3182ce",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to Categories
        </button>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import categories from "../data/categories";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();

  // Declare checkboxState but delay its initialization until after the component mounts
  const [checkboxState, setCheckboxState] = useState<{ [key: string]: (boolean | boolean[])[] } | null>(null);

  useEffect(() => {
    // Load checkbox state from localStorage or use default state
    const initialState: { [key: string]: (boolean | boolean[])[] } = {};
    categories.forEach((category) => {
      initialState[category.key] = category.items.map((item) =>
        typeof item === "object"
          ? item.items.map(() => false) // For nested items
          : false // Top-level items
      );
    });

    // Attempt to load state from localStorage if available
    const savedState = localStorage.getItem("checkboxState");
    if (savedState) {
      setCheckboxState({ ...initialState, ...JSON.parse(savedState) });
    } else {
      setCheckboxState(initialState);
    }
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  useEffect(() => {
    if (checkboxState) {
      // Update localStorage whenever checkboxState changes
      localStorage.setItem("checkboxState", JSON.stringify(checkboxState));
    }
  }, [checkboxState]); // Only run this effect when checkboxState changes

  // Render loading or placeholder while checkboxState is being initialized
  if (checkboxState === null) {
    return <div>Loading...</div>;
  }

  const handleCategoryClick = (categoryKey: string) => {
    router.push(`/category/${categoryKey}`);
  };

  const calculateProgress = () => {
    let totalChecked = 0;
    let totalItems = 0;

    // Iterate through checkboxState to calculate progress
    for (const key in checkboxState) {
      checkboxState[key].forEach((item: boolean | boolean[]) => {
        if (Array.isArray(item)) {
          totalChecked += item.filter((isChecked) => isChecked).length;
          totalItems += item.length;
        } else {
          totalChecked += item ? 1 : 0;
          totalItems += 1;
        }
      });
    }

    return {
      totalChecked,
      totalItems,
      percentage: totalItems === 0 ? 0 : (totalChecked / totalItems) * 100,
    };
  };

  const { totalChecked, totalItems, percentage } = calculateProgress();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#1a202c", color: "white" }}>
      <h1 style={{ fontSize: "2em", textAlign: "center" }}>Hogwarts Legacy Progress Tracker</h1>
      {/* Overall Progress Bar */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <p>
          Overall Progress: {totalChecked} / {totalItems} checked ({percentage.toFixed(2)}%)
        </p>
        <div
          style={{
            width: "100%",
            height: "10px",
            background: "#eee",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background: "green",
            }}
          ></div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        {categories.map((category) => {
          const categoryChecked = checkboxState[category.key]
            .flat()
            .filter((checked: boolean) => checked).length;
          const categoryTotal = checkboxState[category.key].flat().length;

          const categoryProgress = categoryTotal === 0 ? 0 : (categoryChecked / categoryTotal) * 100;

          return (
            <div
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              style={{
                backgroundColor: "#2d3748",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                width: "250px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Image
                src={category.image}
                alt={category.title}
                height={150}
                width={150}
                style={{ objectFit: "cover", height: "auto", width: "100%" }}
                priority={true}
              />
              <div style={{ padding: "10px" }}>
                <h3 style={{ margin: "0", fontSize: "1.2em", color: "#63b3ed" }}>
                  {category.title} ({categoryChecked}/{categoryTotal})
                </h3>
                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    background: "#eee",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${categoryProgress}%`,
                      height: "100%",
                      background: "green",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

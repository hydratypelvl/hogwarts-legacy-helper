"use client";

import { useRouter } from "next/navigation";
import categories from "../data/categories";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleCategoryClick = (categoryKey: string) => {
    router.push(`/category/${categoryKey}`);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#1a202c", color: "white" }}>
      <h1 style={{ fontSize: "2em", textAlign: "center" }}>Hogwarts Legacy Progress Tracker</h1>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        {categories.map((category) => (
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
            ></Image>
            <div style={{ padding: "10px" }}>
              <h3 style={{ margin: "0", fontSize: "1.2em", color: "#63b3ed" }}>{category.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";

export const Sidebar = () => {
  const categories = [
    "Woman's Fashion",
    "Men's Fashion",
    "Electronics",
    "Home & Lifestyle",
    "Medicine",
    "Sports & Outdoor",
    "Baby's & Toys",
    "Groceries & Pets",
    "Health & Beauty"
  ];

  return (
    <aside className="hidden md:block w-64">
      <nav className="py-4">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/category/${encodeURIComponent(category.toLowerCase())}`}
            className="flex items-center justify-between py-3 px-4 hover:bg-gray-50"
          >
            <span>{category}</span>
            <span className="text-gray-400">›</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
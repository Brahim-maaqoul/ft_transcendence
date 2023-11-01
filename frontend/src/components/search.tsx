import React, { useState } from "react";
const searchIcon = (
  <svg
    className="text-white  search__icon h-7 w-5 fill-current text-b4b4b4"
    aria-hidden="true"
    viewBox="0 0 24 24">
    <g>
      <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
    </g>
  </svg>
);

import { useState } from "react";

type User = {
  id: number;
  name: string;
};

const allUsers: User[] = [
  { id: 1, name: "John" },
  { id: 2, name: "Alice" },
  { id: 3, name: "Bob" },
  // Add more user data as needed
];

export const Search = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<User[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchText(query);

    // Simulated user search for suggestions
    const suggestedUsers = allUsers.filter((user) =>
      user.name.toLowerCase().includes(query)
    );
    setSuggestions(suggestedUsers);
    console.log(query);
  };

  return (
    <div className="flex py-2 items-center justify-center">
      <input
        placeholder="Search"
        className="bg-black bg-opacity-40 p-3 w-[45%] text-white pl-5 rounded-3xl shadow-black relative"
        type="text"
        value={searchText}
        onChange={handleSearch}
      />
      <ul className="absolute bg-white mt-2 p-2  rounded-3xl shadow-black">
        {suggestions.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <button className="pl-3.5 w-12 h-[36%] bg-black bg-opacity-40 hover:bg-slate-400 text-white rounded-3xl shadow-black pr-4 py-2 ml-2">
        {searchIcon}
      </button>
    </div>
  );
};

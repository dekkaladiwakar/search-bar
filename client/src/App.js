import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./app.css";
import axios from "axios";
import Dashboard from "./Dashboard";

export default function App() {
  const [query, setQuery] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/home");
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `http://localhost:5000/company/search?q=${query}`
      );
      setData(res.data);
    };
    if (query.length > 0) fetchData();
  }, [query]);

  const onSelection = (name, id) => {
    setQuery(name);
    setCompanyName(name);
    setCompanyId(id);
  };

  const onSubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/company/add`, {
        companyName: companyName,
        companyId: companyId,
      });
    } catch (e) {
      console.log("Adding Company Failed", e);
    } finally {
      setQuery("");
      setCompanyName("");
      setCompanyId("");
      navigateHome();
    }
  };

  return (
    <div className="App">
      <h1>Search</h1>

      <div className="search-container">
        <div className="search-inner">
          <input
            className="search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value.toLowerCase())}
          />
          <button
            onClick={() => {
              onSubmit();
            }}
          >
            Submit
          </button>
          <Routes>
            <Route path="/home" element={<Dashboard />} />
          </Routes>
        </div>
        <div className="dropdown">
          {data
            .filter((item) => {
              const searchTerm = query.toLowerCase();
              const companyName = item.company_name.toLowerCase();
              return (
                searchTerm &&
                companyName.startsWith(searchTerm) &&
                companyName !== searchTerm
              );
            })
            .map((item) => (
              <div
                className="dropdown-row"
                onClick={() => {
                  onSelection(item.company_name, item.company_id);
                }}
                key={item.id}
              >
                {item.company_name}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import App from "./App";
import Table from "./Table";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/company/all`);

      console.log(res.data);
      const arrData = res.data.data;

      setData(arrData);
      console.log(arrData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const navigateToSearch = () => {
    navigate("/search");
  };
  return (
    <div>
      <h1>HomePage</h1>
      <div>
        <button onClick={navigateToSearch}>Add Company</button>
        <Routes>
          <Route path="/search" element={<App />} />
        </Routes>
      </div>
      <br />
      <br />
      <br />
      <br />
      {loading ? <h4>Loading ...</h4> : <Table data={data} />}
    </div>
  );
}

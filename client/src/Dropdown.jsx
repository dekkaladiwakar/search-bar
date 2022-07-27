const Dropdown = ({ data }) => {
  return (
    <div className="dropdown">
      {data.map((item) => (
        <div className="dropdown-row" key={item.first_name}>
          {item.first_name}
        </div>
      ))}
    </div>
  );
};
export default Dropdown;

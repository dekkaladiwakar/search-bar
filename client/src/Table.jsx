const Table = ({ data }) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>CIN</th>
          <th>Name</th>
        </tr>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.cid}</td>
            <td>{item.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

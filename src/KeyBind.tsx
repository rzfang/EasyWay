function KeyBind ({ items }) {
  const commandKeyPairs = [];



  return (
    <fieldset>
      <legend>Command & Keyboard binding</legend>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Command</th>
            <th>Key</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(items).map(([ key, value ], index) => {
            return (
              <tr key={index}>
                <td></td>
                <td><input type="text" value={key} /></td>
                <td><input type="text" value={value} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </fieldset>
  );
}

export default KeyBind;

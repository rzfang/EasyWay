function NumLock ({ defaultOnOff = false, onChange = () => {} }) {
  const change = event => {
    onChange && onChange(event, event.currentTarget.value);
  };

  return (
    <div className="NumLock">
      <label>
        On
        <input name="on-ff" defaultChecked={defaultOnOff} onChange={change} type="radio" value={true} />
      </label>
      <label>
        Off
        <input name="on-ff" defaultChecked={!defaultOnOff} onChange={change} type="radio" value={false} />
      </label>
    </div>
  );
}

export default NumLock;

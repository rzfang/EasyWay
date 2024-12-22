import useRcStore from './stores/rc.store.ts';

function NumLock () {
  const isNumlock = useRcStore(state => state.config.keyboard.numlock) === 'on';
  const toggleNumLock = useRcStore(state => state.toggleNumLock);

  const change = event => { toggleNumLock(); };

  return (
    <div className="NumLock">
      <label>
        On
        <input name="on-off" checked={isNumlock} onChange={change} type="radio" value="on" />
      </label>
      <label>
        Off
        <input name="on-off" checked={!isNumlock} onChange={change} type="radio" value="off" />
      </label>
    </div>
  );
}

export default NumLock;

import { inputStyle } from "../../styles/form-styles";

type LocalParams = {
  minState: [number, React.Dispatch<React.SetStateAction<number>>];
  maxState: [number, React.Dispatch<React.SetStateAction<number>>];
};

const RangePicker = (params: LocalParams) => {
  const { minState, maxState } = params;
  const [minStateValue, setMinState] = minState;
  const [maxStateValue, setMaxState] = maxState;

  const handleMinBlur = (e: any) => {
    const newValue = Number(e.target.value);
    if (newValue > maxStateValue) setMaxState(newValue + 100);
    if (newValue < 0) setMinState(0);
  };

  const handleMaxBlur = (e: any) => {
    const newValue = Number(e.target.value);
    if (newValue < minStateValue) setMaxState(minStateValue + 1);
  };

  return (
    <div className="flex gap-2">
      <div className="flex gap-1">
        <label>від</label>
        <input
          className={inputStyle + "w-16"}
          type="number"
          value={minStateValue}
          onChange={(e) => setMinState(Number(e.target.value))}
          onBlur={handleMinBlur}
        />
      </div>
      <div className="flex gap-1">
        <label>до</label>
        <input
          className={inputStyle + "w-16"}
          type="number"
          value={maxStateValue}
          onChange={(e) => setMaxState(Number(e.target.value))}
          onBlur={handleMaxBlur}
        />
      </div>
    </div>
  );
};

export default RangePicker;

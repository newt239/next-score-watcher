type InputProps = {
  id: string;
  label: string;
  placehodler: string;
  required: boolean;
};
const Input: React.FC<{ props: InputProps }> = ({ props }) => {
  return (
    <div className="form-control">
      <label className="label" htmlFor={props.id}>
        <span className="label-text">{props.label}</span>
      </label>
      <input
        id={props.id}
        type="text"
        placeholder={props.placehodler}
        className="input w-full max-w-xs"
      />
    </div>
  );
};

export default Input;

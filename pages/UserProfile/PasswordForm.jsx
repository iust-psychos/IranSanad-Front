import "./index.css";
import LabelInput from "./LabelInput";

const PasswordForm = ({ onUpdate }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onUpdate(name, value);
  };

  return (
    <div className="user-profile-forms-info">
      <LabelInput
        type="password"
        name="current"
        label="رمزعبور فعلی"
        onChange={handleInputChange}
      />
      <LabelInput
        type="password"
        name="new"
        label="رمزعبور جدید"
        onChange={handleInputChange}
      />
      <LabelInput
        type="password"
        name="confirm"
        label="تایید رمزعبور جدید"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default PasswordForm;

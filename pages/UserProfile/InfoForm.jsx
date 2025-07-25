import "@/styles/UserProfile.css";
import LabelInput from "./LabelInput";

const InfoForm = ({ user, onUpdate }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onUpdate(name, value);
  };

  return (
    <div className="user-profile-forms-info">
      <LabelInput
        type="text"
        name="name"
        label="نام"
        value1={user.first_name}
        value2={user.last_name}
        onChange={handleInputChange}
      />
      <LabelInput
        type="text"
        name="email"
        label="نشانی ایمیل"
        value1={user.email}
      />
      <LabelInput
        type="text"
        name="number"
        label="شماره تماس"
        value1={user.phone_number}
        onChange={handleInputChange}
      />
      <LabelInput
        type="text"
        name="username"
        label="نام کاربری"
        value1={user.username}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default InfoForm;

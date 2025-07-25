import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

const LabelInput = ({ type, name, label, value1, value2, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="user-profile-forms-labelinput">
      {name === "name" ? (
        <>
          <label htmlFor="fname">{label}</label>
          <input
            id="fname"
            name="fname"
            type={type}
            className="user-profile-forms-labelinput-input name"
            dir="rtl"
            value={value1}
            onChange={onChange}
          />
          <input
            id="lname"
            name="lname"
            type={type}
            className="user-profile-forms-labelinput-input name"
            dir="rtl"
            value={value2}
            onChange={onChange}
          />{" "}
        </>
      ) : type === "password" ? (
        show ? (
          <>
            <label htmlFor={name}>{label}</label>
            <button
              className="user-profile-forms-labelinput-button"
              onClick={() => setShow(false)}
            >
              <IoEyeOff />
            </button>
            <input
              id={name}
              name={name}
              type="text"
              className="user-profile-forms-labelinput-input"
              dir="ltr"
              onChange={onChange}
            />
          </>
        ) : (
          <>
            <label htmlFor={name}>{label}</label>
            <button
              className="user-profile-forms-labelinput-button"
              onClick={() => setShow(true)}
            >
              <IoEye />
            </button>
            <input
              id={name}
              name={name}
              type="password"
              className="user-profile-forms-labelinput-input"
              dir="ltr"
              onChange={onChange}
            />
          </>
        )
      ) : (
        <>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            name={name}
            type={type}
            className="user-profile-forms-labelinput-input"
            dir="ltr"
            disabled={name === "email"}
            value={value1}
            onChange={onChange}
          />{" "}
        </>
      )}
    </div>
  );
};

export default LabelInput;

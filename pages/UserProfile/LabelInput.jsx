const LabelInput = ({ type, name, label, value1, value2, onChange }) => {
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
        <>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            name={name}
            type={type}
            className="user-profile-forms-labelinput-input"
            dir="ltr"
            onChange={onChange}
          />{" "}
        </>
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

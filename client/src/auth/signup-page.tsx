import { useState } from "react";
import { credentials } from "./auth-types";
import authService from "./auth-service";
import { cardStyle } from "../styles/card-styles";
import { inputStyle } from "../styles/form-styles";
import { buttonStyle } from "../styles/button-styles";
import { Link, useNavigate } from "react-router-dom";
import { smallLinkStyle } from "../styles/link-styles";
import { ToastContainer, toast } from "react-toastify";
import { userInfo } from "os";

const SignupPage = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<credentials>({
    email: "",
    username: "",
    password: "",
    passwordSub: "",
  });

  const handleOnChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputValue((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if(!(inputValue.email.length > 0 && inputValue.username?.length! > 0 && inputValue.password.length > 0 && inputValue.passwordSub?.length! > 0)) {
        toast.error("всі поля мають бути заповненими");
        return
      }
      if(inputValue.password != inputValue.passwordSub) {
        toast.error("поля пароль та підтвердження пароля не співпадають");
        return
      }
      toast("обробка запиту...");
     await authService.SignUp(inputValue);
     navigate("/");
    } catch(error: any) {
      if(error.status = 401) toast.error("ви маєете бути авторизованими!");
      else toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center">
      <ToastContainer/>
      <form
        onChange={handleOnChange}
        className={cardStyle + " flex flex-col gap-3 justify-center p-4 mt-24"}
      >
        <div className="text-xl font-bold">Реєстрація</div>
        <div className="flex w-full gap-2">
          <label>Ім'я користувача:</label>
          <input
            className={"grow " + inputStyle}
            type="text"
            name="username"
            value={inputValue.username}
            onChange={handleOnChange}
          />
        </div>
        <div className="flex w-full gap-2">
          <label>Електрона пошта</label>
          <input
            className={"grow " + inputStyle}
            type="email"
            name="email"
            value={inputValue.email}
            onChange={handleOnChange}
          />
        </div>
        <div className="flex w-full gap-2">
          <label>Пароль</label>
          <input
            className={"grow " + inputStyle}
            type="password"
            name="password"
            value={inputValue.password}
            onChange={handleOnChange}
          />
        </div>
        <div className="flex w-full gap-2">
          <label>Підтвердження пароля</label>
          <input
            className={"grow " + inputStyle}
            type="password"
            name="passwordSub"
            value={inputValue.passwordSub}
            onChange={handleOnChange}
          />
        </div>
        <div className="flex justify-center">
          <button className={buttonStyle} type="button" onClick={handleSubmit}>
            Зареєструватися
          </button>
        </div>
        <div className="flex justify-center gap-1">
          <label>Вже є обліковий запис?</label>{" "}
          <Link className={smallLinkStyle} to="/login">
            Увійти
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;

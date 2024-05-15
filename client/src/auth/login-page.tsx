import { useState } from "react";
import { credentials } from "./auth-types";
import $api, { setHeader } from "../axios-setup";
import { cardStyle } from "../styles/card-styles";
import { inputStyle } from "../styles/form-styles";
import { buttonStyle } from "../styles/button-styles";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { smallLinkStyle } from "../styles/link-styles";

const LoginPage = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<credentials>({
    email: "",
    password: "",
  });

  const handleOnChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputValue((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = (await $api.post("/login", inputValue)).data;
      localStorage.setItem("token", token);
      setHeader();
      navigate("/");
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center">
      <form
        onChange={handleOnChange}
        className={cardStyle + " flex flex-col gap-3 justify-center p-4 mt-24"}
      >
        <div className="text-xl font-bold">Вхід в обліковий запис</div>
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
        <div className="flex justify-center">
          <button className={buttonStyle} type="button" onClick={handleSubmit}>
            Увійти в обліковий запис
          </button>
        </div>
        <div className="flex justify-center gap-1">
          <label>Нема облікового запису?</label>{" "}
          <Link className={smallLinkStyle} to="/signup">
            Зареєструватися
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

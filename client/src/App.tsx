import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./misc/welcome-page";
import ProductsPage from "./products/products-page";
import NewProductPage from "./products/new-product-page";
import SignupPage from "./auth/signup-page";
import LoginPage from "./auth/login-page";
import NewTransactionPage from "./transactions/new-transaction-page";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import uk from "date-fns/locale/uk";
import TransactionsPage from "./transactions/transactions-page";
import AnalyticsPage from "./analytics/analytics-page";
import PredictionPage from "./prediction/prediction-page";
import PairsPage from "./pairs/pairs-page";
import { Link } from "react-router-dom";
import { linkStyle } from "./styles/link-styles";
import { useEffect } from "react";
import { setHeader } from "./axios-setup";
registerLocale("ua", uk);

function App() {
  useEffect(() =>  {
    if(localStorage.getItem("token")) setHeader();
  }, [])

  return (
    <BrowserRouter>
      <header className="flex flex-row px-4 py-2 shadow-sm border gap-4 justify-between px-10">
        <div className="text-2xl">
          🍕
        </div>
        <div className="flex gap-4">
          <Link to="products" className="mt-0.5 hover:text-gray-400">
            меню
          </Link>
          <Link to="new-product" className="mt-0.5 hover:text-gray-400">
            нова позиція
          </Link>
          <Link to="transactions" className="mt-0.5 hover:text-gray-400">
            чеки
          </Link>
          <Link to="prediction" className="mt-0.5 hover:text-gray-400">
            статистика
          </Link>
          <Link to="analytics" className="mt-0.5 hover:text-gray-400">
            аналітика
          </Link>
          <Link to="pairs" className="mt-0.5 hover:text-gray-400">
            шаблоні замовлення
          </Link>
          <Link to="/" className="mt-0.5 hover:text-gray-400">
            обліковий запис
          </Link>
        </div>
      </header>
      <Routes>
        <Route index element={<WelcomePage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="new-product" element={<NewProductPage />} />
        <Route path="new-transaction" element={<NewTransactionPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="prediction" element={<PredictionPage />} />
        <Route path="pairs" element={<PairsPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;

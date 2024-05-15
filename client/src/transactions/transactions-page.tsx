import { useEffect, useState } from "react";
import {
  Purchase,
  PurchaseResponse,
  Transaction,
  TransactionResponse,
} from "./transaction-types";
import transactionService from "./transaction-service";
import ReactDatePicker from "react-datepicker";
import TimePicker from "./time-picker";
import convertTime from "./convert-time";
import { cardStyle } from "../styles/card-styles";
import { inputStyle } from "../styles/form-styles";
import { buttonStyle, deleteButtonStyle } from "../styles/button-styles";
import DateFormater from "../misc/date-formatter";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>();
  const [productName, setProductName] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(
    new Date("2024-01-02T00:00:00"),
  );
  const [endDate, setEndDate] = useState<Date>(new Date("2024-12-01T23:00:00"));

  const filterTransactions = async (stDate: Date, enDate: Date) => {
    try {
      const dateFilter = {
        date: {
          gte: stDate,
          lte: enDate,
        },
      };
      const result = await transactionService.fetchTransactions(
        dateFilter,
        productName,
      );
      setTransactions([...result]);
  } catch(error: any) {
    if(error.status = 401) toast.error("ви маєете бути авторизованими!");
    else toast.error(error.message);
  }
  };

  const handleDelete = async (transactionId: string) => {
    await transactionService.deleteTransactions(transactionId);
    toast.success("транзакцію успішно видалено");
    filterTransactions(startDate, endDate);
  };

  const handleStart = (newDate: Date) => {
    const temp = startDate;
    temp.setFullYear(newDate.getFullYear());
    temp.setMonth(newDate.getMonth());
    temp.setDate(newDate.getDate());
    if (temp >= endDate!) return;
    setStartDate(temp);
  };

  const handleStartTimeChange = (hours: string, minutes: string) => {
    const newDate = convertTime(hours, minutes, startDate);
    if (newDate >= endDate) return;
    setStartDate(newDate);
  };

  const handleEnd = (newDate: Date) => {
    const temp = endDate;
    temp.setFullYear(newDate.getFullYear());
    temp.setMonth(newDate.getMonth());
    temp.setDate(newDate.getDate());
    if (temp <= startDate) return;
    setEndDate(temp);
  };

  const handleEndTimeChange = (hours: string, minutes: string) => {
    const newDate = convertTime(hours, minutes, endDate);
    if (newDate <= startDate) return;
    setEndDate(newDate);
  };

  function formatDateTime(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  useEffect(() => {
    filterTransactions(startDate, endDate);
  }, []);

  return (
    <div className="flex flex-col">
      <ToastContainer />
      <div className="flex justify-center py-3">
        <Link to="/new-transaction" className={buttonStyle}>
          Додати чек
        </Link>
      </div>
      <div className="flex justify-center">
        <div className={"flex flex-col justify-center gap-2 p-4 " + cardStyle}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-center">Діaпазон дати і часу:</label>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <label>Від:</label>
                  <ReactDatePicker
                    dateFormat="dd/MM/yyyy"
                    className={inputStyle}
                    selected={startDate}
                    onChange={handleStart}
                    locale={"ua"}
                  />
                  <TimePicker
                    onChange={handleStartTimeChange}
                    defaultHour="00"
                  />
                </div>
                <div className="flex gap-2">
                  <label>До:</label>
                  <ReactDatePicker
                    dateFormat="dd/MM/yyyy"
                    className={inputStyle}
                    selected={endDate}
                    onChange={handleEnd}
                    locale={"ua"}
                  />
                  <TimePicker onChange={handleEndTimeChange} defaultHour="23" />
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <label>Назва продукту в замовлені:</label>
              <input
                className={inputStyle}
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className={buttonStyle}
              onClick={() => filterTransactions(startDate, endDate)}
            >
              знайти
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4">
        <div className="flex justify-center text-2xl">Чеки:</div>
        {(transactions &&
          ((transactions.length > 0 && (
            <div className="grid grid-cols-2 gap-4 p-4">
              {transactions.map((transaction: TransactionResponse) => {
                return (
                  <div className={cardStyle + "p-4 flex flex-col"}>
                    <div className="flex justify-center font-bold pb-2">
                      <div>
                        {
                          <DateFormater
                            value={new Date(transaction.date)}
                            dayOfWeek
                          />
                        }
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-center">
                          Куплені товари:
                        </div>
                        <div className="flex flex-col bg-gray-100 justify-center gap-3">
                          {transaction.products.map(
                            (prod: PurchaseResponse) => {
                              return (
                                <div className="flex w-full bg-gray-300 rounded p-2 shadow-md ">
                                  {(prod.product && (
                                    <div className="flex gap-3 py-1 px-4">
                                      <div>{prod.product.name}</div>
                                      <div>Кількість: {prod.quantity}</div>
                                      <div>
                                        Вартість: {prod.product.price} грн
                                      </div>
                                    </div>
                                  )) || (
                                    <div>
                                      продукту не існує, або інформація про
                                      продукт була видалена
                                    </div>
                                  )}
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-2 pt-4">
                      Сумарна вартість чеку:{" "}
                      <label className="font-bold">
                        {transaction.totalCost}
                      </label>
                    </div>
                    <div className="flex justify-center pt-3">
                      <button
                        className={deleteButtonStyle}
                        type="button"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        видалити транзакцію
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )) || (
            <div className="flex justify-center">
              <div className="mt-16 text-center text-3xl">
                Чеки відсутні
              </div>
            </div>
          ))) || (
          <div className="flex justify-center">
            <div className="mt-16 text-center text-3xl">
              Підвантаження транзакцій...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;

import { useState, useEffect } from "react";
import { AnalyticsResult } from "./analytics-types";
import analyticsService from "./analytics-service";
import { convertAnalyticsForGraphs } from "./analytics-helpers";
import AnalyticsGraph from "./analytics-graph";
import ReactDatePicker from "react-datepicker";
import { cardStyle } from "../styles/card-styles";
import { inputStyle } from "../styles/form-styles";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResult>();
  const [startDate, setStartDate] = useState<Date>(new Date("2023-11-01"));
  const [endDate, setEndDate] = useState<Date>(new Date("2024-12-01"));

  const navigate = useNavigate();

  const getData = async (startDate: Date, endDate: Date) => {
    try {
      const result = await analyticsService.getAnalyticsData(startDate, endDate);
      setAnalytics(result);
    } catch(error: any) {
      if(error.status = 401) toast.error("ви маєете бути авторизованими!");
      else toast.error(error.message);
    }
  };

  const handleStart = (newDate: Date) => {
    if (newDate >= endDate) return;
    setStartDate(newDate);
    getData(newDate, endDate);
  };

  const handleEnd = (newDate: Date) => {
    if (newDate <= startDate) return;
    setEndDate(newDate);
    getData(startDate, newDate);
  };

  useEffect(() => {
    if (!analytics) getData(startDate, endDate);
  }, [setAnalytics]);

  return (
    <div className="flex flex-col gap-2 py-4">
      <ToastContainer/>
      <div className="flex justify-center p-2">
        <div className={cardStyle + " py-1 pb-3 px-6 flex flex-col gap-2"}>
          <div className="flex justify-center text-xl">Діапазон дат</div>
          <div className="flex gap-2">
            <div className="flex gap-2">
              <label>Від:</label>
              <ReactDatePicker
                dateFormat="dd/MM/yyyy"
                className={inputStyle}
                selected={startDate}
                onChange={handleStart}
                locale={"ua"}
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
            </div>
          </div>
        </div>
      </div>
      {(analytics && (
        <div className="flex justify-center">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="text-center text-xl">
                Щомісячна сума продажів:
              </div>
              <AnalyticsGraph
                data={
                  convertAnalyticsForGraphs(analytics!).monthlyTransactionSum
                    .data
                }
                name={
                  convertAnalyticsForGraphs(analytics!).monthlyTransactionSum
                    .name
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-center text-xl">
                Середня сума чеку за місяць:
              </div>
              <AnalyticsGraph
                data={
                  convertAnalyticsForGraphs(analytics!).averageTransactions.data
                }
                name={
                  convertAnalyticsForGraphs(analytics!).averageTransactions.name
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-center text-xl">
                Кількість транзакцій за місяць
              </div>
              <AnalyticsGraph
                data={
                  convertAnalyticsForGraphs(analytics!).monthlyTransactionAmount
                    .data
                }
                name={
                  convertAnalyticsForGraphs(analytics!).monthlyTransactionAmount
                    .name
                }
              />
            </div>
          </div>
        </div>
      )) || (
        <div className="flex justify-center">
          <div className="mt-16 text-center text-3xl">
            Завантаження аналітики...
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;

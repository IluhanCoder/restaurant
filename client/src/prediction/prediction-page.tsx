import { useState, useEffect } from "react";
import {
  MonthlySalesResponseUnit,
  PredictionResponseUnit,
} from "./prediction-types";
import predictionService from "./prediction-service";
import PredictionGraph from "./prediction-graph";
import {
  ConvertMonthlySalesForGraphs,
  ConvertPredictionsForGraphs,
} from "./predictions-helpers";
import ProductsCatalogue from "../products/products-catalogue";
import { Product } from "../products/product-types";
import { cardStyle } from "../styles/card-styles";
import { inputStyle } from "../styles/form-styles";
import { buttonStyle } from "../styles/button-styles";
import html2PDF from "jspdf-html2canvas";
import { ToastContainer, toast } from "react-toastify";

const PredictionPage = () => {
  const [prediction, setPrediction] = useState<PredictionResponseUnit[]>([]);
  const [productSales, setProductSales] = useState<MonthlySalesResponseUnit[]>(
    [],
  );
  const [currentProduct, setCurrentProduct] = useState<Product>();
  const [months, setMonths] = useState<number>(20);

  const getData = async () => {
    try {
      const data = await predictionService.getPrediction(
        currentProduct!.id,
        months,
      );
      const monthly = await predictionService.getMonthlySales(currentProduct!.id);
      setPrediction(data);
      setProductSales(monthly);
    } catch(error: any) {
      if(error.status = 401) toast.error("ви маєете бути авторизованими!");
      else toast.error(error.message);
    }
  };

  const handlePick = async (product: Product) => {
    setCurrentProduct(product);
  };

  const generatePdf = () => {
    const page = document.getElementById("results");
      html2PDF(page!, {
        jsPDF: {
          format: "a4",
        },
        imageType: "image/jpeg",
        output: "./pdf/generate.pdf",
      });
  };

  useEffect(() => {
    if (currentProduct) getData();
  }, [setPrediction, currentProduct]);

  return (
    <div>
      <ToastContainer/>
      <div className="flex flex-col gap-4 p-4 border-2 m-2">
        <div className="text-center text-2xl">
          Оберіть товар, який ви хочете проаналізувати:
        </div>
        <ProductsCatalogue onPick={handlePick} isPicker />
      </div>
      <div className="flex justify-center">
        <div className={`flex justify-center py-2 px-6 gap-2 ` + cardStyle}>
          <label>Кількість місяців</label>
          <input
            className={"w-20 " + inputStyle}
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
          />
          <button
            className={buttonStyle}
            type="button"
            onClick={() => {
              if (currentProduct) getData();
            }}
          >
            Встановити
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col p-4" id="results">
          <div className="flex justify-center">
            <div className="flex flex-col">
              {currentProduct && (
                <div className="text-center text-2xl py-2">
                  Продажі товару "{currentProduct?.name}" за поточний рік:
                </div>
              )}
              <PredictionGraph
                data={ConvertMonthlySalesForGraphs(productSales)}
              />
              {currentProduct && (
                <div className="text-center text-2xl py-2">
                  Прогноз продажів товару "{currentProduct?.name}" у встановлену
                  к-сть місяців:
                </div>
              )}
              <PredictionGraph data={ConvertPredictionsForGraphs(prediction)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              {currentProduct && (
                <div className="text-center text-2xl py-2">
                  Таблиця продажу товару "{currentProduct?.name}" за поточний
                  рік:
                </div>
              )}
              <table className="w-full">
                <tr>
                  <th className="border-2 text-center p-1">Місяць</th>
                  <th className="border-2 text-center p-1">
                    Кількість проданого товару
                  </th>
                </tr>
                {productSales.map((unit: MonthlySalesResponseUnit) => {
                  return (
                    <tr>
                      <td className="border-2 text-center p-1">{unit.month}</td>
                      <td className="border-2 text-center p-1">
                        {unit.productSales}
                      </td>
                    </tr>
                  );
                })}
              </table>
            </div>
            <div>
              {currentProduct && (
                <div className="text-center text-2xl py-2">
                  Таблиця прогнозу продажу товару "{currentProduct?.name}" за
                  поточний рік:
                </div>
              )}
              <table className="w-full">
                <tr>
                  <th className="border-2 text-center p-1">Місяць</th>
                  <th className="border-2 text-center p-1">
                    Кількість проданого товару
                  </th>
                </tr>
                {prediction.map((unit: PredictionResponseUnit) => {
                  return (
                    <tr>
                      <td className="border-2 text-center p-1">{unit.month}</td>
                      <td className="border-2 text-center p-1">
                        {Math.floor(unit.sales)}
                      </td>
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center p-4">
              <button type="button" className={buttonStyle} onClick={generatePdf}>генерувати звіт</button>
            </div>
    </div>
  );
};

export default PredictionPage;

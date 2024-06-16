import { useState, useEffect } from "react";
import { PairsResponse } from "./pairs-types";
import pairsService from "./pairs-service";
import { Buffer } from "buffer";
import { cardStyle } from "../styles/card-styles";
import { buttonStyle } from "../styles/button-styles";
import { inputStyle } from "../styles/form-styles";
import React, { useRef } from 'react';
import html2PDF from "jspdf-html2canvas";
import { ToastContainer, toast } from "react-toastify";
import categoriesArray from "../misc/categories-array";

const PairsPage = () => {
  const [minSupport, setMinSupport] = useState<number>(3);
  const [maxSupport, setMaxSupport] = useState<number>(6);
  const [minConfidence, setMinConfidence] = useState<number>(0.1);
  const [maxConfidence, setMaxConfidence] = useState<number>(1);
  const [category, setCategory] = useState<string>("");
  const [results, setResults] = useState<PairsResponse[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultElement, setResultElement] = useState<HTMLElement>();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const result = await pairsService.getPares(
        minSupport,
        maxSupport,
        minConfidence,
        maxConfidence,
        category,
      );
      setIsLoading(false);
      setResults(result);
    } catch(error: any) {
      if(error.status = 401) toast.error("ви маєете бути авторизованими!");
      else toast.error(error.message);
    }
  };

  const convertImage = (image: any) => {
    return `data:image/jpeg;base64,${Buffer.from(image.data).toString(
      "base64",
    )}`;
  };

  const contentRef = useRef(null);

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
    const content = document.getElementById("results");
    setResultElement(content!);
  }, [results])

  return (
    <div className="flex flex-col p-4">
      <ToastContainer/>
      <div className="flex justify-center">
        <form
          className={cardStyle + "py-2 px-4 gap-2 flex flex-col justify-center"}
        >
          <div className="flex justify-center">Параметри пошуку:</div>
          <div className="flex gap-2">
            <label>Мінімальна підтримка:</label>
            <input
              className={inputStyle}
              type="number"
              value={minSupport}
              onChange={(e) => setMinSupport(Number(e.target.value))}
            />
          </div>
          <div className="flex gap-2">
            <label>Максимальна підтримка:</label>
            <input
              className={inputStyle}
              type="number"
              value={maxSupport}
              onChange={(e) => setMaxSupport(Number(e.target.value))}
            />
          </div>
          <div className="flex gap-2">
            <label>Мінімальна достовірність:</label>
            <input
              className={inputStyle}
              type="number"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
            />
          </div>
          <div className="flex gap-2">
            <label>Максимальна достовірність:</label>
            <input
              className={inputStyle}
              type="number"
              value={maxConfidence}
              onChange={(e) => setMaxConfidence(Number(e.target.value))}
            />
          </div>
          <div className="flex gap-2">
            <label>Категорія</label>
            <select
            className={inputStyle}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">всі</option>
            {categoriesArray.map((cat: string) => <option value={cat}>
              {cat}
            </option>)}
          </select>
          </div>
          <div className="flex justify-center">
            <button
              className={buttonStyle}
              type="button"
              onClick={handleSubmit}
            >
              Здійснити аналіз
            </button>
          </div>
        </form>
      </div>
      {results && <div className="flex justify-center pt-4">
            <button onClick={generatePdf} className={buttonStyle} type="button">
                Генерувати звіт
            </button>
        </div>}
      <div className="flex flex-col gap-3 py-5" id="results">
        <div className="flex justify-center text-2xl">
          Таблиця шаблоних покупок:
        </div>
        {(results &&
          ((results.length > 0 && (
            <table>
              <tr className="text-xl">
                <th className="border-2 p-2">Продукт 1</th>
                <th className="border-2 p-2">Продукт 2</th>
                <th className="border-2 p-2">Підтримка</th>
                <th className="border-2 p-2">достовірність</th>
              </tr>
              {results.map((result: PairsResponse) => {
                return (
                  <tr>
                    <td className="border-2">
                      <div className="flex justify-around">
                        <div>
                          <img
                            className="w-24"
                            src={convertImage(result.pair[0].image)}
                          />
                        </div>
                        <div className="flex flex-col justify-center text-2xl">
                          {result.pair[0].name}
                        </div>
                      </div>
                    </td>
                    <td className="border-2">
                      <div className="flex justify-around">
                        <div>
                          <img
                            className="w-24"
                            src={convertImage(result.pair[1].image)}
                          />
                        </div>
                        <div className="flex flex-col justify-center text-2xl">
                          {result.pair[1].name}
                        </div>
                      </div>
                    </td>
                    <td className="border-2">
                      <div className="flex justify-center text-2xl">
                        {result.support.toFixed(2)}
                      </div>
                    </td>
                    <td className="border-2">
                      <div className="flex justify-center text-2xl">
                        {result.confidence.toFixed(2)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </table>
          )) ||
            (!isLoading && (
              <div className="flex justify-center">
                <div className="mt-16 text-center text-3xl">
                  Пари не було знайдено
                </div>
              </div>
            )))) || (
          <div className="flex justify-center">
            <div className="mt-16 text-center text-3xl">
              Введіть параметри, та натисніть "здійснити аналіз"
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center">
            <div className="mt-16 text-center text-3xl">
              Завантаження аналітики...
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center"></div>
    </div>
  );
};

export default PairsPage;

import { useState } from "react";
import { ITransaction, Purchase, Transaction } from "./transaction-types";
import transactionService from "./transaction-service";
import ProductsCatalogue from "../products/products-catalogue";
import { IProduct, Product } from "../products/product-types";
import ReactDatePicker from "react-datepicker";
import { inputStyle } from "../styles/form-styles";
import { buttonStyle, deleteButtonStyle } from "../styles/button-styles";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TimePicker from "./time-picker";
import converTime from "./convert-time";

type ProductToDisplay = {
  id: string;
  name: string;
  quantity: number;
};

const NewTransactionPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [hours, setHours] = useState<string>("00");
  const [minutesm, setMinutes] = useState<string>("00");
  const [productsToDisplay, setProductsToDisplay] = useState<
    ProductToDisplay[]
  >([]);
  const navigate = useNavigate();

  const handlePush = async (product: Product) => {
    const productToDisplay = {
      id: product.id,
      name: product.name,
      quantity: 1,
    };
    if (
      productsToDisplay.some(
        (product: ProductToDisplay) => product.id === productToDisplay.id,
      )
    )
      return;
    setProductsToDisplay([...productsToDisplay, productToDisplay]);
  };

  const handleSubmit = async () => {
    try {
      const products: Purchase[] = [];
      productsToDisplay.map((product: ProductToDisplay) => {
        products.push({ productId: product.id, quantity: product.quantity });
      });
      const newTransaction: ITransaction = {
        date,
        products,
      };
      toast("обробка запиту...");
      await transactionService.createTransaction(newTransaction);
      toast.success("транзацію успішно створено");
      setProductsToDisplay([]);
    } catch(error: any) {
      if(error.status = 401) toast.error("ви маєете бути авторизованими!");
      else toast.error(error.message);
    }
  };

  const handleQuantityChange = (e: any) => {
    const { id, value } = e.target;
    const tempArray = productsToDisplay;
    const index = tempArray.findIndex(
      (element: ProductToDisplay) => element.id === id,
    );
    productsToDisplay[index].quantity = Number(value);
    setProductsToDisplay([...tempArray]);
  };

  const handleDelete = (index: number) => {
    const temp = productsToDisplay;
    temp.splice(index, 1);
    setProductsToDisplay([...temp]);
  };

  const handleTimeChange = (hours: string, minutes: string) => {
    const newDate = converTime(hours, minutes, date);
    setDate(newDate);
  };

  return (
    <div className="flex flex-col gap-3">
      <ToastContainer />
      <div className="flex justify-center text text-2xl font-bold">
        додання чеку
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-center gap-2">
          <div>Дата замовлення</div>
          <ReactDatePicker
            className={inputStyle}
            dateFormat="dd/MM/yyyy"
            selected={date}
            onChange={(date: Date) => setDate(date)}
            locale={"ua"}
          />
          <TimePicker defaultHour="00" onChange={handleTimeChange}/>
        </div>
        <div className="flex flex-col py-3">
          <div className="flex justify-center">Замовлені страви:</div>
          <div className="flex justify-center">
            {(productsToDisplay.length > 0 && (
              <table className="w-1/3">
                <tr>
                  <th className="border-2">Страва</th>
                  <th className="border-2">Кількість порцій</th>
                </tr>
                {productsToDisplay.map(
                  (product: ProductToDisplay, i: number) => {
                    return (
                      <tr key={i}>
                        <td className="border-2 p-2">
                          <div className="flex justify-center">
                            {product.name}
                          </div>
                        </td>
                        <td className="border-2 p-2">
                          <div className="flex justify-center">
                            <input
                              className={inputStyle}
                              min={1}
                              id={product.id}
                              type="number"
                              value={product.quantity}
                              onChange={handleQuantityChange}
                            />
                          </div>
                        </td>
                        <td className="p-2">
                          <button
                            className={deleteButtonStyle}
                            onClick={() => handleDelete(i)}
                            type="button"
                          >
                            прибрати
                          </button>
                        </td>
                      </tr>
                    );
                  },
                )}
              </table>
            )) || <div>ви поки що не страв страв до замовлення</div>}
          </div>
        </div>
        <div className="flex justify-center">
          <button className={buttonStyle} type="button" onClick={handleSubmit}>
            додати чек
          </button>
        </div>
        <div className="flex justify-center flex-col gap-2 mt-10">
          <div className="text-center text-xl">
            оберіть товари, що входитимуть до замовлення:
          </div>
          <ProductsCatalogue isPicker onPick={handlePush} />
        </div>
      </div>
    </div>
  );
};

export default NewTransactionPage;

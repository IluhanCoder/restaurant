import { useEffect, useState } from "react";
import { Characteristic, IProduct } from "./product-types";
import CharacteristicsMapper from "./characteristics-mapper";
import productService, { newProductRequestData } from "./product-service";
import { cardStyle } from "../styles/card-styles";
import { buttonStyle, deleteButtonStyle } from "../styles/button-styles";
import { inputStyle } from "../styles/form-styles";
import { ToastContainer, toast } from "react-toastify";

const NewProductPage = () => {
  const defaultImage = process.env.REACT_APP_IMAGE_PLACEHOLDER!;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [avatar, setAvatar] = useState<File | undefined>();
  const [imgURL, setImgURL] = useState<string>(defaultImage);
  const [avatarSet, setAvatarSet] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);

  const defaultCharacteristic = { key: "", value: "" };
  const [currentCharacteristic, setCurrentCharacteristic] =
    useState<Characteristic>(defaultCharacteristic);

  useEffect(() => {
    if (avatar) setImgURL(URL.createObjectURL(avatar));
    else setImgURL(process.env.REACT_APP_IMAGE_PLACEHOLDER!);
  }, [avatar]);

  const characteristicValidation = () =>
    currentCharacteristic.value.length > 0 &&
    currentCharacteristic.key.length > 0;

  const handleCharacteristicLabel = (newKey: string) => {
    if (currentCharacteristic) {
      const newCharacteristic = {
        key: newKey,
        value: currentCharacteristic?.value,
      };
      setCurrentCharacteristic(newCharacteristic);
    }
  };

  const handleCharacteristicValue = (newValue: string) => {
    if (currentCharacteristic) {
      const newCharacteristic = {
        key: currentCharacteristic?.key,
        value: newValue,
      };
      setCurrentCharacteristic(newCharacteristic);
    }
  };

  const handleCharacteristicPush = () => {
    characteristicValidation();
    setCharacteristics([...characteristics, currentCharacteristic]);
    setCurrentCharacteristic({ key: "", value: "" });
  };

  const handleNewImage = (files: FileList | null) => {
    if (!files) return;
    const file: File = files[0];
    if (!file) return;
    setAvatar(file);
    setAvatarSet(true);
  };

  const dropImage = () => {
    setAvatar(undefined);
    setAvatarSet(false);
  };

  const dropInput = () => {
    setAvatar(undefined);
    setImgURL(defaultImage);
    setName("");
    setCategory("");
    setDescription("");
    setPrice(0);
    setCharacteristics([]);
    setCurrentCharacteristic(defaultCharacteristic);
    setAvatarSet(false);
  };

  const handleSubmit = async () => {
    try {
      if(!(name.length > 0 && description.length > 0 && category.length > 0 && characteristics.length > 0 && avatarSet)) {
        toast.error("Усі поля мають бути заповненими");
        return;
      }
      const newProduct: IProduct = {
        name,
        description,
        category,
        price,
        characteristics,
      };
      setIsLoading(true);
      await productService.newProduct(newProduct, avatar!);
      toast.success("товар було успішно створено");
      dropInput();
      setIsLoading(false);
    } catch(error: any) {
      if(error.status = 401) toast.error("ви маєете бути авторизованими!");
      else toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      {(!isLoading && (
        <div className="flex flex-col py-4 gap-4">
          <div className="text-3xl text-center">
            Додання інформації про продукт
          </div>
          <div className="flex justify-center">
            <form className={cardStyle + "flex flex-col p-4"}>
              <div>
                <div className="flex justify-center pb-4">
                  <img className="w-72" src={imgURL} />
                </div>
                <div className="flex justify-center py-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-center gap-3">
                      <label>Зображення продукту:</label>
                      <input
                        type="file"
                        onChange={(e) => handleNewImage(e.target.files)}
                        id="fileInput"
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        className={deleteButtonStyle}
                        onClick={dropImage}
                      >
                        Прибрати зображення
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 py-5">
                <div className="flex gap-2 justify-center">
                  <label>Назва:</label>
                  <input
                    type="text"
                    className={inputStyle + " w-72"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </div>
                <div className="flex gap-2 justify-center">
                  <label>Категорія:</label>
                  <input
                    className={inputStyle + " w-72"}
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  ></input>
                </div>
                <div className="flex gap-2 justify-center">
                  <label>Опис:</label>
                  <input
                    type="text"
                    value={description}
                    className={inputStyle + " w-72"}
                    onChange={(e) => setDescription(e.target.value)}
                  ></input>
                </div>
                <div className="flex gap-2 justify-center">
                  <label>Ціна:</label>
                  <input
                    type="number"
                    value={price}
                    className={inputStyle + " w-72"}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  ></input>
                </div>
                <div className="flex flex-col">
                  <div className="text-center text-xl py-2">
                    Характеристики:
                  </div>
                  <div className="flex gap-3">
                    <div className="flex gap-2">
                      <label>Ключ</label>
                      <input
                        className={inputStyle + " w-36"}
                        type="text"
                        value={currentCharacteristic?.key}
                        onChange={(e) =>
                          handleCharacteristicLabel(e.target.value)
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <label>Значення</label>
                      <input
                        className={inputStyle}
                        type="text"
                        value={currentCharacteristic?.value}
                        onChange={(e) =>
                          handleCharacteristicValue(e.target.value)
                        }
                      />
                    </div>
                    <button
                      className={buttonStyle}
                      type="button"
                      onClick={handleCharacteristicPush}
                    >
                      додати
                    </button>
                  </div>
                  <CharacteristicsMapper
                    characteristics={characteristics}
                    onRemove={(newValue: Characteristic[]) => {
                      setCharacteristics([...newValue]);
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  className={buttonStyle}
                  type="button"
                  onClick={handleSubmit}
                >
                  Створити товар
                </button>
              </div>
            </form>
          </div>
        </div>
      )) || (
        <div className="flex justify-center p-48 text-4xl font-bold">
          обробка запиту...
        </div>
      )}
    </>
  );
};

export default NewProductPage;

import Modal from "react-modal";
import InputMask from "react-input-mask";

import styles from "./styles.module.css";
import { FiX } from "react-icons/fi";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { setupAPIClient } from "../../../util/api";
import Util from "../../../util/Util";
import { NumericFormat } from "react-number-format";

interface ModalExpenseProps {
  isOpen: boolean;
  construction_id: number;
  onRequestClose: () => void;
  types: TypeExpense[];
}

export type TypeExpense = {
  id: number;
  name: string;
};

export function ModalAddExpense({
  isOpen,
  construction_id,
  onRequestClose,
  types,
}: ModalExpenseProps) {
  const [date, setDate] = useState("");
  const [value, setExpense] = useState("");
  const [type, setType] = useState("");

  const customStyles = {
    content: {
      top: "50%",
      bottom: "auto",
      left: "50%",
      right: "auto",
      padding: "30px",
      backgroundColor: "#fff",
      transform: "translate(-50%,-50%)",
      boxShadow: "0px 0px 10px 0px var(--gray-400)",
    },
  };

  async function handleFormAddExpenseSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (date === "" || value === "" || type === "")
        throw new Error("Preencha todos os campos");

      const apiClient = setupAPIClient();
      let response = await apiClient.post("/expense/add", {
        date,
        value: Util.getOnlyNumbers(value),
        type,
        construction_id,
      });

      if (response.status == 200) {
        toast.success("Despesa Inserida com sucesso!");
        onRequestClose();
      } else {
        toast.error("Não foi possível adicionar a despesa!");
      }
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <div className="modalHeader">
        <h1>+ Nova Despesa</h1>
        <button
          type="button"
          onClick={onRequestClose}
          className="react-modal-close"
          style={{ boxShadow: "none" }}
        >
          <FiX size={20} color="var(--blue-600)" />
        </button>
      </div>
      <form className="modalForm" onSubmit={handleFormAddExpenseSubmit}>
        <div className="formLine2">
          <div>
            <label htmlFor="dateStart">Data:</label>
            <InputMask
              mask="99/99/9999"
              id="date"
              name="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
              placeholder="Data da despesa"
            />
          </div>
          <div>
            <label htmlFor="budget">Despesa (R$):</label>
            <NumericFormat
              id="value"
              name="value"
              value={value}
              allowNegative={false}
              decimalScale={2}
              decimalSeparator=","
              thousandSeparator="."
              prefix={"R$"}
              onChange={(e) => {
                setExpense(e.target.value);
              }}
              placeholder="Valor"
            />
          </div>
        </div>
        <div className="formLine">
          <label htmlFor="budget">Natureza:</label>
          <select
            id="type"
            name="type"
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            {types.map((item, index) => {
              return (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="modalFooter">
          <button type="submit" className="btPrimary">
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}

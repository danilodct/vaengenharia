import Modal from "react-modal";

import { FiX } from "react-icons/fi";
import { FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";
import { setupAPIClient } from "../../../util/api";
import { Textarea } from "../../ui/Input";
import { AuthContext } from "../../../util/AuthContext";
import Util from "../../../util/Util";
import { NumericFormat } from "react-number-format";
import Router from "next/router";

export function ModalBuyOrderRequest({
  isOpen,
  orderId,
  onRequestClose,
}: ModalBuyOrderRequestProps) {
  const { user } = useContext(AuthContext);
  const [value, setValue] = useState("");
  const [provider, setProvider] = useState("");
  const [value2, setValue2] = useState("");
  const [provider2, setProvider2] = useState("");
  const [value3, setValue3] = useState("");
  const [provider3, setProvider3] = useState("");
  const [note, setNote] = useState("");

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

  async function handleFormBuyOrderRequestSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (value === "" || provider === "")
        throw new Error("Preencha todos os campos");

      const apiClient = setupAPIClient();
      let response = await apiClient.post("/orderrequest/buy", {
        value: parseFloat(Util.getOnlyNumbers(value)),
        provider,
        value2: parseFloat(Util.getOnlyNumbers(value2)),
        provider2,
        value3: parseFloat(Util.getOnlyNumbers(value3)),
        provider3,
        note,
        userId: user.id,
        orderId,
      });

      if (response.status == 200) {
        toast.success(Util.MSG_SUCESS_PURCHASE_ADD);
        Router.replace(`/orderrequest/detail?id=${orderId}`);
        onRequestClose();
      } else {
        toast.error(Util.MSG_ERROR_PURCHASE_ADD);
      }
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <div className="modalHeader">
        <h1>+ Efetivar Compra</h1>
        <button
          type="button"
          onClick={onRequestClose}
          className="react-modal-close"
          style={{ boxShadow: "none" }}
        >
          <FiX size={20} color="var(--blue-600)" />
        </button>
      </div>
      <form className="modalForm" onSubmit={handleFormBuyOrderRequestSubmit}>
        <div className="formLine2">
          <div>
            <label htmlFor="value">Valor da Compra (R$):</label>
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
                setValue(e.target.value);
              }}
              placeholder="Valor da compra"
            />
          </div>
          <div>
            <label htmlFor="provider">Fornecedor Vencedor:</label>
            <input
              type="text"
              id="provider"
              name="provider"
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
              }}
              placeholder="Informe o Fornecedor Vencedor"
            />
          </div>
        </div>
        <div className="formLine2">
          <div>
            <label htmlFor="value2">Valor da Cotação 02 (R$):</label>
            <NumericFormat
              id="value2"
              name="value2"
              value={value2}
              allowNegative={false}
              decimalScale={2}
              decimalSeparator=","
              thousandSeparator="."
              prefix={"R$"}
              onChange={(e) => {
                setValue2(e.target.value);
              }}
              placeholder="Valor da cotação 02"
            />
          </div>
          <div>
            <label htmlFor="provider2">Fornecedor da Cotação 02:</label>
            <input
              type="text"
              id="provider2"
              name="provider2"
              value={provider2}
              onChange={(e) => {
                setProvider2(e.target.value);
              }}
              placeholder="Informe o Fornecedor da Cotação 02"
            />
          </div>
        </div>
        <div className="formLine2">
          <div>
            <label htmlFor="value3">Valor da Cotação 03 (R$):</label>

            <NumericFormat
              id="value3"
              name="value3"
              value={value3}
              allowNegative={false}
              decimalScale={2}
              decimalSeparator=","
              thousandSeparator="."
              prefix={"R$"}
              onChange={(e) => {
                setValue3(e.target.value);
              }}
              placeholder="Valor da cotação 03"
            />
          </div>
          <div>
            <label htmlFor="provider3">Fornecedor da Cotação 03:</label>
            <input
              type="text"
              id="provider3"
              name="provider3"
              value={provider3}
              onChange={(e) => {
                setProvider3(e.target.value);
              }}
              placeholder="Informe o Fornecedor da Cotação 03"
            />
          </div>
        </div>
        <div>
          <label htmlFor="note">Observação:</label>
          <Textarea
            id="note"
            name="note"
            onChange={(e) => {
              setNote(e.target.value);
            }}
            placeholder="Caso necessite, informe algo relevante sobre a compra"
          />
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

interface ModalBuyOrderRequestProps {
  isOpen: boolean;
  orderId: number;
  onRequestClose: () => void;
}

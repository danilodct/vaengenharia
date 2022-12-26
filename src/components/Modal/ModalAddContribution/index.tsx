import Modal from "react-modal";
import InputMask from "react-input-mask";

import styles from "./styles.module.css";
import { FiX } from "react-icons/fi";
import { Input } from "../../ui/Input";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { setupAPIClient } from "../../../util/api";
import Util from "../../../util/Util";
import Router from "next/router";
import { NumericFormat } from "react-number-format";

interface ModalContributionProps {
  isOpen: boolean;
  construction_id: number;
  onRequestClose: () => void;
}

export function ModalAddContribution({
  isOpen,
  construction_id,
  onRequestClose,
}: ModalContributionProps) {
  const [date, setDate] = useState("");
  const [contribution, setContribution] = useState("");

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

  async function handleFormAddContributionSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (date === "" || contribution === "")
        throw new Error("Preencha todos os campos");

      const apiClient = setupAPIClient();
      let response = await apiClient.post("/contribution/add", {
        date,
        contribution: Util.getOnlyNumbers(contribution),
        construction_id,
      });

      if (response.status == 200) {
        toast.success("Aporte Inserido com sucesso!");
        onRequestClose();
      } else {
        toast.error("Não foi possível adicionar o aporte!");
      }
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <div className="modalHeader">
        <h1>+ Novo Aporte</h1>
        <button
          type="button"
          onClick={onRequestClose}
          className="react-modal-close"
          style={{ boxShadow: "none" }}
        >
          <FiX size={20} color="var(--blue-600)" />
        </button>
      </div>
      <form className="modalForm" onSubmit={handleFormAddContributionSubmit}>
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
              placeholder="Data do aporte"
            />
          </div>
          <div>
            <label htmlFor="budget">Aporte (R$):</label>
            <NumericFormat
              id="contribution"
              name="contribution"
              value={contribution}
              allowNegative={false}
              decimalScale={2}
              decimalSeparator=","
              thousandSeparator="."
              prefix={"R$"}
              onChange={(e) => {
                setContribution(e.target.value);
              }}
              placeholder="Valor do Aporte"
            />
          </div>
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

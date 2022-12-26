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

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function ModalAddConstruction({ isOpen, onRequestClose }: ModalProps) {
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

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

  async function handleFormAddConstructionSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (
        name === "" ||
        clientName === "" ||
        dateStart === "" ||
        dateEnd === ""
      )
        throw new Error("Preencha todos os campos");

      const apiClient = setupAPIClient();
      let response = await apiClient.post("/construction/add", {
        name,
        clientName,
        dateStart,
        dateEnd,
      });
      const newId = response.data.id;

      // const newId=33;

      toast.success("Obra criada com sucesso!");

      Router.replace(`/construction/edit?id=${newId}`);
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <div className="modalHeader">
        <h1>+ Nova Obra</h1>
        <button
          type="button"
          onClick={onRequestClose}
          className="react-modal-close"
          style={{ boxShadow: "none" }}
        >
          <FiX size={20} color="var(--blue-600)" />
        </button>
      </div>
      <form className="modalForm" onSubmit={handleFormAddConstructionSubmit}>
        <div className="formLine">
          <label htmlFor="name">Nome:</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Informe o nome da Obra"
          />
        </div>
        <div className="formLine">
          <label htmlFor="clientName">Cliente:</label>
          <Input
            type="text"
            id="clientName"
            name="clientName"
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value);
            }}
            placeholder="Nome do Cliente"
          />
        </div>
        <div className="formLine2">
          <div>
            <label htmlFor="dateStart">Data Início:</label>
            <InputMask
              mask="99/99/9999"
              id="dateStart"
              name="dateStart"
              value={dateStart}
              onChange={(e) => {
                setDateStart(e.target.value);
              }}
              placeholder="Início da Obra"
            />
          </div>
          <div>
            <label htmlFor="dateEnd">Data Fim:</label>
            <InputMask
              mask="99/99/9999"
              id="dateEnd"
              name="dateEnd"
              value={dateEnd}
              onChange={(e) => {
                setDateEnd(e.target.value);
              }}
              placeholder="Fim da Obra"
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

import Modal from "react-modal";

import styles from "./styles.module.css";
import { FiX } from "react-icons/fi";
import { FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";
import { setupAPIClient } from "../../../util/api";
import { TypeExpense } from "../ModalAddExpense";
import { Textarea } from "../../ui/Input";
import { AuthContext } from "../../../util/AuthContext";
import { ItemConstruction } from "../../../pages/construction/detail";
import Util from "../../../util/Util";
import Router from "next/router";

interface ModalOrderRequestProps {
  isOpen: boolean;
  construction_id: number;
  onRequestClose: () => void;
  constructions: ItemConstruction[];
  types: TypeExpense[];
}

export function ModalAddOrderRequest({
  isOpen,
  construction_id,
  onRequestClose,
  constructions,
  types,
}: ModalOrderRequestProps) {
  const { user } = useContext(AuthContext);
  const [ammount, setAmmount] = useState("");
  const [type, setType] = useState("");
  const [construction, setConstruction] = useState("");
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

  async function handleFormAddOrderRequestSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      if (
        ammount === "" ||
        type === "" ||
        (construction_id == null && construction == "")
      )
        throw new Error("Preencha todos os campos");

      if (constructions) construction_id = Util.parseInt(construction);

      const apiClient = setupAPIClient();
      let response = await apiClient.post("/orderrequest/add", {
        ammount,
        type,
        note,
        user_id: user.id,
        construction_id,
      });

      if (response.status == 200) {
        toast.success("Requisição inserida com sucesso!");
        Router.replace(`/orderrequest/detail?id=${response.data.id}`);
      } else {
        toast.error("Não foi possível adicionar a requisição!");
      }
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <div className="modalHeader">
        <h1>+ Nova Requisição</h1>
        <button
          type="button"
          onClick={onRequestClose}
          className="react-modal-close"
          style={{ boxShadow: "none" }}
        >
          <FiX size={20} color="var(--blue-600)" />
        </button>
      </div>
      <form className="modalForm" onSubmit={handleFormAddOrderRequestSubmit}>
        {!construction_id && (
          <div>
            <label htmlFor="type">Obra:</label>
            <select
              id="constructionIdFor"
              name="constructionIdFor"
              onChange={(e) => {
                setConstruction(e.target.value);
              }}
            >
              <option>Selecione uma obra</option>
              {constructions.map((item, index) => {
                return (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        <div className="formLine">
          <label htmlFor="ammount">Quantidade:</label>
          <input
            type="number"
            id="ammount"
            name="ammount"
            value={ammount}
            onChange={(e) => {
              setAmmount(e.target.value);
            }}
            placeholder="Quantidade de itens"
          />
        </div>
        <div>
          <label htmlFor="type">Item Solitcitado:</label>
          <select
            id="type"
            name="type"
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <option>Selecione um tipo</option>
            {types.map((item, index) => {
              return (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="note">Observação:</label>
          <Textarea
            id="note"
            name="note"
            onChange={(e) => {
              setNote(e.target.value);
            }}
            placeholder="Justifique ou detalhe sua solicitação"
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

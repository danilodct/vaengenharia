import styles from "./styles.module.css";
import Modal from "react-modal";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { useState } from "react";
import { ModalAddContribution } from "../Modal/ModalAddContribution";
import { ItemContribution } from "../../pages/construction/detail";
import Util from "../../util/Util";
import { BsTrash } from "react-icons/bs";
import { setupAPIClient } from "../../util/api";
import { toast } from "react-toastify";

export function Contributions({
  construction_id,
  contributions,
}: IContributions) {
  const [modalVisible, setModalVisible] = useState(false);
  const [contributionsList, setContributionsList] = useState(
    contributions || null
  );

  Modal.setAppElement("#__next");

  function handleOpenModal() {
    setModalVisible(true);
  }

  async function handleCloseModal() {
    setModalVisible(false);
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/contribution/list", {
      params: { construction_id: construction_id },
    });
    setContributionsList(response.data);
  }

  async function handleBtRemoveContribution(id) {
    if (confirm(Util.MSG_SURE_REMOVE_CONTRIBUTION)) {
      const apiClient = setupAPIClient();
      let response = await apiClient.delete("/contribution/delete", {
        params: { id },
      });
      if (response.status == 200) {
        toast.success(response.data);
        response = await apiClient.get("/contribution/list", {
          params: { construction_id: construction_id },
        });
        setContributionsList(response.data);
      } else {
        toast.error(response.data);
      }
    }
  }

  function getTotalContributions() {
    let total = 0;
    for (let i = 0; i < contributionsList.length; i += 1) {
      total += parseInt(contributionsList[i].contribution);
    }
    return Util.formatCurrencyStr(total.toString());
  }

  return (
    <div>
      <h1 className={styles.header}>
        <RiMoneyDollarCircleFill
          color="green"
          size={25}
          className={styles.cashIcon}
        />
        Aportes do cliente
      </h1>
      <div className={styles.areaBts}>
        <h2 className={styles.total}>Total: {getTotalContributions()}</h2>
        <button onClick={handleOpenModal} className="btPrimary">
          + Novo
        </button>
      </div>
      <div className={styles.areaContributionTable}>
        <table className="tableList">
          <thead>
            <tr>
              <th>#</th>
              <th>DATA</th>
              <th>VALOR</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {contributionsList.length == 0 && (
              <tr>
                <td colSpan={4} className="infoNoData">
                  Nenhum aporte feito!
                </td>
              </tr>
            )}
            {contributionsList.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{Util.parseDateStrFromUSA(item.date.toString())}</td>
                  <td>{Util.formatCurrencyStr(item.contribution)}</td>
                  <td>
                    <button
                      className="btRemove"
                      onClick={() => handleBtRemoveContribution(item.id)}
                      value={item.id}
                    >
                      <BsTrash size={16} color="red" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modalVisible && (
        <ModalAddContribution
          isOpen={modalVisible}
          construction_id={construction_id}
          onRequestClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export interface IContributions {
  construction_id: number;
  contributions: ItemContribution[];
}

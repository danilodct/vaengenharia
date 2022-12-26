import styles from "./styles.module.css";
import Modal from "react-modal";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";
import { ItemExpense } from "../../pages/construction/detail";
import { useState } from "react";
import { setupAPIClient } from "../../util/api";
import Util from "../../util/Util";
import { toast } from "react-toastify";
import { ModalAddExpense, TypeExpense } from "../Modal/ModalAddExpense";

export function Expenses({ construction_id, expenses, types }: IExpenses) {
  const [modalVisible, setModalVisible] = useState(false);
  const [expensesList, setExpensesList] = useState(expenses || null);

  Modal.setAppElement("#__next");

  function handleOpenModal() {
    setModalVisible(true);
  }

  async function handleCloseModal() {
    setModalVisible(false);
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/expense/list", {
      params: { construction_id: construction_id },
    });
    setExpensesList(response.data);
  }

  async function handleBtRemoveExpense(id) {
    if (confirm(Util.MSG_SURE_REMOVE_ITEM)) {
      const apiClient = setupAPIClient();
      let response = await apiClient.delete("/expense/delete", {
        params: { id },
      });
      if (response.status == 200) {
        toast.success(response.data);
        response = await apiClient.get("/expense/list", {
          params: { construction_id: construction_id },
        });
        setExpensesList(response.data);
      } else {
        toast.error(response.data);
      }
    }
  }

  function getTotalExpenses() {
    let total = 0;
    for (let i = 0; i < expensesList.length; i += 1) {
      total += expensesList[i].value;
    }
    return Util.formatCurrencyStr(total.toString());
  }
  return (
    <div>
      <h1 className={styles.header}>
        <RiMoneyDollarCircleFill
          color="red"
          size={25}
          className={styles.cashIcon}
        />
        Despesas da Obra
      </h1>
      <div className={styles.areaBts}>
        <h2 className={styles.total}>Total: {getTotalExpenses()}</h2>
        <button onClick={handleOpenModal} className="btPrimary">
          + Nova
        </button>
      </div>
      <div className={styles.areaExpensesTable}>
        <table className="tableList">
          <thead>
            <tr>
              <th>#</th>
              <th>DATA</th>
              <th>Natureza</th>
              <th>VALOR</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {expensesList.length == 0 && (
              <tr>
                <td colSpan={5} className="infoNoData">
                  Nenhuma despesa registrada!
                </td>
              </tr>
            )}
            {expensesList.map((item: ItemExpense, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{Util.parseDateStrFromUSA(item.date.toString())}</td>
                  <td>{item.type.name}</td>
                  <td>{Util.formatCurrency(item.value)}</td>
                  <td>
                    <button
                      className="btRemove"
                      onClick={() => handleBtRemoveExpense(item.id)}
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
        <ModalAddExpense
          isOpen={modalVisible}
          construction_id={construction_id}
          onRequestClose={handleCloseModal}
          types={types}
        />
      )}
    </div>
  );
}

export interface IExpenses {
  construction_id: number;
  expenses: ItemExpense[];
  types: TypeExpense[];
}

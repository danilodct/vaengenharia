import styles from "./styles.module.css";
import Modal from "react-modal";
import { FaTasks } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import { useContext, useState } from "react";
import { setupAPIClient } from "../../util/api";
import Util from "../../util/Util";
import { toast } from "react-toastify";
import { ModalAddOrderRequest } from "../Modal/ModalAddOrderRequest";
import { TypeExpense } from "../Modal/ModalAddExpense";
import { GoPrimitiveDot } from "react-icons/go";
import { AuthContext, UserType } from "../../util/AuthContext";
import Link from "next/link";
import { AiOutlineEye } from "react-icons/ai";
import { ItemConstruction } from "../../pages/construction/detail";

export function OrderRequests({
  construction_id,
  types,
  orderRequestsList,
}: IOrderRequests) {
  const { user } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderRequests, setOrderRequests] = useState(orderRequestsList || null);

  Modal.setAppElement("#__next");

  function handleOpenModal() {
    setModalVisible(true);
  }

  async function handleCloseModal() {
    setModalVisible(false);
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/orderrequest/list", {
      params: { construction_id: construction_id },
    });
    setOrderRequests(response.data);
  }

  async function handleBtRemoveExpense(id) {
    if (confirm(Util.MSG_SURE_REMOVE_ITEM)) {
      const apiClient = setupAPIClient();
      let response = await apiClient.delete("/orderrequest/delete", {
        params: { id },
      });
      if (response.status == 200) {
        toast.success(response.data);
        response = await apiClient.get("/orderrequest/list", {
          params: { construction_id: construction_id },
        });
        setOrderRequests(response.data);
      } else {
        toast.error(response.data);
      }
    }
  }

  return (
    <div>
      <h1 className={styles.header}>
        <FaTasks color="#547980" size={25} className={styles.cashIcon} />
        Requisições de Compra
      </h1>
      <div className={styles.areaBts}>
        <h2 className={styles.total}> </h2>
        {user.type != Util.USER_TYPE_SEC && (
          <button onClick={handleOpenModal} className="btPrimary">
            + Nova
          </button>
        )}
      </div>
      <div className={styles.areaExpensesTable}>
        <table className="tableList">
          <thead>
            <tr>
              <th>#</th>
              <th>Situação</th>
              <th>Solicitante</th>
              <th>Data Solicitação</th>
              <th>Quantidade</th>
              <th>Natureza</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {orderRequests.length == 0 && (
              <tr>
                <td colSpan={7} className="infoNoData">
                  Nenhuma requisição registrada!
                </td>
              </tr>
            )}
            {orderRequests.map((item: OrderRequestItem, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {item.done && <GoPrimitiveDot color="green" size={20} />}
                    {!item.done && <GoPrimitiveDot color="red" size={20} />}
                  </td>
                  <td>
                    <Link href={`/orderrequest/detail?id=${item.id}`}>
                      <a className="btAction">{item.user.name}</a>
                    </Link>
                  </td>
                  <td>{Util.parseDateFromUSA(item.dateCreate)}</td>
                  <td>{item.ammount}</td>
                  <td>{item.type.name}</td>
                  <td className="actionsCol">
                    <Link href={`/orderrequest/detail?id=${item.id}`}>
                      <a className="btAction">
                        <AiOutlineEye size={16} color="var(--blue-600)" />
                      </a>
                    </Link>
                    {user.id == item.user.id && !item.done && (
                      <button
                        className="btRemove"
                        onClick={() => handleBtRemoveExpense(item.id)}
                        value={item.id}
                      >
                        <BsTrash size={16} color="red" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modalVisible && (
        <ModalAddOrderRequest
          isOpen={modalVisible}
          construction_id={construction_id}
          onRequestClose={handleCloseModal}
          constructions={null}
          types={types}
        />
      )}
    </div>
  );
}

export interface IOrderRequests {
  construction_id: number;
  types: TypeExpense[];
  orderRequestsList: OrderRequestItem[];
}

export type OrderRequestItem = {
  id: number;
  done: boolean;
  dateCreate: Date;
  ammount: number;
  type: TypeExpense;
  user: UserType;
  note: string;
  dateDone: Date;
  construction: ItemConstruction;
  purchase: ItemPurchase;
};

export type ItemPurchase = {
  id: number;
  value: number;
  provider: string;
  value2: number;
  provider2: string;
  value3: number;
  provider3: string;
  note: string;
  datePurchase: Date;
};

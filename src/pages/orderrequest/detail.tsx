import Head from "next/head";
import styles from "./styles.module.css";
import { useState } from "react";

import { Header } from "../../components/Header";
import { Menu } from "../../components/Menu";
import { OrderRequestItem } from "../../components/OrderRequests";
import { canSSRAuth } from "../../util/canSSRAuth";
import { setupAPIClient } from "../../util/api";
import Util from "../../util/Util";
import { GoPrimitiveDot } from "react-icons/go";
import { toast } from "react-toastify";
import Router from "next/router";
import { ModalBuyOrderRequest } from "../../components/Modal/ModalBuyOrderRequest";
import { FaTasks } from "react-icons/fa";

export interface OrderRequestProps {
  item: OrderRequestItem;
  userId: number;
  userType: string;
}

export default function OrderRequestDetail({
  item,
  userId,
  userType,
}: OrderRequestProps) {
  const [modalVisible, setModalVisible] = useState(false);

  async function handleCloseModal() {
    setModalVisible(false);
  }

  function handleOpenModal() {
    setModalVisible(true);
  }
  async function handleBtRemove(e) {
    const apiClient = setupAPIClient();
    try {
      if (confirm(Util.MSG_SURE_REMOVE_ITEM)) {
        const response = await apiClient.delete("/orderrequest/delete", {
          params: { id: item.id },
        });

        if (response.status == 200) {
          toast.success(response.data);
          Router.replace("/orderrequest/list");
        } else {
          toast.error(Util.ERROR_REMOVE_ITEM);
        }
      }
    } catch (e) {
      toast.error(Util.ERROR_REMOVE_ITEM);
    }
  }

  return (
    <div className="containerMor">
      <Head>
        <title>VA Engenharia - Requisição de Compra - {item.type.name}</title>
      </Head>
      <div className="container">
        <Header />
        <div className="containerBottom">
          <Menu atual="orderRequest" />
          <div className="main">
            <div className="modalHeader">
              <h1>Requisição de Compra: {item.type.name}</h1>
            </div>
            <div className="formLine">
              <div className="inputFake noBorder ">
                <label>
                  {item.done && <GoPrimitiveDot color="green" size={20} />}
                  {!item.done && <GoPrimitiveDot color="red" size={20} />}
                  {item.done && "Concluída"}
                  {!item.done && "Pendente"}
                </label>
              </div>
            </div>
            <div className="formLine">
              <label>Obra:</label>
              <div className="inputFake">{item.construction.name}</div>
            </div>
            <div className="formLine3">
              <div>
                <label>Solicitante:</label>
                <div className="inputFake">{item.user.name}</div>
              </div>
              <div>
                <label>Data da Solicitação:</label>
                <div className="inputFake">
                  {Util.parseDateFromUSA(item.dateCreate)}
                </div>
              </div>
              <div>
                <label>Quantidade:</label>
                <div className="inputFake">{item.ammount}</div>
              </div>
            </div>
            <div className="formLine">
              <label>Tipo do item:</label>
              <div className="inputFake">{item.type.name}</div>
            </div>
            <div className="formLine">
              <label>Observação:</label>
              <div className="inputFake">{item.note}</div>
            </div>
            <div className="modalFooter">
              {!item.done &&
                (userType == Util.USER_TYPE_DIR ||
                  userType == Util.USER_TYPE_SEC) && (
                  <button onClick={handleOpenModal} className="btGreen">
                    Efetivar Compra
                  </button>
                )}
              {!item.done &&
                (userType == Util.USER_TYPE_DIR ||
                  userType == Util.USER_TYPE_SEC ||
                  userId == item.user.id) && (
                  <button onClick={handleBtRemove} className="btSecundary">
                    Remover
                  </button>
                )}
            </div>
            {item.done && (
              <div className="areaPurchase">
                <h1 className={styles.header}>
                  <FaTasks
                    color="#547980"
                    size={25}
                    className={styles.cashIcon}
                  />
                  Dados da Compra
                </h1>
                <div className="formLine3">
                  <div>
                    <label>Data da compra:</label>
                    <div className="inputFake">
                      {Util.parseDateFromUSA(item.purchase.datePurchase)}
                    </div>
                  </div>
                  <div>
                    <label>Valor da compra:</label>
                    <div className="inputFake">
                      {Util.formatCurrency(item.purchase.value)}
                    </div>
                  </div>
                  <div>
                    <label>Fornecedor:</label>
                    <div className="inputFake">{item.purchase.provider}</div>
                  </div>
                </div>
                <div className="formLine2">
                  <div>
                    <label>Valor da cotação 02:</label>
                    <div className="inputFake">
                      {Util.formatCurrency(item.purchase.value2)}
                    </div>
                  </div>
                  <div>
                    <label>Fornecedor cotação 02:</label>
                    <div className="inputFake">{item.purchase.provider2}</div>
                  </div>
                </div>
                <div className="formLine2">
                  <div>
                    <label>Valor da cotação 03:</label>
                    <div className="inputFake">
                      {Util.formatCurrency(item.purchase.value3)}
                    </div>
                  </div>
                  <div>
                    <label>Fornecedor cotação 03:</label>
                    <div className="inputFake">{item.purchase.provider3}</div>
                  </div>
                </div>
                <div className="formLine">
                  <label>Fornecedor cotação 03:</label>
                  <div className="inputFake">{item.purchase.note}</div>
                </div>
              </div>

              // note            String?
              // datePurchase    DateTime
            )}
          </div>
        </div>
      </div>
      {modalVisible && (
        <ModalBuyOrderRequest
          isOpen={modalVisible}
          orderId={item.id}
          onRequestClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const id = ctx.query.id;
    const apiClient = setupAPIClient(ctx);
    let response = await apiClient.get("/orderrequest/detail", {
      params: { id: id },
    });

    if (!response.data) {
      return {
        redirect: {
          destination: "/orderrequest/list",
          permanent: false,
        },
      };
    }

    const userResponse = await apiClient.get("/me");
    const userId = userResponse.data.id;
    const userType = userResponse.data.type;

    return {
      props: {
        item: response.data,
        userId: userId,
        userType: userType,
      },
    };
  } catch (e) {
    Util.printError(e);
    return {
      redirect: {
        destination: "/orderrequest/list",
        permanent: false,
      },
    };
  }
});

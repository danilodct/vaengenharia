import { useState } from "react";
import Head from "next/head";
import Modal from "react-modal";
import { GoPrimitiveDot } from "react-icons/go";
import { BsTrash } from "react-icons/bs";
import { AiOutlineEye } from "react-icons/ai";

import { canSSRAuth } from "../../util/canSSRAuth";
import { setupAPIClient } from "../../util/api";
import { Header } from "../../components/Header";
import { Menu } from "../../components/Menu";
import { InputSearch } from "../../components/ui/InputSearch";
import { ModalAddOrderRequest } from "../../components/Modal/ModalAddOrderRequest";

import Util from "../../util/Util";
import { toast } from "react-toastify";
import { OrderRequestItem } from "../../components/OrderRequests";
import { TypeExpense } from "../../components/Modal/ModalAddExpense";
import Link from "next/link";
import { ItemConstruction } from "../construction/detail";

export default function OrderRequestList({
  mo_id,
  orderRequestList,
  constructions,
  types,
}: OrderRequestsProps) {
  const [orderRequests, setOrderRequests] = useState(orderRequestList || []);
  const [modalVisible, setModalVisible] = useState(false);

  Modal.setAppElement("#__next");

  function handleOpenModal() {
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
    const btAll: HTMLButtonElement = document.querySelector(".btFilterAll");
    btAll.click();
  }

  async function handleFilterAll(e) {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/orderrequest/list", {
      params: { user_id: mo_id },
    });
    resetSearchInput();
    resetFilterBts();
    e.target.classList.toggle("actived");
    setOrderRequests(response.data);
  }

  async function handleFilterDoing(e) {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/orderrequest/list", {
      params: { done: false, user_id: mo_id },
    });
    resetSearchInput();
    resetFilterBts();
    e.target.classList.toggle("actived");
    setOrderRequests(response.data);
  }

  async function handleFilterDone(e) {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/orderrequest/list", {
      params: { done: true, user_id: mo_id },
    });
    resetSearchInput();
    resetFilterBts();
    e.target.classList.toggle("actived");
    setOrderRequests(response.data);
  }

  function resetFilterBts() {
    const bts: HTMLCollection = document.getElementsByClassName("btFilter");
    for (let i = 0; i < bts.length; i++) {
      bts[i].classList.remove("actived");
    }
  }

  function resetSearchInput() {
    const inputSearch: HTMLInputElement =
      document.querySelector("#inputSearch");
    inputSearch.value = "";
  }

  async function handleSearch(e) {
    const inputSearch = e.target.value;
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/orderrequest/list", {
      params: { search: inputSearch, user_id: mo_id },
    });
    resetFilterBts();
    const bt: HTMLCollection = document.getElementsByClassName("btFilterAll");
    bt[0].classList.add("actived");
    setOrderRequests(response.data);
  }

  async function handleBtRemove(id) {
    if (confirm(Util.MSG_SURE_REMOVE_ITEM)) {
      const apiClient = setupAPIClient();
      let response = await apiClient.delete("/orderrequest/delete", {
        params: { id },
      });
      if (response.status == 200) {
        toast.success(response.data);
        response = await apiClient.get("/orderrequest/list");
        resetSearchInput();
        resetFilterBts();
        document.querySelector(".btFilterAll").classList.toggle("actived");
        setOrderRequests(response.data);
      } else {
        toast.error(response.data);
      }
    }
  }

  return (
    <div className="containerMor">
      <Head>
        <title>VA Engenharia - Requisições de Compra</title>
      </Head>
      <div className="container">
        <Header />
        <div className="containerBottom">
          <Menu atual="orderRequest" />
          <div className="main">
            <h1 className="title">Requisições de Compra</h1>

            <InputSearch
              id="inputSearch"
              placeholder="pesquise pelo nome do item solicitado"
              onChange={handleSearch}
              onSubmit={handleSearch}
            />

            <div className="areaFilterAdd">
              <div className="areaFilter">
                <button
                  className="btFilter actived btFilterAll"
                  onClick={handleFilterAll}
                >
                  Todas
                </button>
                <button className="btFilter " onClick={handleFilterDoing}>
                  Pendentes
                </button>
                <button className="btFilter" onClick={handleFilterDone}>
                  Concluídas
                </button>
              </div>
              <button className="btPrimary" onClick={handleOpenModal}>
                + Nova Requisição
              </button>
            </div>

            <div className="areaLegend">
              <GoPrimitiveDot color="green" size={20} /> Concluída
              <GoPrimitiveDot color="red" size={20} /> Pendente
            </div>

            <table className="tableList">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Situação</th>
                  <th>Obra</th>
                  <th>Solicitante</th>
                  <th>Data Solicitação</th>
                  <th>Quantidade</th>
                  <th>Item</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {orderRequests.length == 0 && (
                  <tr>
                    <td colSpan={9} className="infoNoData">
                      Nenhuma requisição encontrada
                    </td>
                  </tr>
                )}
                {orderRequests.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {item.done && (
                          <GoPrimitiveDot color="green" size={20} />
                        )}
                        {!item.done && <GoPrimitiveDot color="red" size={20} />}
                      </td>
                      <td>
                        <Link href={`/orderrequest/detail?id=${item.id}`}>
                          <a className="btAction">{item.construction.name}</a>
                        </Link>
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
                        {mo_id == null && !item.done && (
                          <button
                            className="btRemove"
                            onClick={() => handleBtRemove(item.id)}
                            value={item.id}
                          >
                            <BsTrash size={16} color="red" />
                          </button>
                        )}
                        {mo_id == item.user.id && !item.done && (
                          <button
                            className="btRemove"
                            onClick={() => handleBtRemove(item.id)}
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
        </div>
      </div>
      {modalVisible && (
        <ModalAddOrderRequest
          isOpen={modalVisible}
          construction_id={undefined}
          onRequestClose={handleCloseModal}
          constructions={constructions}
          types={types}
        />
      )}
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    let response = await apiClient.get("/orderrequest/list");
    let mo_id = null;

    const userResponse = await apiClient.get("/me");
    if (userResponse.data.type == Util.USER_TYPE_MO)
      mo_id = userResponse.data.id;

    let responseTypeExpenses = await apiClient.get("/typeexpense/list");
    let responseConstruction = await apiClient.get("/construction/list", {
      params: { done: false },
    });

    return {
      props: {
        mo_id: mo_id,
        orderRequestList: response.data,
        constructions: responseConstruction.data,
        types: responseTypeExpenses.data,
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
});

interface OrderRequestsProps {
  mo_id: number;
  orderRequestList: OrderRequestItem[];
  constructions: ItemConstruction[];
  types: TypeExpense[];
}

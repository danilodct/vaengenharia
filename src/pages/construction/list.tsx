import { useState } from "react";
import Head from "next/head";
import Modal from "react-modal";
import { GoPrimitiveDot } from "react-icons/go";
import { BsTrash } from "react-icons/bs";
import { AiFillEdit, AiOutlineEye } from "react-icons/ai";

import { canSSRAuth } from "../../util/canSSRAuth";
import { setupAPIClient } from "../../util/api";
import { Header } from "../../components/Header";
import { Menu } from "../../components/Menu";
import { InputSearch } from "../../components/ui/InputSearch";
import { ModalAddConstruction } from "../../components/Modal/ModalAddConstruction";

import Util from "../../util/Util";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ConstructionList({
  constructionList,
}: ConstructionProps) {
  const [constructions, setConstructions] = useState(constructionList || []);
  const [modalVisible, setModalVisible] = useState(false);

  Modal.setAppElement("#__next");

  function handleOpenModal() {
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
  }

  async function handleFilterAll(e) {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/construction/list");
    resetSearchInput();
    resetFilterBts();
    e.target.classList.toggle("actived");
    setConstructions(response.data);
  }

  async function handleFilterDoing(e) {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/construction/list", {
      params: { done: false },
    });
    resetSearchInput();
    resetFilterBts();
    e.target.classList.toggle("actived");
    setConstructions(response.data);
  }

  async function handleFilterDone(e) {
    const apiClient = setupAPIClient();
    const response = await apiClient.get("/construction/list", {
      params: { done: true },
    });
    resetSearchInput();
    resetFilterBts();
    e.target.classList.toggle("actived");
    setConstructions(response.data);
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
    const response = await apiClient.get("/construction/list", {
      params: { search: inputSearch },
    });
    resetFilterBts();
    const bt: HTMLCollection = document.getElementsByClassName("btFilterAll");
    bt[0].classList.add("actived");
    setConstructions(response.data);
  }

  async function handleBtRemove(id) {
    if (confirm(Util.MSG_SURE_REMOVE_CONSTRUCTION)) {
      const apiClient = setupAPIClient();
      let response = await apiClient.delete("/construction/delete", {
        params: { id },
      });
      if (response.status == 200) {
        toast.success(response.data);
        response = await apiClient.get("/construction/list");
        resetSearchInput();
        resetFilterBts();
        document.querySelector(".btFilterAll").classList.toggle("actived");
        setConstructions(response.data);
      } else {
        toast.error(response.data);
      }
    }
  }

  return (
    <div className="containerMor">
      <Head>
        <title>VA Engenharia - Nossas Obras</title>
      </Head>
      <div className="container">
        <Header />
        <div className="containerBottom">
          <Menu atual="construction" />
          <div className="main">
            <h1 className="title">Obras</h1>
            <InputSearch
              id="inputSearch"
              placeholder="pesquise pelo nome do cliente"
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
                  Em andamento
                </button>
                <button className="btFilter" onClick={handleFilterDone}>
                  Concluídas
                </button>
              </div>
              <button className="btPrimary" onClick={handleOpenModal}>
                + Nova Obra
              </button>
            </div>

            <div className="areaLegend">
              <GoPrimitiveDot color="green" size={20} /> Concluída
              <GoPrimitiveDot color="yellow" size={20} /> Em Andamento
              <GoPrimitiveDot color="red" size={20} /> Fora do prazo
            </div>

            <table className="tableList">
              <thead>
                <tr>
                  <th></th>
                  <th>CONTRATO</th>
                  <th>CLIENTE</th>
                  <th>DATA PREVISTA</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {constructions.length == 0 && (
                  <tr>
                    <td colSpan={5} className="infoNoData">
                      Nenhuma obra encontrada
                    </td>
                  </tr>
                )}
                {constructions.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {item.done}
                        {Util.checkConstructionStatus(
                          item.done,
                          item.dateEnd
                        ) == Util.STATUS_DONE && (
                          <GoPrimitiveDot color="green" size={20} />
                        )}
                        {Util.checkConstructionStatus(
                          item.done,
                          item.dateEnd
                        ) == Util.STATUS_DOING && (
                          <GoPrimitiveDot color="yellow" size={20} />
                        )}
                        {Util.checkConstructionStatus(
                          item.done,
                          item.dateEnd
                        ) == Util.STATUS_LATE && (
                          <GoPrimitiveDot color="red" size={20} />
                        )}
                      </td>
                      <td>
                        <Link href={`/construction/detail?id=${item.id}`}>
                          <a className="btAction">{item.name}</a>
                        </Link>
                      </td>
                      <td>{item.clientName}</td>
                      <td>{Util.parseDateFromUSA(item.dateEnd)}</td>
                      <td>
                        <Link href={`/construction/detail?id=${item.id}`}>
                          <a className="btAction">
                            <AiOutlineEye size={16} color="var(--blue-600)" />
                          </a>
                        </Link>
                        <Link href={`/construction/edit?id=${item.id}`}>
                          <a className="btAction">
                            <AiFillEdit size={16} color="black" />
                          </a>
                        </Link>
                        <button
                          className="btRemove"
                          onClick={() => handleBtRemove(item.id)}
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
        </div>
      </div>
      {modalVisible && (
        <ModalAddConstruction
          isOpen={modalVisible}
          onRequestClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/construction/list");

    return {
      props: {
        constructionList: response.data,
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

export type ItemConstruction = {
  id: number;
  name: string;
  dateStart: Date;
  dateEnd: Date;
  budget: number;
  address: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientCpf: string;
  done: boolean;
};

interface ConstructionProps {
  constructionList: ItemConstruction[];
}

import Head from "next/head";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import Link from "next/link";
import { ImFolderDownload } from "react-icons/im";
import { toast } from "react-toastify";

import { Header } from "../../components/Header";
import { Menu } from "../../components/Menu";
import { Contributions } from "../../components/Contributions";
import { Expenses } from "../../components/Expenses";
import {
  OrderRequestItem,
  OrderRequests,
} from "../../components/OrderRequests";
import { TypeExpense } from "../../components/Modal/ModalAddExpense";
import { canSSRAuth } from "../../util/canSSRAuth";
import { setupAPIClient } from "../../util/api";
import Util from "../../util/Util";
import { AuthContext } from "../../util/AuthContext";
import { GoPrimitiveDot } from "react-icons/go";

export default function ConstructionDetail({
  item,
  contributions,
  expenses,
  types,
  orderrequests,
}: ConstructionProps) {
  const { user } = useContext(AuthContext);
  const [contractFile, setContractFile] = useState(null);
  const [contractUrl, setContractUrl] = useState(null);
  const [contractBD, setContractBD] = useState(item.contract || null);

  function getTotalExpenses() {
    let total = 0;
    for (let i = 0; i < expenses.length; i += 1) {
      total += expenses[i].value;
    }
    return total;
  }

  async function handleUploadContractForm(e: FormEvent) {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("id", item.id.toString());
      data.append("file", contractFile);

      if (!contractFile || !contractUrl) {
        toast.error("Selecione um arquivo");
      } else {
        const apiClient = setupAPIClient();
        const contractBDUrl = await apiClient.post(
          "/construction/uploadContract",
          data
        );
        setContractBD(contractBDUrl.data);

        toast.success(Util.CONTRACT_UPLOAD_SUCCESS);
      }
    } catch (e) {
      toast.error(e.message);
    }
  }

  function handleUploadContract(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const contract = e.target.files[0];
    if (!contract) {
      return;
    }

    setContractFile(contract);
    setContractUrl(URL.createObjectURL(e.target.files[0]));
  }

  function getLoadingStatusCSS() {
    let css = "";
    if (getTotalExpenses() / parseFloat(item.budget) < 0.8) {
      css = "green";
    } else if (getTotalExpenses() / parseFloat(item.budget) < 1) {
      css = "yellow";
    } else {
      css = "red";
    }
    return css;
  }

  return (
    <div className="containerMor">
      <Head>
        <title>VA Engenharia - {item.name}</title>
      </Head>
      <div className="container">
        <Header />
        <div className="containerBottom">
          <Menu atual="construction" />
          <div className="main">
            <div className="modalHeader">
              <h1>
                {item.name}{" "}
                <span className={getLoadingStatusCSS()}>
                  (
                  {Util.formatPercent(
                    getTotalExpenses() / parseFloat(item.budget)
                  )}
                  )
                </span>
              </h1>
            </div>
            <div className="formLine">
              <div className="inputFake noBorder ">
                <label>
                  {Util.checkConstructionStatus(item.done, item.dateEnd) ==
                    Util.STATUS_DONE && (
                    <GoPrimitiveDot color="green" size={20} />
                  )}
                  {Util.checkConstructionStatus(item.done, item.dateEnd) ==
                    Util.STATUS_DOING && (
                    <GoPrimitiveDot color="yellow" size={20} />
                  )}
                  {Util.checkConstructionStatus(item.done, item.dateEnd) ==
                    Util.STATUS_DONE && (
                    <GoPrimitiveDot color="red" size={20} />
                  )}
                  {Util.checkConstructionStatus(item.done, item.dateEnd) ==
                    Util.STATUS_DONE && "Concluída"}
                  {Util.checkConstructionStatus(item.done, item.dateEnd) ==
                    Util.STATUS_DOING && "Em andamento"}
                  {Util.checkConstructionStatus(item.done, item.dateEnd) ==
                    Util.STATUS_DONE && "Atrasada"}
                </label>
              </div>
            </div>
            <div className="subHeader">
              <div>
                <span className="green">Orçado: </span>{" "}
                {Util.formatCurrencyStr(item.budget)}
              </div>
              <div>
                <span className="red">Realizado: </span>
                {Util.formatCurrency(getTotalExpenses())} <span className={getLoadingStatusCSS()}>(
                {Util.formatPercent(
                  getTotalExpenses() / parseFloat(item.budget)
                )}
                )</span>
              </div>
            </div>
            <div className="formLine2">
              <div>
                <label>Data Início:</label>
                <div className="inputFake">
                  {Util.parseDateStrFromUSA(item.dateStart.toString())}
                </div>
              </div>
              <div>
                <label>Data Fim:</label>
                <div className="inputFake">
                  {Util.parseDateStrFromUSA(item.dateEnd.toString())}
                </div>
              </div>
            </div>
            <div className="formLine">
              <label>Endereço:</label>
              <div className="inputFake">{item.address}</div>
            </div>
            <div className="formLine">
              <label>Cliente:</label>
              <div className="inputFake">{item.clientName}</div>
            </div>
            <div className="formLine3">
              <div>
                <label>Telefone:</label>
                <div className="inputFake">
                  {Util.formatPhoneNumber(item.clientPhone)}
                </div>
              </div>
              <div>
                <label>Email:</label>
                <div className="inputFake">{item.clientEmail}</div>
              </div>
              <div>
                <label>CPF/CNPJ:</label>
                <div className="inputFake">
                  {Util.formatCPF(item.clientCpf)}
                </div>
              </div>
            </div>
            <div className="modalFooter">
              <Link href={`/construction/edit?id=${item.id}`}>
                <a className="btPrimary">Editar</a>
              </Link>
            </div>
            <div className="subsection">
              <span>Contrato</span>
              {contractBD && (
                <Link href={`${Util.SERVER_BASE_URL}/files/${contractBD}`}>
                  <a target="_blank">
                    <ImFolderDownload size={20} color="var(--blue-400)" />
                    Faça o download
                  </a>
                </Link>
              )}
            </div>
            <div>
              <form onSubmit={handleUploadContractForm} className="modalForm">
                <div className="formLine2 start">
                  <div>
                    <input type="file" onChange={handleUploadContract} />
                  </div>
                  <div className="p">
                    <input type="submit" value="Enviar" className="btPrimary" />
                  </div>
                </div>
              </form>
            </div>
            <OrderRequests
              construction_id={item.id}
              types={types}
              orderRequestsList={orderrequests}
            />
            {user?.type == Util.USER_TYPE_DIR && (
              <Contributions
                construction_id={item.id}
                contributions={contributions}
              />
            )}
            {user?.type == Util.USER_TYPE_DIR && (
              <Expenses
                construction_id={item.id}
                expenses={expenses}
                types={types}
              />
            )}

            {/* <Reports finances={finances} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const id = ctx.query.id;
    const apiClient = setupAPIClient(ctx);
    let response = await apiClient.get("/construction/detail", {
      params: { id: id },
    });

    if (!response.data) {
      return {
        redirect: {
          destination: "/construction/list",
          permanent: false,
        },
      };
    }

    let responseContributions = await apiClient.get("/contribution/list", {
      params: { construction_id: id },
    });

    let responseExpenses = await apiClient.get("/expense/list", {
      params: { construction_id: id },
    });

    let responseOrderRequests = await apiClient.get("/orderrequest/list", {
      params: { construction_id: id },
    });

    let responseTypeExpenses = await apiClient.get("/typeexpense/list");

    // let responseFinance = await apiClient.get("/finance/report", {
    //   params: { construction_id: id },
    // });

    return {
      props: {
        item: response.data,
        contributions: responseContributions.data,
        expenses: responseExpenses.data,
        types: responseTypeExpenses.data,
        orderrequests: responseOrderRequests.data,
        // finances: responseFinance.data,
      },
    };
  } catch (e) {
    Util.printError(e);
    return {
      redirect: {
        destination: "/construction/list",
        permanent: false,
      },
    };
  }
});

export type ItemConstruction = {
  id: number;
  name: string;
  clientName: string;
  dateStart: Date;
  dateEnd: Date;
  budget: string;
  address: string;
  clientPhone: string;
  clientEmail: string;
  clientCpf: string;
  done: boolean;
  contract: string;
};

export type ItemContribution = {
  id: number;
  date: Date;
  contribution: string;
  construction: ItemConstruction;
};

export interface ConstructionProps {
  item: ItemConstruction;
  contributions: ItemContribution[];
  expenses: ItemExpense[];
  types: TypeExpense[];
  orderrequests: OrderRequestItem[];
}

export type ItemExpense = {
  id: number;
  date: Date;
  value: number;
  type: TypeExpense;
  construction: ItemConstruction;
};

export interface ExpenseProps {
  item: ItemConstruction;
  expenses: ItemExpense[];
}

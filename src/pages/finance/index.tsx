import { useState } from "react";
import styles from "./styles.module.css";
import Head from "next/head";

import { canSSRAuth } from "../../util/canSSRAuth";
import { setupAPIClient } from "../../util/api";
import { Header } from "../../components/Header";
import { Menu } from "../../components/Menu";

import Util from "../../util/Util";
import { ItemContribution, ItemExpense } from "../construction/detail";
import { FaTasks } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { ItemConstruction } from "../construction/list";

export default function Finance({
  expenseList,
  contributionList,
  constructionList,
}: FinanceProps) {
  const [expenses, setExpenses] = useState(expenseList || []);
  const [contributions, setContributions] = useState(contributionList || []);
  const [construction, setConstruction] = useState(null);
  const [month, setMonth] = useState(null);

  function getTotalContributions() {
    let total = 0;
    for (let i = 0; i < contributions.length; i += 1) {
      total += parseInt(contributions[i].contribution);
    }
    return Util.formatCurrencyStr(total.toString());
  }

  function getTotalExpenses() {
    let total = 0;
    for (let i = 0; i < expenses.length; i += 1) {
      total += expenses[i].value;
    }
    return Util.formatCurrencyStr(total.toString());
  }

  function getBalanceStr() {
    let totalContributions = 0;
    for (let i = 0; i < contributions.length; i += 1) {
      totalContributions += parseInt(contributions[i].contribution);
    }
    let totalExpenses = 0;
    for (let i = 0; i < expenses.length; i += 1) {
      totalExpenses += expenses[i].value;
    }
    return Util.formatCurrency(totalContributions - totalExpenses);
  }
  function getBalance() {
    let totalContributions = 0;
    for (let i = 0; i < contributions.length; i += 1) {
      totalContributions += parseInt(contributions[i].contribution);
    }
    let totalExpenses = 0;
    for (let i = 0; i < expenses.length; i += 1) {
      totalExpenses += expenses[i].value;
    }
    return totalContributions - totalExpenses;
  }

  async function handleChangeConstruction(e) {
    setConstruction(e.target.value);
    let newConstructionId = e.target.value;
    if (newConstructionId == -1) newConstructionId = undefined;

    const newMonth = month;
    let dtBegin = undefined;
    let dtEnd = undefined;
    const today = new Date();
    if (newMonth == 1) {
      dtBegin = new Date(today.getFullYear(), 0, 1);
      dtEnd = new Date(today.getFullYear(), 1, 0);
    } else if (newMonth == 2) {
      dtBegin = new Date(today.getFullYear(), 1, 1);
      dtEnd = new Date(today.getFullYear(), 2, 0);
    } else if (newMonth == 3) {
      dtBegin = new Date(today.getFullYear(), 2, 1);
      dtEnd = new Date(today.getFullYear(), 3, 0);
    } else if (newMonth == 4) {
      dtBegin = new Date(today.getFullYear(), 3, 1);
      dtEnd = new Date(today.getFullYear(), 4, 0);
    } else if (newMonth == 5) {
      dtBegin = new Date(today.getFullYear(), 4, 1);
      dtEnd = new Date(today.getFullYear(), 5, 0);
    } else if (newMonth == 6) {
      dtBegin = new Date(today.getFullYear(), 5, 1);
      dtEnd = new Date(today.getFullYear(), 6, 0);
    } else if (newMonth == 7) {
      dtBegin = new Date(today.getFullYear(), 6, 1);
      dtEnd = new Date(today.getFullYear(), 7, 0);
    } else if (newMonth == 8) {
      dtBegin = new Date(today.getFullYear(), 7, 1);
      dtEnd = new Date(today.getFullYear(), 8, 0);
    } else if (newMonth == 9) {
      dtBegin = new Date(today.getFullYear(), 8, 1);
      dtEnd = new Date(today.getFullYear(), 9, 0);
    } else if (newMonth == 10) {
      dtBegin = new Date(today.getFullYear(), 9, 1);
      dtEnd = new Date(today.getFullYear(), 10, 0);
    } else if (newMonth == 11) {
      dtBegin = new Date(today.getFullYear(), 10, 1);
      dtEnd = new Date(today.getFullYear(), 11, 0);
    } else if (newMonth == 12) {
      dtBegin = new Date(today.getFullYear(), 11, 1);
      dtEnd = new Date(today.getFullYear() + 1, 0, 0);
    }
    const apiClient = setupAPIClient();
    let response = await apiClient.get("/expense/list", {
      params: { construction_id: newConstructionId, dtBegin, dtEnd },
    });
    setExpenses(response.data);
    response = await apiClient.get("/contribution/list", {
      params: { construction_id: newConstructionId, dtBegin, dtEnd },
    });
    setContributions(response.data);
  }

  async function handleChangeMonth(e) {
    let newConstruction = construction;
    setMonth(e.target.value);
    const newMonth = e.target.value;
    let dtBegin = undefined;
    let dtEnd = undefined;
    const today = new Date();
    if (newMonth == 1) {
      dtBegin = new Date(today.getFullYear(), 0, 1);
      dtEnd = new Date(today.getFullYear(), 1, 0);
    } else if (newMonth == 2) {
      dtBegin = new Date(today.getFullYear(), 1, 1);
      dtEnd = new Date(today.getFullYear(), 2, 0);
    } else if (newMonth == 3) {
      dtBegin = new Date(today.getFullYear(), 2, 1);
      dtEnd = new Date(today.getFullYear(), 3, 0);
    } else if (newMonth == 4) {
      dtBegin = new Date(today.getFullYear(), 3, 1);
      dtEnd = new Date(today.getFullYear(), 4, 0);
    } else if (newMonth == 5) {
      dtBegin = new Date(today.getFullYear(), 4, 1);
      dtEnd = new Date(today.getFullYear(), 5, 0);
    } else if (newMonth == 6) {
      dtBegin = new Date(today.getFullYear(), 5, 1);
      dtEnd = new Date(today.getFullYear(), 6, 0);
    } else if (newMonth == 7) {
      dtBegin = new Date(today.getFullYear(), 6, 1);
      dtEnd = new Date(today.getFullYear(), 7, 0);
    } else if (newMonth == 8) {
      dtBegin = new Date(today.getFullYear(), 7, 1);
      dtEnd = new Date(today.getFullYear(), 8, 0);
    } else if (newMonth == 9) {
      dtBegin = new Date(today.getFullYear(), 8, 1);
      dtEnd = new Date(today.getFullYear(), 9, 0);
    } else if (newMonth == 10) {
      dtBegin = new Date(today.getFullYear(), 9, 1);
      dtEnd = new Date(today.getFullYear(), 10, 0);
    } else if (newMonth == 11) {
      dtBegin = new Date(today.getFullYear(), 10, 1);
      dtEnd = new Date(today.getFullYear(), 11, 0);
    } else if (newMonth == 12) {
      dtBegin = new Date(today.getFullYear(), 11, 1);
      dtEnd = new Date(today.getFullYear() + 1, 0, 0);
    }
    const apiClient = setupAPIClient();
    if (!newConstruction || newConstruction == -1) newConstruction = undefined;
    let response = await apiClient.get("/expense/list", {
      params: { construction_id: newConstruction, dtBegin, dtEnd },
    });
    setExpenses(response.data);
    response = await apiClient.get("/contribution/list", {
      params: { construction_id: newConstruction, dtBegin, dtEnd },
    });
    setContributions(response.data);
  }
  function getLoadingStatusCSS() {
    let css = "";
    if (getBalance() > 0) {
      css = "green";
    } else if (getBalance() < 0) {
      css = "red";
    }
    return css;
  }

  return (
    <div className="containerMor">
      <Head>
        <title>VA Engenharia - Movimentações Financeiras</title>
      </Head>
      <div className="container">
        <Header />
        <div className="containerBottom">
          <Menu atual="finance" />
          <div className="main">
            <h1 className="title">Movimentações Financeiras</h1>

            <div className={styles.areaFilters}>
              <div className="formLine2">
                <div>
                  <label htmlFor="construction">Escolha uma obra:</label>
                  <select
                    id="construction"
                    name="construction"
                    onChange={handleChangeConstruction}
                  >
                    <option value="-1">Todas as obras</option>
                    {constructionList.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label htmlFor="month">Escolha um mês:</label>
                  <select id="month" name="month" onChange={handleChangeMonth}>
                    <option value="-1">Todos os meses</option>
                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                    <option value="4">Abril</option>
                    <option value="5">Maio</option>
                    <option value="6">Junho</option>
                    <option value="7">Julho</option>
                    <option value="8">Agosto</option>
                    <option value="9">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="areaTotal major">
              <span>Total</span>
              <span className={getLoadingStatusCSS()}>{getBalanceStr()}</span>
            </div>
            <div className={styles.areaExtract}>
              <div className={styles.areaExpenses}>
                <h1 className={styles.headerExpenses}>
                  <div className="flexAlignCenter">
                    <RiMoneyDollarCircleFill
                      color="red"
                      size={25}
                      className={styles.cashIcon}
                    />
                    Saídas
                  </div>
                  <span>{getTotalExpenses()}</span>
                </h1>

                <table className="tableList">
                  <thead>
                    <tr>
                      <th>DATA TRANSAÇÃO</th>
                      <th>OBRA</th>
                      <th>VALOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.length == 0 && (
                      <tr>
                        <td colSpan={5} className="infoNoData">
                          Nenhuma saída
                        </td>
                      </tr>
                    )}
                    {expenses.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{Util.parseDateFromUSA(item.date)}</td>
                          <td>{item.construction.name}</td>
                          <td>{Util.formatCurrency(item.value)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className={styles.areaContributions}>
                <h1 className={styles.headerContributions}>
                  <div className="flexAlignCenter">
                    <RiMoneyDollarCircleFill
                      color="green"
                      size={25}
                      className={styles.cashIcon}
                    />
                    Entradas
                  </div>
                  <span>{getTotalContributions()}</span>
                </h1>

                <table className="tableList">
                  <thead>
                    <tr>
                      <th>DATA TRANSAÇÃO</th>
                      <th>OBRA</th>
                      <th></th>
                      <th>VALOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contributions.length == 0 && (
                      <tr>
                        <td colSpan={5} className="infoNoData">
                          Nenhuma entrada
                        </td>
                      </tr>
                    )}
                    {contributions.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{Util.parseDateFromUSA(item.date)}</td>
                          <td>{item.construction.name}</td>
                          <td className="linhaTracejada"></td>
                          <td>{Util.formatCurrencyStr(item.contribution)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const userResponse = await apiClient.get("/me");
    if (userResponse.data.type != Util.USER_TYPE_DIR) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    let responseContribution = await apiClient.get("/contribution/list");
    let responseExpense = await apiClient.get("/expense/list");
    let responseConstruction = await apiClient.get("/construction/list");

    return {
      props: {
        expenseList: responseExpense.data,
        contributionList: responseContribution.data,
        constructionList: responseConstruction.data,
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

interface FinanceProps {
  expenseList: ItemExpense[];
  contributionList: ItemContribution[];
  constructionList: ItemConstruction[];
}

import Head from "next/head";
import InputMask from "react-input-mask";
import { NumericFormat } from "react-number-format";

import { Header } from "../../components/Header";
import { Menu } from "../../components/Menu";
import { useState } from "react";
import { canSSRAuth } from "../../util/canSSRAuth";
import { setupAPIClient } from "../../util/api";
import { ConstructionProps } from "./detail";
import { Input } from "../../components/ui/Input";
import Util from "../../util/Util";
import Link from "next/link";
import { toast } from "react-toastify";
import Router from "next/router";

export default function ConstructionEdit({ item }: ConstructionProps) {
  const [id, setId] = useState(item.id);
  const [name, setName] = useState(item.name);
  const [dateStart, setDateStart] = useState(
    Util.parseDateStrFromUSA(item.dateStart.toString())
  );
  const [dateEnd, setDateEnd] = useState(
    Util.parseDateStrFromUSA(item.dateEnd.toString())
  );
  const [budget, setBudget] = useState(item.budget);
  const [address, setAddress] = useState(item.address);
  const [clientName, setClientName] = useState(item.clientName);
  const [clientPhone, setClientPhone] = useState(item.clientPhone);
  const [clientEmail, setClientEmail] = useState(item.clientEmail);
  const [clientCpf, setClientCpf] = useState(item.clientCpf);
  const [done, setDone] = useState(item.done);

  async function handleSubmitForm(e) {
    e.preventDefault();

    try {
      if (
        name === "" ||
        clientName === "" ||
        dateStart == null ||
        dateEnd === null
      )
        throw new Error("Preencha todos os campos obrigatórios!");

      const apiClient = setupAPIClient();
      let response = await apiClient.post("/construction/edit", {
        id,
        done,
        name,
        dateStart,
        dateEnd,
        budget: Util.getOnlyNumbers(budget),
        clientName,
        address,
        clientEmail,
        clientPhone,
        clientCpf,
      });

      toast.success("Obra editada com sucesso!");
      Router.replace(`/construction/detail?id=${id}`);
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="containerMor">
      <Head>
        <title>VA Engenharia - Editar Obra</title>
      </Head>
      <div className="container">
        <Header />
        <div className="containerBottom">
          <Menu atual="construction" />
          <div className="main">
            <div className="modalHeader">
              <h1> Editar Obra</h1>
            </div>
            <form className="modalForm" onSubmit={handleSubmitForm}>
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
              <div className="formLine3">
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
                <div>
                  <label htmlFor="budget">Orçamento (R$):</label>
                  <NumericFormat
                    id="budget"
                    name="budget"
                    value={budget}
                    allowNegative={false}
                    decimalScale={2}
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix={"R$"}
                    onChange={(e) => {
                      setBudget(e.target.value);
                    }}
                    placeholder="Orçamento da obra"
                  />
                </div>
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
              <div className="formLine">
                <label htmlFor="address">Endereço:</label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  placeholder="Endereço da obra"
                />
              </div>
              <div className="formLine3">
                <div>
                  <label htmlFor="clientPhone">Telefone:</label>
                  <InputMask
                    id="clientPhone"
                    name="clientPhone"
                    value={clientPhone}
                    onChange={(e) => {
                      setClientPhone(e.target.value);
                    }}
                    placeholder="Telefone do Cliente"
                    mask="(99) 9.9999.9999"
                  />
                </div>
                <div>
                  <label htmlFor="clientEmail">Email:</label>
                  <Input
                    type="text"
                    id="clientEmail"
                    name="clientEmail"
                    value={clientEmail}
                    onChange={(e) => {
                      setClientEmail(e.target.value);
                    }}
                    placeholder="Email do Cliente"
                  />
                </div>
                <div>
                  <label htmlFor="clientCpf">CPF/CNPJ:</label>
                  <InputMask
                    id="clientCpf"
                    name="clientCpf"
                    value={clientCpf}
                    onChange={(e) => {
                      setClientCpf(e.target.value);
                    }}
                    placeholder="CPF/CNPJ do Cliente"
                    mask="999.999.999-99"
                  />
                </div>
              </div>
              <div className="modalFooter">
                <Link href={`/construction/list`}>
                  <a className="btSecundary">Cancelar</a>
                </Link>
                <button type="submit" className="btPrimary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
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

  return {
    props: {
      item: response.data,
    },
  };
});

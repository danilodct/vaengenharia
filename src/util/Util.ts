import { resolveObjectURL } from "buffer";
import moment from "moment";
import { resourceLimits } from "worker_threads";

export default class Util {
  static STATUS_DONE = "DONE";
  static STATUS_DOING = "DOING";
  static STATUS_LATE = "LATE";
  static MSG_SURE_REMOVE_CONSTRUCTION =
    "Tem certeza que deseja excluir esta obra?";
  static MSG_SURE_REMOVE_CONTRIBUTION =
    "Tem certeza que deseja excluir este item?";
  static MSG_SURE_REMOVE_ITEM = "Tem certeza que deseja excluir este item?";
  static MSG_SUCESS_BUY: string =
    "Compra feita com sucesso! Requisição encerrada!";
  static CONTRACT_UPLOAD_SUCCESS = "Contrato enviado com sucesso!";
  static ERROR_BUY: string =
    "Ocorreu um erro ao tentar concluir a compra desta requisição";

  static SERVER_BASE_URL = "http://www.vaeng.com.br:21019";
  static cookie = "@nextauth.token";
  static DEV_MODE = true;
  static USER_TYPE_SEC: string = "SEC";
  static USER_TYPE_DIR: string = "DIR";
  static USER_TYPE_MO: string = "MO";
  static ERROR_REMOVE_ITEM: string = "Ocorreu um erro ao tentar remover o item";
  static MSG_SUCESS_PURCHASE_ADD: string = "Compra efetuada com sucesso!";
  static MSG_ERROR_PURCHASE_ADD: string = "Não foi possível efetivar a compra!";

  static formatPercent(value: number) {
    let result = "0.0";
    if (value) {
      let mult = value * 100;
      result = mult + "%";
      const parts = result.split(".");
      let decimals = parts[1];
      if (decimals.length > 2) decimals = decimals.substring(0, 2);
      result = parts[0] + "," + decimals + "%";
    }
    return result;
  }

  static getOnlyNumbers(str: string) {
    let retorno = null;
    if (str) retorno = str.replace(/\D/g, "");
    return retorno;
  }

  static parseInt(str: string): number {
    let num = undefined;
    if (str) num = parseInt(str);
    return num;
  }

  static formatCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  static formatPhoneNumber(phoneNumber: string) {
    phoneNumber = phoneNumber.replace(/\s/g, "");
    var length = phoneNumber.length;
    var telefoneFormatado = phoneNumber;

    if (length === 8) {
      telefoneFormatado =
        "(81) 9." +
        phoneNumber.substring(0, 4) +
        "." +
        phoneNumber.substring(4, 8);
    } else if (length === 9) {
      telefoneFormatado =
        "(81) " +
        phoneNumber.substring(0, 5) +
        "." +
        phoneNumber.substring(5, 9);
    } else if (length === 11) {
      telefoneFormatado =
        "(" +
        phoneNumber.substring(0, 2) +
        ") 9." +
        phoneNumber.substring(3, 7) +
        "." +
        phoneNumber.substring(7, 10);
    }
    return telefoneFormatado;
  }

  static formatCurrencyStr(ammount: string) {
    const formatterBR = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    if (ammount === "" || ammount == null || ammount == undefined)
      ammount = "0";
    return formatterBR.format(parseInt(ammount));
  }
  static formatCurrency(ammount: number) {
    const formatterBR = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    if (ammount == null || ammount == undefined) ammount = 0;
    return formatterBR.format(ammount);
  }

  static print(txt: any) {
    if (Util.DEV_MODE) {
      console.log("####################");
      console.log(txt);
      console.log("####################");
    }
  }

  static printError(e: Error) {
    console.log("####### ERROR #########");
    console.log(e.message);
    console.log("####################");
  }

  static formatDate(dt: string) {
    console.log(dt);
    const date = new Date(dt);
    const year = date.getFullYear();
    let month: any = date.getMonth() + 1;
    if (month < 10) month = "0" + month.toString();
    let day: any = date.getDate() + 1;
    if (day < 10) day = "0" + day.toString();
    return day + "/" + month + "/" + year;
  }

  static checkConstructionStatus(done: boolean, dateEnd: Date) {
    let status = "";
    if (done) {
      status = this.STATUS_DONE;
    } else if (!done && new Date() >= new Date(dateEnd)) {
      status = Util.STATUS_LATE;
    } else if (!done && new Date() < new Date(dateEnd)) {
      status = Util.STATUS_DOING;
    }
    return status;
  }

  static parseDateStrFromUSA(date: string) {
    moment.locale("en");
    let newDate = date;
    if (date != null && date.length >= 10)
      newDate = moment.utc(date).format("DD/MM/YYYY");
    return newDate;
  }
  static parseDateFromUSA(date: Date) {
    let newDate: string = "";
    if (date) {
      moment.locale("en");
      if (date != null && date.toString().length >= 10)
        newDate = moment.utc(date).format("DD/MM/YYYY");
    }
    return newDate;
  }
  static parseDateToUSA(date: string) {
    let retorno = date;
    if (date != null && date.length > 0) {
      let partes = date.split("/");
      if (partes.length == 3) {
        retorno = partes[2] + "-" + partes[1] + "-" + partes[0];
      }
    }
    return retorno;
  }
}

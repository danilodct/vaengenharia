import styles from "./styles.module.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { HiOutlineDocumentReport } from "react-icons/hi";

export function Reports({ finances }: IFinances) {
  return (
    <div>
      <h1 className={styles.header}>
        <HiOutlineDocumentReport
          color="var(--blue-600)"
          size={25}
          className={styles.reportIcon}
        />
        Relatórios
      </h1>
      <div className={styles.areaReport}>
        <LineChart
          width={700}
          height={400}
          data={finances}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="in"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="out" stroke="#82ca9d" />
          <Line type="monotone" dataKey="balance" stroke="gray" />
        </LineChart>
      </div>
    </div>
  );
}

export interface IFinances {
  finances: JSON[];
}

export type ItemFinance = {
  date: Date;
  value: string;
  type: string;
};

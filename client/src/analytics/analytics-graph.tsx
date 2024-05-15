import { GraphFormat, GraphUnit } from "./analytics-types";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

interface LocalParams {
  name: string;
  data: GraphUnit[];
}

const AnalyticsGraph = (params: LocalParams) => {
  const { data, name } = params;

  return (
    <>
      <LineChart
        width={1000}
        height={300}
        data={[{ name, data }]}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="uv"
          name={name}
          data={data}
          stroke="#82ca9d"
        />
      </LineChart>
    </>
  );
};

export default AnalyticsGraph;
